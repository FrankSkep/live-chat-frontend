# Real-Time Chat Frontend

This is the frontend for a real-time chat application built with SvelteKit and Socket.IO. The application allows users to create rooms, send messages, and receive real-time updates.

## Backend Repository

The backend repository for this frontend can be found at [https://github.com/FrankSkep/live-chat-api](https://github.com/FrankSkep/live-chat-api). This backend is built with NestJS, Mongoose, and Socket.IO to provide real-time communication and room management functionalities.


## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [License](#license)

## Features

- **Real-time Communication**: Users can send and receive messages in real-time.
- **Room Management**: Create, join, and leave chat rooms.
- **User Notifications**: Receive notifications when users connect or disconnect.
- **Message History**: Retrieve the message history of a chat room.
- **Typing Indicators**: See when other users are typing.
- **Secure Rooms**: Option to create password-protected chat rooms.
- **Message Deletion**: Ability to delete all messages from a chat room.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/FrankSkep/live-chat-frontend
    cd real-time-chat-frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.