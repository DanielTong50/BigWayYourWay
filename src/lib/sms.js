/**
 * Client-side function to send SMS reminders via server endpoint
 */
export async function sendWaitlistReminder(phoneNumber, suggestedTime, requestedTime) {
    try {
        const response = await fetch('/api/sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, suggestedTime, requestedTime })
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error);
        }

        return result;
    } catch (error) {
        console.error('Failed to send SMS:', error);
        throw error;
    }
} 