import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://ooflqhegcrfeqodkfkym.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZmxxaGVnY3JmZXFvZGtma3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzU0NjgsImV4cCI6MjA1ODI1MTQ2OH0.0j1_G_8ZYJY38RuBojo2VhacZxkmYgntXFIx7h9_Dgo"
);
async function addToWaitlist(name, phone, partySize) {
  try {
    const { data, error } = await supabase.from("waitlist").insert([
      {
        name,
        phone,
        party_size: partySize,
        status: "waiting"
      }
    ]).select().single();
    if (error) throw error;
    console.log("Added to waitlist:", data);
    return data;
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    throw error;
  }
}
async function getWaitlist() {
  try {
    const { data, error } = await supabase.from("waitlist").select("*").order("status", { ascending: true }).order("created_at", { ascending: false });
    if (error) throw error;
    console.log("Retrieved waitlist entries:", data.length);
    return data;
  } catch (error) {
    console.error("Error getting waitlist:", error);
    throw error;
  }
}
async function getQueuePosition(id) {
  try {
    const { data: entry, error: entryError } = await supabase.from("waitlist").select("created_at").eq("id", id).single();
    if (entryError) throw entryError;
    const { count, error: countError } = await supabase.from("waitlist").select("*", { count: "exact", head: true }).eq("status", "waiting").lt("created_at", entry.created_at);
    if (countError) throw countError;
    console.log("Queue position for ID", id, ":", count);
    return { position: count };
  } catch (error) {
    console.error("Error getting queue position:", error);
    throw error;
  }
}
async function getCurrentPartiesCount() {
  try {
    const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true }).eq("status", "waiting");
    if (error) throw error;
    console.log("Current waiting parties:", count);
    return count;
  } catch (error) {
    console.error("Error getting current parties count:", error);
    return 0;
  }
}
async function removeFromWaitlist(id) {
  try {
    const { data, error } = await supabase.from("waitlist").update({ status: "completed" }).eq("id", id).select().single();
    if (error) throw error;
    console.log("Removed from waitlist:", data);
    return data;
  } catch (error) {
    console.error("Error removing from waitlist:", error);
    throw error;
  }
}
async function getDatabaseStatus() {
  try {
    const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true });
    if (error) throw error;
    return {
      status: "connected",
      tables: ["waitlist"],
      counts: { waitlist: count },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("Error getting database status:", error);
    return {
      status: "error",
      error: error.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
export {
  addToWaitlist as a,
  getCurrentPartiesCount as b,
  getWaitlist as c,
  getDatabaseStatus as d,
  getQueuePosition as g,
  removeFromWaitlist as r
};
