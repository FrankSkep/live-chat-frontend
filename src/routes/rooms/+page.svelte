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

        loadRooms();
    });

    function createRoom() {
        if (newRoomName.trim() !== '') {
            socket.emit('createRoom', { name: newRoomName, password });

            // listen for the new room to be created
            socket.on('roomCreated', (newRoom: { name: string, protected: boolean }) => {
                rooms = [...rooms, newRoom];
            });

            newRoomName = '';
            password = '';
        } else {
            alert('Please enter a room name.');
        }
    }

    function loadRooms() {
        socket.on('rooms', (availableRooms: { name: string, protected: boolean }[]) => {
            rooms = availableRooms;
        });

        socket.emit('getRooms');
    }
</script>

<div class="container">
    <h1>Rooms</h1>

    <h2>Choose a room</h2>
    <ul>
        {#each rooms as room}
            <li>
                {#if room.protected}
                    <a href="rooms/{room.name}">{room.name}</a>
                    <span>🔒</span>
                {/if}
                {#if !room.protected}
                    <a href="rooms/{room.name}">{room.name}</a>
                    <span>🌍</span>
                {/if}
            </li>
        {/each}
    </ul>

    <h2>Create a new room</h2>
    <input bind:value={newRoomName} placeholder="Room name" />
    <input type="password" placeholder="Password (optional)" bind:value={password} />
    <button on:click={createRoom}>Create Room</button>
</div>

<style>
    :global(body) {
        background-color: #1a1a2e;
        color: #e0e0e0;
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .container {
        text-align: center;
        background: #16213e;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 600px;
    }

    h1, h2 {
        color: #00adb5;
        margin-bottom: 1rem;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
        max-height: 300px;
        overflow-y: auto;
    }

    li {
        background: #0f3460;
        margin: 10px 0;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: background 0.3s;
    }

    li:hover {
        background: #1a1a2e;
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s;
    }

    input:focus {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        outline: none;
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
        transition: background 0.3s, transform 0.3s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    button:hover {
        background: #00a3a5;
        transform: translateY(-2px);
    }

    button:active {
        transform: translateY(0);
    }
</style>