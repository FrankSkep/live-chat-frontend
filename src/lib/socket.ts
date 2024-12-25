import io from 'socket.io-client';

const createSocket = (username: string) => {

  /* Use this for local testing 
  return io('http://localhost:3034', {
    query: { username }
  });
  */
	return io('https://live-chat-api-4y0u.onrender.com', {
		query: { username }
	});
};

export default createSocket;