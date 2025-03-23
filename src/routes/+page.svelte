<script>
  import { onMount } from 'svelte';
  import { generateResponse } from '$lib/openai';
  import { addToWaitlist, getWaitlistCount, supabase } from '$lib/supabase';

  let partySize = "4";
  let timePeriod = "5";
  let currentParties = 0;
  let name = "";
  let phone = "";
  let submitting = false;
  let error = null;
  let success = null;
  let queuePosition = null;
  let aiLoading = false;
  let aiResponse = null;
  let targetTime = "";
  let selectedHour = "";
  let selectedMinute = "";
  let hourOptions = [];
  let minuteOptions = [];

  // Function to validate phone number - more lenient validation
  function validatePhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length >= 10; // Allow numbers longer than 10 digits
  }

  // Function to format phone number
  function formatPhoneNumber(value) {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format the number as (XXX) XXX-XXXX if it's at least 10 digits
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}${cleaned.slice(10) ? '-' + cleaned.slice(10) : ''}`;
    }
    // If less than 10 digits, just return what they've typed
    return cleaned;
  }

  // Function to validate time is within operating hours (10 AM - 2 AM)
  function validateOperatingHours(timeStr) {
    if (!timeStr) return true; // Empty time is valid
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Convert to 24-hour format for easier comparison
    // 2 AM is represented as hour 2, 10 AM as hour 10
    if (hours >= 10 && hours <= 23) return true; // 10 AM to 11:59 PM
    if (hours >= 0 && hours <= 2) return true;   // 12 AM to 2 AM
    return false;
  }

  // Handle phone input changes
  function handlePhoneInput(event) {
    const input = event.target;
    const formatted = formatPhoneNumber(input.value);
    phone = formatted;
  }

  // Handle time input changes
  function handleTimeInput(event) {
    const input = event.target;
    if (!validateOperatingHours(input.value)) {
      error = 'Please select a time between 10 AM and 2 AM';
      targetTime = "";
    } else {
      error = null;
    }
  }

  // Generate hour and minute options
  function generateTimeOptions() {
    const hours = [];
    const minutes = [];
    
    // Helper function to format hour label
    function formatHourLabel(hour) {
      const date = new Date(2000, 0, 1, hour, 0);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        hour12: true 
      });
    }

    // Add 10 AM to 11:59 PM
    for (let hour = 10; hour <= 23; hour++) {
      hours.push({
        value: hour.toString().padStart(2, '0'),
        label: formatHourLabel(hour)
      });
    }
    
    // Add 12 AM to 2 AM
    for (let hour = 0; hour <= 2; hour++) {
      hours.push({
        value: hour.toString().padStart(2, '0'),
        label: formatHourLabel(hour)
      });
    }

    // Generate minutes in 5-minute intervals
    for (let minute = 0; minute < 60; minute += 5) {
      minutes.push({
        value: minute.toString().padStart(2, '0'),
        label: minute.toString().padStart(2, '0')
      });
    }
    
    return { hours, minutes };
  }

  // Update target time when hour or minute changes
  async function updateTargetTime() {
    if (selectedHour && selectedMinute) {
      targetTime = `${selectedHour}:${selectedMinute}`;
      // Automatically trigger AI suggestion when time is selected
      await handleAiRequest();
    } else {
      targetTime = "";
      aiResponse = null;
    }
  }

  async function testConnection() {
    try {
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact' });
      
      if (error) {
        console.error('Database connection error:', error);
        return;
      }
      
      console.log('Successfully connected to database. Current waitlist count:', count);
    } catch (err) {
      console.error('Connection test failed:', err);
    }
  }

  onMount(async () => {
    await testConnection();
    const { hours, minutes } = generateTimeOptions();
    hourOptions = hours;
    minuteOptions = minutes;
    await updateQueueCount();
    // Update queue count every 30 seconds
    setInterval(updateQueueCount, 30000);
  });

  async function updateQueueCount() {
    try {
      const { count } = await getWaitlistCount();
      currentParties = count;
    } catch (err) {
      console.error('Error fetching queue count:', err);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    error = null;
    success = null;

    // Validate all required fields
    if (!name.trim()) {
      error = 'Please enter your name';
      return;
    }

    if (!selectedHour || !selectedMinute) {
      error = 'Please select your preferred seating time';
      return;
    }

    // Validate operating hours
    if (!validateOperatingHours(`${selectedHour}:${selectedMinute}`)) {
      error = 'Please select a time between 10 AM and 2 AM';
      return;
    }

    submitting = true;

    try {
      const result = await addToWaitlist({
        name: name.trim(),
        phone: phone.replace(/\D/g, '') || null,
        partySize: parseInt(partySize),
        targetTime: `${selectedHour}:${selectedMinute}`,
        currentParties
      });

      success = true;
      queuePosition = result.position;
      
      // If we got a suggested time, show it
      if (result.suggestedTime) {
        aiResponse = result.suggestedTime;
      }
      
      // Reset form
      name = "";
      phone = "";
      partySize = "4";
      selectedHour = "";
      selectedMinute = "";
      targetTime = "";
      
      await updateQueueCount();
    } catch (err) {
      error = err.message || 'Failed to join the waitlist';
      console.error('Error submitting form:', err);
    }

    submitting = false;
  }

  async function handleAiRequest() {
    if (!selectedHour || !selectedMinute) return; // Don't proceed if time is not fully selected
    
    aiLoading = true;
    aiResponse = null;
    error = null;

    try {
      const seatingTime = `${selectedHour}:${selectedMinute}`;
      const response = await generateResponse(partySize, seatingTime, currentParties);
      aiResponse = response;
    } catch (err) {
      error = 'Failed to get AI recommendation';
      console.error('Error getting AI response:', err);
    } finally {
      aiLoading = false;
    }
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
    <div class="success-message animated">
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
        minlength="2"
        maxlength="50"
      />
    </div>
    
    <div class="form-group">
      <label for="phone">Mobile Number*</label>
      <input 
        type="tel" 
        id="phone" 
        value={phone}
        on:input={handlePhoneInput}
        disabled={submitting}
        placeholder="(123) 456-7890"
        required
      />
      <small class="help-text">Enter at least 10 digits</small>
    </div>
    
    <div class="form-group">
      <label for="party-size">Party Size*</label>
      <select 
        id="party-size" 
        bind:value={partySize}
        disabled={submitting}
        required
      >
        <option value="">Select party size</option>
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

    <div class="form-group">
      <label for="target-time">Target Seating Time*</label>
      <div class="time-select-container">
        <div class="time-select-wrapper">
          <select 
            id="target-hour"
            bind:value={selectedHour}
            on:change={updateTargetTime}
            disabled={submitting}
            class="time-select"
            required
          >
            <option value="">Hour</option>
            {#each hourOptions as hour}
              <option value={hour.value}>{hour.label}</option>
            {/each}
          </select>
        </div>
        <div class="time-select-wrapper">
          <select 
            id="target-minute"
            bind:value={selectedMinute}
            on:change={updateTargetTime}
            disabled={submitting || !selectedHour}
            class="time-select"
            required
          >
            <option value="">Minute</option>
            {#each minuteOptions as minute}
              <option value={minute.value}>{minute.label}</option>
            {/each}
          </select>
        </div>
      </div>
      <small class="help-text">Select your preferred seating time</small>
    </div>

    <button type="submit" disabled={submitting}>
      {submitting ? 'JOINING...' : 'JOIN THE LINE NOW'}
    </button>

    <p class="terms">
        This is a beta testing model step 1 out of 5
    </p>
  </form>

  {#if aiResponse}
    <div class="ai-response">
      <h3>Recommended Time</h3>
      <p>Join the waitlist at {aiResponse}</p>
    </div>
  {/if}
</main>

<style>
  main {
    padding: 2rem 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .queue-status {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
    margin: 1.5rem 0;
  }

  .waitlist-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-group label {
    color: #666;
    font-size: 0.9rem;
  }

  .help-text {
    color: #666;
    font-size: 0.8rem;
    margin-top: 0.15rem;
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
    background-color: #ff4444;
    border: 1px solid #ff0000;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
    color: white;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.02);
      opacity: 0.9;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
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

  .ai-response {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    padding: 1.25rem;
    border-radius: 8px;
    margin-top: 1rem;
    text-align: center;
    line-height: 1.4;
  }

  .ai-response h3 {
    margin: 0 0 0.35rem 0;
    color: #4B7AB9;
    font-size: 1.25rem;
  }

  .ai-response p {
    font-size: 1.5rem;
    margin: 0;
    color: #333;
  }

  .time-select-container {
    display: flex;
    gap: 0.5rem;
  }

  .time-select-wrapper {
    flex: 1;
  }

  .time-select {
    appearance: none;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
    font-size: 1rem;
    width: 100%;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.2em;
    padding-right: 2.5rem;
  }

  .time-select:focus {
    outline: none;
    border-color: #4B7AB9;
    box-shadow: 0 0 0 2px rgba(75, 122, 185, 0.2);
  }

  .time-select:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .time-select option {
    padding: 0.5rem;
    color: #333;
    background-color: white;
  }

  .time-select option:hover {
    background-color: #f0f0f0;
  }
</style> 