import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Obtén el token del localStorage
    const token = localStorage.getItem('accessToken');

    // Inicializa el socket con el token en el handshake
    const socketInstance = io(SOCKET_URL, {
      auth: {
        token, // Envía el token en el handshake
      },
    });

    setSocket(socketInstance);

    // Limpia la conexión al desmontar el componente
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};