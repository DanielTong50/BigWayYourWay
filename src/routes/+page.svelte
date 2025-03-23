<script>
  import { onMount } from 'svelte';
  import { generateResponse } from '$lib/openai';
  import { addToWaitlist, getWaitlistCount, supabase } from '$lib/supabase';
  import { startSMSReminderJob } from '$lib/backgroundJobs';

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
    
    // Start SMS reminder job
    startSMSReminderJob();
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
      // Format phone number to E.164 format for Twilio
      const formattedPhone = phone.replace(/\D/g, '');
      const e164Phone = formattedPhone.startsWith('1') ? `+${formattedPhone}` : `+1${formattedPhone}`;
      
      const result = await addToWaitlist({
        name: name.trim(),
        phone: e164Phone,
        partySize: parseInt(partySize),
        targetTime: `${selectedHour}:${selectedMinute}`,
        currentParties
      });

      // Send immediate SMS notification
      try {
        await fetch('/api/sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: e164Phone,
            suggestedTime: result.suggestedTime,
            requestedTime: `${selectedHour}:${selectedMinute}`
          })
        });
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
        // Continue with the form submission even if SMS fails
      }

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
    <h1>Big Way<span class="separator">:</span>Your Way <span class="location">@UBC</span></h1>
  </div>

  <div class="queue-status">
    <p>Currently <span class="highlight">{currentParties}</span> {currentParties === 1 ? 'party' : 'parties'} in line</p>
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
    <div class="form-grid">
      <div class="form-group">
        <label for="name">Name</label>
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
        <label for="phone">Mobile Number</label>
        <input 
          type="tel" 
          id="phone" 
          value={phone}
          on:input={handlePhoneInput}
          disabled={submitting}
          placeholder="(123) 456-7890"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="party-size">Party Size</label>
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

      <div class="form-group time-group">
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
        
        <div class="ai-time-display">
          {#if aiLoading}
            <p>Calculating recommended time...</p>
          {:else if aiResponse}
            <p>Recommended join time: <span class="recommended-time">{aiResponse}</span></p>
          {/if}
        </div>
      </div>
    </div>

    <button type="submit" disabled={submitting} class="submit-button">
      <span class="button-text">
        {submitting ? 'JOINING...' : 'JOIN THE LINE NOW'}
      </span>
    </button>

    <p class="terms">
      @BigBacks 2025
      <br> 
      All Rights Reserved
    </p>
  </form>
</main>

<style>
  :root {
    --primary-red: #ff2233;
    --primary-red-light: #ff4444;
    --primary-red-dark: #cc1122;
    --accent-orange: #ff6b2b;
    --accent-red-dark: #990000;
    --bg-dark: #0a0a0a;
    --bg-darker: #050505;
    --surface-dark: #151515;
    --surface-darker: #111111;
    --border-color: #333333;
  }

  main {
    padding: 3rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    background: linear-gradient(135deg, var(--bg-darker), var(--bg-dark));
    min-height: 100vh;
    color: #fff;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeIn 0.5s ease-out;
    position: relative;
  }

  .header::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary-red), transparent);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  h1 {
    font-size: 2.8rem;
    margin-bottom: 1rem;
    line-height: 1.2;
    position: relative;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 800;
    animation: titleGradient 8s ease infinite;
    background-size: 300% 300%;
    background-image: linear-gradient(
      -45deg,
      var(--accent-orange) 0%,
      var(--primary-red) 25%,
      var(--primary-red-dark) 51%,
      var(--accent-red-dark) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(255, 34, 51, 0.1);
  }

  @keyframes titleGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .separator {
    -webkit-text-fill-color: var(--primary-red);
    margin: 0 0.5rem;
  }

  .location {
    color: #fff;
    font-size: 0.5em;
    background: none;
    -webkit-text-fill-color: #fff;
    opacity: 0.9;
  }

  .queue-status {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 300;
    margin: 2rem 0;
    color: #fff;
    letter-spacing: 1px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .highlight {
    color: var(--primary-red);
    font-weight: 700;
    font-size: 2rem;
    text-shadow: 0 0 20px rgba(255, 34, 51, 0.3);
  }

  .waitlist-form {
    background: linear-gradient(145deg, var(--surface-dark), var(--surface-darker));
    padding: 3rem;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    animation: slideUp 0.5s ease-out;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 34, 51, 0.1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 2.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .time-group {
    grid-column: 1 / -1;
    background: linear-gradient(145deg, 
      rgba(0, 0, 0, 0.4),
      rgba(17, 17, 17, 0.4)
    );
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 34, 51, 0.2);
    position: relative;
    overflow: hidden;
  }

  .time-group::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent,
      var(--primary-red-light),
      transparent
    );
  }

  .time-group::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent,
      var(--primary-red),
      transparent
    );
  }

  .time-select-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .time-select-wrapper {
    position: relative;
  }

  .time-select-wrapper::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent,
      var(--primary-red-light),
      transparent
    );
    opacity: 0.3;
  }

  .time-select-wrapper:hover::after {
    opacity: 0.3;
  }

  .time-select {
    width: 100%;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .time-select:focus {
    outline: none;
    border-color: var(--primary-red);
    box-shadow: none;
    background-color: rgba(255, 34, 51, 0.05);
  }

  .form-group label {
    color: #fff;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  input, select {
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 1rem;
    box-shadow: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  input:focus, select:focus {
    outline: none;
    border-color: var(--primary-red);
    box-shadow: none;
    background-color: rgba(255, 34, 51, 0.05) !important;
  }

  input:not(:placeholder-shown) {
    background-color: transparent !important;
    color: #fff !important;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
  }

  select option {
    background-color: var(--surface-darker);
    color: #fff;
  }

  .help-text {
    color: #888;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
  }

  .submit-button {
    width: 100%;
    padding: 1.25rem;
    background: linear-gradient(135deg, var(--primary-red) 0%, var(--primary-red-light) 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    box-shadow: 0 4px 12px rgba(255, 34, 51, 0.3);
  }

  .submit-button:not([disabled]) {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(255, 34, 51, 0.3);
  }

  .submit-button:active:not([disabled]) {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(255, 34, 51, 0.2);
  }

  .success-message {
    background: linear-gradient(135deg, var(--primary-red) 0%, var(--primary-red-light) 100%);
    border: none;
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    text-align: center;
    color: white;
    animation: pulse 2s infinite;
    box-shadow: 0 5px 15px rgba(255, 34, 51, 0.3);
  }

  .success-message p:first-child {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; box-shadow: 0 5px 15px rgba(255, 34, 51, 0.3); }
    50% { transform: scale(1.02); opacity: 0.9; box-shadow: 0 5px 25px rgba(255, 34, 51, 0.5); }
    100% { transform: scale(1); opacity: 1; box-shadow: 0 5px 15px rgba(255, 34, 51, 0.3); }
  }

  .error-message {
    background: linear-gradient(135deg, rgba(255, 34, 51, 0.1) 0%, rgba(255, 34, 51, 0.15) 100%);
    border: 1px solid var(--primary-red);
    padding: 1.25rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--primary-red-light);
    box-shadow: 0 5px 15px rgba(255, 34, 51, 0.1);
  }

  .ai-time-display {
    margin-top: 1.5rem;
    padding: 1.5rem;
    min-height: 4.5rem;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 34, 51, 0.2);
    border-radius: 8px;
    font-size: 1.1rem;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }

  .ai-time-display::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent,
      var(--primary-red-light),
      transparent
    );
  }

  .recommended-time {
    color: var(--primary-red-light);
    font-weight: 600;
    font-size: 1.3rem;
    margin-left: 0.5rem;
    text-shadow: 0 0 10px rgba(255, 34, 51, 0.3);
  }

  .terms {
    margin-top: 2.5rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    main {
      padding: 1.5rem 1rem;
      min-height: calc(100vh - 2rem);
    }

    .header {
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 1.8rem;
      letter-spacing: 2px;
    }

    .queue-status {
      margin: 1.5rem 0;
      font-size: 1.2rem;
    }

    .highlight {
      font-size: 1.6rem;
    }

    .waitlist-form {
      padding: 1.5rem;
      margin-top: 1rem;
    }

    .form-grid {
      grid-template-columns: 1fr;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .time-group {
      padding: 1.5rem;
    }

    .time-select-container {
      gap: 0.75rem;
    }

    input, select, .time-select {
      padding: 0.875rem;
      font-size: 0.95rem;
    }

    .form-group label {
      font-size: 0.85rem;
      letter-spacing: 1.5px;
    }

    .submit-button {
      padding: 1rem;
      font-size: 1rem;
      letter-spacing: 1.5px;
    }

    .success-message {
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .success-message p:first-child {
      font-size: 1.2rem;
    }

    .error-message {
      padding: 1rem;
      margin-bottom: 1.25rem;
    }

    .ai-time-display {
      padding: 1.25rem;
      margin-top: 1.25rem;
      font-size: 1rem;
    }

    .recommended-time {
      font-size: 1.1rem;
    }

    .terms {
      margin-top: 2rem;
      font-size: 0.8rem;
    }

    input, select, .time-select {
      background-color: transparent !important;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }

    input:not(:placeholder-shown) {
      background-color: transparent !important;
      color: #fff !important;
    }
  }

  @media (max-width: 380px) {
    h1 {
      font-size: 1.6rem;
    }

    .waitlist-form {
      padding: 1.25rem;
    }

    .time-group {
      padding: 1.25rem;
    }
  }
</style> 