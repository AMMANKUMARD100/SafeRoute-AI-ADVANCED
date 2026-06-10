import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.REACT_APP_API_URL, {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') },
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user]);

  const joinTripRoom = (tripId) => {
    socketRef.current?.emit('joinTrip', tripId);
  };

  const sendLocationUpdate = (tripId, location) => {
    socketRef.current?.emit('locationUpdate', { tripId, ...location });
  };

  const onLocationUpdate = (callback) => {
    socketRef.current?.on('locationChanged', callback);
    return () => socketRef.current?.off('locationChanged', callback);
  };

  return (
    <SocketContext.Provider
      value={{ connected, joinTripRoom, sendLocationUpdate, onLocationUpdate }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;