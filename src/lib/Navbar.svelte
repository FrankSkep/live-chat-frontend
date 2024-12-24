<script>
    export let links = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
    ];
</script>

<nav class="navbar">
    <ul>
        {#each links as link}
            <li><a href={link.href}>{link.name}</a></li>
        {/each}
    </ul>
</nav>

<style>
    .navbar {
        background-color: #333;
        padding: 1rem;
    }
    .navbar ul {
        list-style: none;
        display: flex;
        gap: 1rem;
    }
    .navbar a {
        color: white;
        text-decoration: none;
    }
    .navbar a:hover {
        text-decoration: underline;
    }
</style>