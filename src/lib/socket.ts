import io from 'socket.io-client';

const createSocket = (username: string) => {
	const api = import.meta.env.VITE_API_URL || 'http://localhost:3034';
	return io(api, {
		query: { username }
	});
};

export default createSocket;
