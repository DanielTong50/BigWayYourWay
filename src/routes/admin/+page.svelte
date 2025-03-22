<script>
  import { onMount } from 'svelte';
  
  let waitlist = [];
  let loading = true;
  let error = null;
  let lastRefresh = null;
  let debugInfo = null;

  onMount(async () => {
    await fetchWaitlist();
    // Refresh data every 30 seconds
    setInterval(fetchWaitlist, 30000);
  });

  async function fetchWaitlist() {
    try {
      loading = true;
      error = null;
      
      // Get debug info
      const debugResponse = await fetch('/api/waitlist/debug');
      const debugData = await debugResponse.json();
      debugInfo = debugData;

      // Get waitlist
      const response = await fetch('/api/waitlist/all');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.waitlist) {
        waitlist = data.waitlist;
        lastRefresh = new Date();
      }
    } catch (err) {
      console.error('Error fetching waitlist:', err);
      error = err.message || 'Failed to load waitlist data';
    } finally {
      loading = false;
    }
  }

  async function removeFromWaitlist(id) {
    if (!confirm('Are you sure you want to remove this party from the waitlist?')) {
      return;
    }

    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove from waitlist');
      }
      
      await fetchWaitlist();
    } catch (err) {
      console.error('Error removing from waitlist:', err);
      error = err.message || 'Failed to remove from waitlist';
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }
</script>

<main>
  <h1>Waitlist Admin</h1>

  <div class="status-bar">
    <div class="status-item">
      <strong>Total Waiting:</strong> {waitlist.filter(e => e.status === 'waiting').length}
    </div>
    {#if lastRefresh}
      <div class="status-item">
        <strong>Last Updated:</strong> {formatDate(lastRefresh)}
      </div>
    {/if}
    <button class="refresh-button" on:click={fetchWaitlist} disabled={loading}>
      {loading ? 'Refreshing...' : 'Refresh Now'}
    </button>
  </div>

  {#if error}
    <div class="error-message">
      <p>{error}</p>
    </div>
  {/if}

  {#if loading && !waitlist.length}
    <p>Loading waitlist data...</p>
  {:else}
    <div class="waitlist-container">
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Party Size</th>
            <th>Time Added</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each waitlist as entry, i}
            <tr class={entry.status === 'waiting' ? 'waiting' : 'completed'}>
              <td>{entry.status === 'waiting' ? waitlist.filter(e => e.status === 'waiting').indexOf(entry) + 1 : '-'}</td>
              <td>{entry.name}</td>
              <td>{formatPhoneNumber(entry.phone)}</td>
              <td>{entry.party_size}</td>
              <td>{formatDate(entry.created_at)}</td>
              <td>{entry.status}</td>
              <td>
                {#if entry.status === 'waiting'}
                  <button 
                    class="remove-button"
                    on:click={() => removeFromWaitlist(entry.id)}
                  >
                    Remove
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if waitlist.length === 0}
        <p class="no-data">No entries in the waitlist</p>
      {/if}
    </div>

    {#if debugInfo}
      <div class="debug-section">
        <h2>Debug Information</h2>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>
    {/if}
  {/if}
</main>

<style>
  main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .status-bar {
    display: flex;
    gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .status-item {
    font-size: 1.1rem;
  }

  .refresh-button {
    margin-left: auto;
    padding: 0.5rem 1rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .refresh-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .waitlist-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: auto;
    margin-bottom: 2rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f5f5f5;
    font-weight: 600;
  }

  tr.waiting {
    background: white;
  }

  tr.completed {
    background: #f9f9f9;
    color: #666;
  }

  .remove-button {
    background: #ff4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .remove-button:hover {
    background: #ff0000;
  }

  .error-message {
    background-color: #ffe6e6;
    border: 1px solid #ffb3b3;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    color: #cc0000;
  }

  .no-data {
    padding: 2rem;
    text-align: center;
    color: #666;
  }

  .debug-section {
    margin-top: 2rem;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }

  .debug-section pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style> 