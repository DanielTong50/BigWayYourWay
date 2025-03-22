<script>
  import '../app.css';
</script>

<div class="app-container">
  <slot />
</div>

<style>
  .app-container {
    width: 100%;
    min-height: 100vh;
    background-color: var(--background-color);
    display: flex;
    flex-direction: column;
  }

  /* Responsive margins */
  @media (max-width: 768px) {
    .app-container {
      padding: 0 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .app-container {
      padding: 0 0.5rem;
    }
  }

  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style> 