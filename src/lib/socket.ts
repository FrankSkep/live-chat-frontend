import io from 'socket.io-client';

const createSocket = (username: string) => {
    return io('http://localhost:3033', {
      query: { username }
    });
  };

export default createSocket;