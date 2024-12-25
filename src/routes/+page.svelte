<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let username: string;

	if (browser) {
		username = localStorage.getItem('username') || '';
	}

	function start() {
		if (browser) {
			if (username !== '' && username.trim() !== '') {
				if (username != 'Guest') {
					localStorage.setItem('username', username);
				}
			} else {
				username = 'Guest';
				localStorage.removeItem('username');
			}
		}
		goto('/rooms');
	}
</script>

<div class="container">
	<h1>Live Chat</h1>
	<h2>Enter your username</h2>
	<input bind:value={username} placeholder="Username" />
	<button on:click={start}>Submit</button>
</div>

<style>
    :global(body) {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
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
        background: rgba(22, 33, 62, 0.9);
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border: 1px solid #00adb5;
    }

    h1 {
        color: #00adb5;
        margin-bottom: 1rem;
    }

    h2 {
        color: #00adb5;
        margin-bottom: 1rem;
    }

    input {
        display: block;
        margin: 1rem auto;
        padding: 0.5rem;
        border: none;
        border-radius: 5px;
        width: 80%;
        max-width: 300px;
        background: #0f3460;
        color: #e0e0e0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s, background 0.3s;
    }

    input:focus {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        outline: none;
        background: #1a1a2e;
    }

    button {
        display: block;
        margin: 1rem auto;
        padding: 0.5rem 1.5rem;
        background-color: #00adb5;
        color: #1a1a2e;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition:
            background 0.3s,
            transform 0.3s,
            box-shadow 0.3s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: white;
    }

    button:hover {
        background-color: #00a3a5;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>
