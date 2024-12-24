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

<style>
    :global(body) {
        background-color: #1a1a2e;
        color: #e0e0e0;
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
    }

    h1 {
        color: #00adb5;
        text-align: center;
        margin-top: 2rem;
    }

    h2 {
        color: #00adb5;
        text-align: center;
        margin-top: 1rem;
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
    }

    button {
        display: block;
        margin: 1rem auto;
        padding: 0.5rem 1rem;
        background-color: #00adb5;
        color: #1a1a2e;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;
    }

    button:hover {
        background-color: #00a3a5;
    }
</style>

<h1>Live Chat</h1>

<h2>Enter your username</h2>
<input bind:value={username} placeholder="Username" />
<button on:click={start}>Submit</button>