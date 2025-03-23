import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '$env/static/private';
import { json } from '@sveltejs/kit';
import twilio from 'twilio';
import { supabase } from '$lib/supabase';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function POST({ request }) {
    try {
        const { phoneNumber, suggestedTime } = await request.json();
        
        // Send the SMS
        const message = await client.messages.create({
            body: `🍜 Big Way @UBC - Your table is ready! Join the waitlist now for your suggested time: ${suggestedTime}. Don't miss out on the best noodles in town!`,
            from: TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        // Update the database to mark SMS as sent
        const { error: dbError } = await supabase
            .from('waitlist')
            .update({
                sms_sent: true,
                sms_sent_at: new Date().toISOString(),
            })
            .eq('phone', phoneNumber)
            .eq('sms_sent', false)
            .order('created_at', { ascending: false })
            .limit(1);

        if (dbError) {
            console.error('Error updating SMS status:', dbError);
        }

        return json({ success: true, messageId: message.sid });
    } catch (error) {
        console.error('SMS Error:', error);
        
        // Try to update the database with the error
        try {
            await supabase
                .from('waitlist')
                .update({
                    sms_sent: false,
                    sms_error: error.message
                })
                .eq('phone', phoneNumber)
                .eq('sms_sent', false)
                .order('created_at', { ascending: false })
                .limit(1);
        } catch (dbError) {
            console.error('Error updating SMS error status:', dbError);
        }

        return json({ success: false, error: error.message }, { status: 500 });
    }
} 