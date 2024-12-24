<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import createSocket from '$lib/socket';

    let rooms: { name: string, protected: boolean }[] = [];
    let newRoomName = '';
    let room = '';
    let username = '';
    let password = '';
    let socket : any;

    onMount(() => {
		username = localStorage.getItem('username') || 'Guest';
        socket = createSocket(username);

        socket.on('rooms', (availableRooms: { name: string, protected: boolean }[]) => {
            rooms = availableRooms;
        });

        socket.emit('getRooms');
    });

    function createRoom() {
        if (newRoomName.trim() !== '') {
            socket.emit('createRoom', { name: newRoomName, password });
            newRoomName = '';
            password = '';
        } else {
            alert('Please enter a room name.');
        }
    }

    function joinRoom(room: string, password: string) {
        socket.emit('joinRoom', { room, username, password });
		console.log('joinRoom', { room, username, password });
        socket.on('notification', (notification: string) => {
            if (notification === 'Incorrect room password') {
                alert(notification);
            } else {
                goto(`/rooms/${room}`);
            }
        });
    }
</script>

<h1>Rooms</h1>

<h2>Choose a room</h2>
<ul>
    {#each rooms as room}
        <li>
            {#if room.protected}
                <span>🔒</span>
                <a href="rooms/{room.name}">{room.name}</a>
            {/if}
            {#if !room.protected}
                <span>🌍</span>
                <a href="rooms/{room.name}">{room.name}</a>
            {/if}
        </li>
    {/each}
</ul>

<style>
    :global(body) {
        background-color: #1a1a2e;
        color: #e0e0e0;
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
    }

    h1, h2 {
        text-align: center;
        color: #00adb5;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        background: #16213e;
        margin: 10px 0;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    li a {
        color: #00adb5;
        text-decoration: none;
        font-weight: bold;
    }

    li span {
        margin-right: 10px;
    }

    input {
        display: block;
        width: calc(100% - 20px);
        margin: 10px auto;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background: #0f3460;
        color: #e0e0e0;
    }

    button {
        display: block;
        width: calc(100% - 20px);
        margin: 10px auto;
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
</style>

<h2>Create a new room</h2>
<input bind:value={newRoomName} placeholder="Room name" />
<input type="password" placeholder="Password (optional)" bind:value={password} />
<button on:click={createRoom}>Create Room</button>
<button on:click={() => joinRoom(newRoomName, password)}>Join</button>