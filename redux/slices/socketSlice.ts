import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket_server_url } from '../../lib/constants/constatntUrls';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
}

const initialState: SocketState = {
  socket: null,
  isConnected: false,
};

// Async action to connect socket
export const connectSocket = createAsyncThunk('socket/connect', async (_, { rejectWithValue }) => {
  try {
    const userToken = await AsyncStorage.getItem('user_token');
    if (!userToken) {
      console.log('No user token - skipping socket connection');
      return rejectWithValue('No token available');
    }

    const newSocket = io(socket_server_url, {
      transports: ['websocket'],
      query: { token: userToken },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    return new Promise<Socket>((resolve, reject) => {
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        resolve(newSocket);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      newSocket.on('connect_error', (err) => {
        console.log('Socket connection error:', err.message);
        reject(err);
      });

      newSocket.connect();
    });
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Async action to disconnect socket
export const disconnectSocket = createAsyncThunk('socket/disconnect', async (_, { getState }) => {
  const { socket } = (getState() as { socket: SocketState }).socket;
  if (socket) {
    socket.disconnect();
    console.log('Socket disconnected');
  }
});

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectSocket.fulfilled, (state, action: PayloadAction<any>) => {
        state.socket = action.payload;
        state.isConnected = true;
      })
      .addCase(connectSocket.rejected, (state) => {
        state.socket = null;
        state.isConnected = false;
      })
      .addCase(disconnectSocket.fulfilled, (state) => {
        state.socket = null;
        state.isConnected = false;
      });
  },
});

export default socketSlice.reducer;
