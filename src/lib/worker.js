import { submitSnappyForm } from './snappy';
import supabase from './supabase';

export async function scheduleSnappySubmission(waitlistId, delayMinutes) {
  // Schedule the submission after the specified delay
  setTimeout(async () => {
    try {
      // Get the waitlist entry
      const { data: entry, error: fetchError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('id', waitlistId)
        .single();

      if (fetchError) throw fetchError;

      // Submit to Snappy
      const snappyUrl = await submitSnappyForm(
        entry.name,
        entry.phone,
        entry.party_size
      );

      // Update the waitlist entry with the Snappy URL
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({
          snappy_url: snappyUrl,
          snappy_status: 'submitted'
        })
        .eq('id', waitlistId);

      if (updateError) throw updateError;

      console.log(`Successfully submitted to Snappy for waitlist ID ${waitlistId}`);
    } catch (error) {
      console.error(`Error in scheduled submission for waitlist ID ${waitlistId}:`, error);
      
      // Update the entry to show the error
      await supabase
        .from('waitlist')
        .update({
          snappy_status: 'error',
          snappy_url: null
        })
        .eq('id', waitlistId);
    }
  }, delayMinutes * 60 * 1000); // Convert minutes to milliseconds
} 