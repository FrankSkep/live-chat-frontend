<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import createSocket from '$lib/socket';

    export let data;

    let room = data.roomId;
    let currentRoom = room;
    let password = '';
    let messages: any = [];
    let message = '';
    let typingMessage = '';
    let username = '';
    let socket: any;
    let sidebarVisible = false;
    let isPasswordCorrect = false;

    onMount(() => {
        username = localStorage.getItem('username') || 'Guest';

        socket = createSocket(username);

        socket.emit('setUsername', username);
        joinRoom(username);

        socket.on('messageHistory', (msgs: any) => {
            messages = msgs;
        });

        socket.on('message', (msg: any) => {
            messages = [...messages, msg];
        });

        socket.on('notification', (notification: any) => {
            messages = [
                ...messages,
                {
                    sender: 'System',
                    content: notification.content,
                    createdAt: notification.createdAt,
                },
            ];
        });

        socket.on('typing', (typingMsg: any) => {
            typingMessage = typingMsg;
        });

        socket.on('deleteMessages', () => {
            messages = [];

            const messagesDiv = document.getElementById('messages');
            if (messagesDiv) {
                messagesDiv.innerHTML = '';
            }
        });

        socket.on('roomCreated', (room: any) => {
            alert(`Room ${room.name} created successfully`);
        });

        socket.on('passwordStatus', (status: boolean) => {
            isPasswordCorrect = status;
            if (!status) {
                alert('Incorrect password');
            }
        });
    });

    afterUpdate(() => {
        const lastMessage = document.querySelector('#messages div:last-child');
        if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: 'smooth' });
        }
    });

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    function sendMessage() {
        if (!isPasswordCorrect) {
            alert('Cannot send message. Incorrect password.');
            return;
        }
        if (message.trim() !== '') {
            socket.emit('message', {
                sender: username,
                content: message,
                room,
            });
            message = '';
        } else {
            alert('Please enter a message.');
        }
    }

    function deleteMessages() {
        console.log(`Deleting messages in room ${room}`);
        socket.emit('deleteMessages', room);
    }

    function changeRoom() {
        messages = [];
        socket.emit('leaveRoom', { room });
        socket.emit('joinRoom', { room, username, password });

        currentRoom = room;
    }

    function joinRoom(username: string) {
        socket.emit('joinRoom', { room, username, password });
    }

    function createRoom() {
        socket.emit('createRoom', { name: room, password });
    }

    function handleTyping() {
        socket.emit('typing', { room, username });
    }

    function toggleSidebar() {
        sidebarVisible = !sidebarVisible;
    }
</script>

<div class="main-container">
    <button class="toggle-sidebar-btn" on:click={toggleSidebar}>☰</button>
    <div class="sidebar {sidebarVisible ? 'visible' : ''}">
        <h2>Change or Create Room</h2>
        <label for="room">Room Name</label>
        <input type="text" id="room" bind:value={room} placeholder="Write room name..." />
        <label for="password">Password (optional)</label>
        <input type="password" id="password" bind:value={password} placeholder="Password (optional)" />
        <button on:click={changeRoom}>Connect</button>
        <button on:click={createRoom}>Create Room</button>
    </div>

    <div class="chat-container">
        <h1>Room: {currentRoom}</h1>
        <div id="messages">
            {#each messages as msg}
                <div>{msg.sender}: {msg.content}
                    <span>{formatDate(msg.createdAt)}</span>
                </div>
            {/each}
            {#if typingMessage}
                <div id="typing">{typingMessage}</div>
            {/if}
        </div>
        <div class="input-container">
            <label for="message">Message</label>
            <input type="text" id="message" bind:value={message} placeholder="Write your message..." on:input={handleTyping} />
            <button on:click={sendMessage}>Send</button>
            <button on:click={deleteMessages}>Delete Messages</button>
        </div>
    </div>
</div>

<style>
    :global(body) {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #e0e0e0;
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        height: 100vh;
        overflow: hidden;
    }

    .main-container {
        display: flex;
        width: 100%;
        height: 100%;
    }

    .sidebar {
        width: 300px;
        background-color: rgba(22, 33, 62, 0.9);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border-right: 1px solid #0f3460;
        box-sizing: border-box;
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
    }

    .chat-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        box-sizing: border-box;
    }

    #messages {
        background-color: rgba(22, 33, 62, 0.9);
        padding: 1rem;
        border-radius: 5px;
        flex-grow: 1;
        overflow-y: auto;
        margin-bottom: 1rem;
        max-height: 70vh;
        backdrop-filter: blur(10px);
    }

    #messages div {
        background-color: #0f3460;
        padding: 0.5rem;
        border-radius: 5px;
        margin-bottom: 0.5rem;
        transition: transform 0.3s;
    }

    #messages div:hover {
        transform: translateY(-2px);
    }

    #messages div span {
        display: block;
        font-size: 0.8rem;
        color: #a0a0a0;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    input[type='text'],
    input[type='password'] {
        display: block;
        width: calc(100% - 20px);
        margin: 0 auto;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background: #0f3460;
        color: #e0e0e0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s;
    }

    input[type='text']:focus,
    input[type='password']:focus {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        outline: none;
    }

    button {
        display: block;
        width: calc(100% - 20px);
        margin: 0 auto;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background: #00adb5;
        color: #1a1a2e;
        font-weight: bold;
        cursor: pointer;
        transition:
            background 0.3s,
            transform 0.3s,
            box-shadow 0.3s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: white;
    }

    button:hover {
        background: #00a3a5;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    button:active {
        transform: translateY(0);
    }

    #typing {
        color: #00adb5;
        font-style: italic;
        margin-top: 1rem;
    }

    .toggle-sidebar-btn {
        display: none;
        position: absolute;
        top: 10px;
        right: 10px;
        background: #00adb5;
        color: #1a1a2e;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
    }

    @media (max-width: 768px) {
        .sidebar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
        }

        .sidebar.visible {
            transform: translateX(0);
        }

        .toggle-sidebar-btn {
            display: block;
            max-width: 50px;
        }
    }
</style>
