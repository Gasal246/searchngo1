import { io } from 'socket.io-client';
import { socket_server_url } from './lib/constants/constatntUrls';

const SOCKET_SERVER_URL = socket_server_url;

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      path: '/socket.io',
    });

    socket.on('connect', () => {
      console.log('Connected to the server:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }
  return socket;
};

export const joinChannel = (channel) => {
  if (socket) {
    socket.emit('joinChannel', channel);
    console.log(`Joined channel: ${channel}`);
  }
};

export const listenToEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  }
};

export const emitEvent = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
