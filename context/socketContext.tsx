// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket_server_url } from '../lib/constants/constatntUrls';

type WebSocketMessage = {
  type: string;
  payload: any;
};

type SocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  connectSocket: () => Promise<void>;
  disconnectSocket: () => void;
  sendMessage: (type: string, payload: any) => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectSocket: async () => {},
  disconnectSocket: () => {},
  sendMessage: () => {},
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;
  let reconnectAttempts = 0;

  const connectSocket = async () => {
    try {
      const userToken = await AsyncStorage.getItem('user_token');
      if (!userToken) return;

      const wsUrl = socket_server_url;
      const newSocket = new WebSocket(`${wsUrl}?token=${userToken}`);

      newSocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts = 0;
      };

      newSocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        handleReconnect();
      };

      newSocket.onerror = (error) => {
        console.log('WebSocket error:', error);
      };

      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleIncomingMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      setSocket(newSocket);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      handleReconnect();
    }
  };

  const handleReconnect = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }

    reconnectTimeout.current = setTimeout(() => {
      reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${reconnectAttempts}`);
      connectSocket();
    }, reconnectDelay * reconnectAttempts);
  };

  const handleIncomingMessage = (message: WebSocketMessage) => {
    // Handle different types of incoming messages
    switch (message.type) {
      case 'verificationRequest':
        // Handle verification request
        break;
      // Add other message type handlers as needed
      default:
        console.log('Received message:', message);
    }
  };

  const sendMessage = (type: string, payload: any) => {
    if (socket && isConnected) {
      const message: WebSocketMessage = { type, payload };
      socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
  };

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectSocket, disconnectSocket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);