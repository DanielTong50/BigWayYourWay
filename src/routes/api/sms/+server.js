import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from '$env/static/private';
import { json } from '@sveltejs/kit';
import twilio from 'twilio';
import { supabase } from '$lib/supabase';

// Validate environment variables
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Missing Twilio environment variables');
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function POST({ request }) {
    let phoneNumber;
    try {
        const { phoneNumber: receivedPhone, suggestedTime, registeredTime } = await request.json();
        phoneNumber = receivedPhone;
        
        if (!phoneNumber) {
            throw new Error('Phone number is required');
        }

        // Format phone number to E.164 format
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber.replace(/\D/g, '')}`;
        
        console.log('SMS Request:', {
            to: formattedPhone,
            from: TWILIO_PHONE_NUMBER,
            suggestedTime,
            registeredTime
        });
        
        const message = await client.messages.create({
            body: `Join the waitlist ${suggestedTime} for your time: ${registeredTime}. https://gosnappy.io/lineup/?force=true&storeId=2980`,
            from: TWILIO_PHONE_NUMBER,
            to: formattedPhone
        });

        console.log('SMS sent successfully:', message.sid);

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
        console.error('SMS Error details:', {
            message: error.message,
            code: error.code,
            status: error.status,
            moreInfo: error.moreInfo,
            stack: error.stack
        });
        
        // Try to update the database with the error
        try {
            if (phoneNumber) {  // Only update if we have a phone number
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
            }
        } catch (dbError) {
            console.error('Error updating SMS error status:', dbError);
        }

        return json({ 
            success: false, 
            error: error.message,
            details: {
                code: error.code,
                status: error.status,
                moreInfo: error.moreInfo
            }
        }, { status: 500 });
    }
} 