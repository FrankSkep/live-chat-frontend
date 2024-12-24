<script lang="ts">
    import { onMount } from 'svelte';
    import createSocket from '$lib/socket';

    export let data;

    let room = data.roomId;
    let password = '';
    let messages: any = [];
    let message = '';
    let typingMessage = '';
    let username = '';
    let socket : any;

    onMount(() => {
        username = localStorage.getItem('username') || 'Guest';
        
        socket = createSocket(username);

        socket.emit('setUsername', username);
        joinRoom(username);

        socket.on('messageHistory', (msgs : any) => {
            messages = msgs;
        });

        socket.on('message', (msg : any) => {
            messages = [...messages, msg];
        });

        socket.on('notification', (notification : any) => {
            messages = [...messages, { sender: 'System', content: notification }];
        });

        socket.on('typing', (typingMsg : any) => {
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
    });

    function formatDate(dateString : string) : string {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    function sendMessage() {
        if (message.trim() !== '') {
            socket.emit('message', { sender: username, content: message, room });
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
</script>

<style>
    :global(body) {
        background-color: #1a1a2e;
        color: #e0e0e0;
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
    }

    .chat-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 1rem;
    }

    #messages {
        background-color: #16213e;
        padding: 1rem;
        border-radius: 5px;
        flex-grow: 1;
        overflow-y: auto;
        margin-bottom: 1rem;
    }

    #messages div {
        background-color: #0f3460;
        padding: 0.5rem;
        border-radius: 5px;
        margin-bottom: 0.5rem;
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

    input[type="text"] {
        display: block;
        width: calc(100% - 20px);
        margin: 0 auto;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background: #0f3460;
        color: #e0e0e0;
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
        transition: background 0.3s;
    }

    button:hover {
        background: #00a3a5;
    }

    #typing {
        color: #00adb5;
        font-style: italic;
        margin-top: 1rem;
    }
</style>

<div class="chat-container">
    <div id="messages">
        {#each messages as msg}
            <div>{msg.sender}: {msg.content}
                <span>{formatDate(msg.createdAt)}</span>
            </div>
        {/each}
    </div>
    <div class="input-container">
        <input type="text" bind:value={message} placeholder="Write your message..." on:input={handleTyping} />
        <button on:click={sendMessage}>Send</button>
        <button on:click={deleteMessages}>Delete Messages</button>
        <input type="text" bind:value={room} placeholder="Write room name..." />
        <input type="text" bind:value={password} placeholder="Password (optional)" />
        <button on:click={changeRoom}>Connect</button>
        <button on:click={createRoom}>Create Room</button>
        <div id="typing">{typingMessage}</div>
    </div>
</div>