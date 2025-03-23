<script>
    import { sendWaitlistReminder } from '$lib/sms.js';

    let phoneNumber = '';
    let status = '';
    let isLoading = false;

    async function handleTestSMS() {
        isLoading = true;
        status = 'Sending SMS...';
        
        try {
            const currentTime = new Date().toLocaleTimeString();
            await sendWaitlistReminder(phoneNumber, currentTime);
            status = '✅ SMS sent successfully!';
        } catch (error) {
            status = `❌ Error: ${error.message}`;
            console.error('SMS test failed:', error);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="container">
    <h1>Test SMS Feature</h1>
    
    <div class="form">
        <label>
            Phone Number (with country code):
            <input 
                type="tel" 
                bind:value={phoneNumber} 
                placeholder="+1234567890"
                pattern="^\+[1-9]\d{1,14}$"
            />
        </label>
        
        <button 
            on:click={handleTestSMS} 
            disabled={isLoading || !phoneNumber.match(/^\+[1-9]\d{1,14}$/)}
        >
            {isLoading ? 'Sending...' : 'Send Test SMS'}
        </button>
        
        {#if status}
            <p class="status" class:error={status.includes('❌')}>
                {status}
            </p>
        {/if}
    </div>
</div>

<style>
    .container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 8px;
    }

    h1 {
        color: var(--primary-red, #ff2233);
        margin-bottom: 2rem;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.9);
    }

    input {
        padding: 0.75rem;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: white;
        font-size: 1rem;
    }

    input:focus {
        outline: none;
        border-color: var(--primary-red, #ff2233);
        background: rgba(255, 34, 51, 0.05);
    }

    button {
        padding: 0.75rem 1.5rem;
        background: var(--primary-red, #ff2233);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    button:not(:disabled):hover {
        opacity: 0.9;
    }

    .status {
        padding: 1rem;
        border-radius: 4px;
        background: rgba(0, 255, 0, 0.1);
        color: #00ff00;
    }

    .status.error {
        background: rgba(255, 0, 0, 0.1);
        color: #ff0000;
    }
</style> 