<script>
  import { onMount } from 'svelte';

  let partySize = "4";
  let currentParties = 0;
  let name = "";
  let phone = "";
  let submitting = false;
  let error = null;
  let success = null;
  let queuePosition = null;

  // Function to format phone number
  function formatPhoneNumber(value) {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format the number as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
    }
    return cleaned;
  }

  // Function to validate phone number
  function validatePhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length === 10;
  }

  // Handle phone input changes
  function handlePhoneInput(event) {
    const input = event.target;
    const formatted = formatPhoneNumber(input.value);
    phone = formatted;
  }

  onMount(async () => {
    await updateQueueCount();
    // Update queue count every 30 seconds
    setInterval(updateQueueCount, 30000);
  });

  async function updateQueueCount() {
    try {
      const response = await fetch('/api/waitlist');
      const data = await response.json();
      if (data.count !== undefined) {
        currentParties = data.count;
      }
    } catch (err) {
      console.error('Error fetching queue count:', err);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    error = null;
    success = null;

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      error = 'Please enter a valid 10-digit phone number';
      return;
    }

    submitting = true;

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone: phone.replace(/\D/g, ''), // Send only digits to server
          partySize
        })
      });

      const data = await response.json();

      if (response.ok) {
        success = true;
        queuePosition = data.position;
        name = "";
        phone = "";
        partySize = "4";
        await updateQueueCount();
      } else {
        error = data.error || 'Failed to join the waitlist';
      }
    } catch (err) {
      error = 'Failed to connect to the server';
      console.error('Error submitting form:', err);
    }

    submitting = false;
  }
</script>

<main>
  <div class="header">
    <h1>Big Way Your Way<br />(UBC)</h1>
  </div>

  <div class="queue-status">
    <p>There are currently {currentParties} parties in line</p>
  </div>

  {#if success}
    <div class="success-message">
      <p>Successfully joined the waitlist!</p>
      <p>Your position in line: {queuePosition}</p>
    </div>
  {/if}

  {#if error}
    <div class="error-message">
      <p>{error}</p>
    </div>
  {/if}

  <form class="waitlist-form" on:submit={handleSubmit}>
    <div class="form-group">
      <label for="name">Name*</label>
      <input 
        type="text" 
        id="name" 
        bind:value={name}
        required 
        disabled={submitting}
        placeholder="Enter your name"
      />
    </div>
    
    <div class="form-group">
      <label for="phone">Mobile Number*</label>
      <input 
        type="tel" 
        id="phone" 
        value={phone}
        on:input={handlePhoneInput}
        required 
        disabled={submitting}
        placeholder="(123) 456-7890"
      />
      <small class="help-text">Enter a 10-digit phone number</small>
    </div>
    
    <div class="form-group">
      <label for="party-size">Party Size*</label>
      <select 
        id="party-size" 
        bind:value={partySize}
        disabled={submitting}
      >
        <option value="1">Party of 1</option>
        <option value="2">Party of 2</option>
        <option value="3">Party of 3</option>
        <option value="4">Party of 4</option>
        <option value="5">Party of 5</option>
        <option value="6">Party of 6</option>
        <option value="7">Party of 7</option>
        <option value="8">Party of 8</option>
      </select>
    </div>

    <button type="submit" disabled={submitting}>
      {submitting ? 'JOINING...' : 'JOIN THE LINE NOW'}
    </button>

    <p class="terms">
        This is a beta testing model step 1 out of 5
    </p>
  </form>
</main>

<style>
  main {
    padding: 2rem 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .queue-status {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
    margin: 2rem 0;
  }

  .waitlist-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  .help-text {
    color: #666;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  input::placeholder {
    color: #999;
  }

  .terms {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: #666;
    text-align: center;
  }

  .success-message {
    background-color: #e6ffe6;
    border: 1px solid #b3ffb3;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .error-message {
    background-color: #ffe6e6;
    border: 1px solid #ffb3b3;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
    color: #cc0000;
  }

  button[disabled] {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    main {
      padding: 1rem;
    }

    h1 {
      font-size: 1.75rem;
    }
  }
</style> 