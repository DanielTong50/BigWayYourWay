/**
 * Client-side function to send SMS reminders via server endpoint
 */
export async function sendWaitlistReminder(phoneNumber, suggestedTime) {
    try {
        const response = await fetch('/api/sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, suggestedTime })
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