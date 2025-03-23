import { supabase } from './supabase';
import { sendWaitlistReminder } from './sms';

// Function to check and send SMS reminders
export async function checkAndSendSMSReminders() {
    try {
        // Get all entries that need SMS reminders
        const { data: entries, error } = await supabase
            .from('waitlist')
            .select('*')
            .eq('sms_sent', false)
            .lte('suggested_time', new Date().toISOString());

        if (error) throw error;

        // Send SMS for each entry
        for (const entry of entries) {
            const result = await sendWaitlistReminder(
                entry.phone, 
                entry.suggested_time,
                entry.requested_time
            );
            
            if (result.success) {
                // Update the entry to mark SMS as sent
                await supabase
                    .from('waitlist')
                    .update({ sms_sent: true })
                    .eq('id', entry.id);
            }
        }
    } catch (error) {
        console.error('Error in SMS reminder job:', error);
    }
}

// Start the background job
export function startSMSReminderJob() {
    // Check every minute
    setInterval(checkAndSendSMSReminders, 60000);
    
    // Initial check
    checkAndSendSMSReminders();
} 