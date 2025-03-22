import { j as json } from './index-BIAFQWR9.js';
import { g as getCurrentPartiesCount, a as addToWaitlist, b as getQueuePosition } from './db-DiPfE1r4.js';
import '@supabase/supabase-js';

async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, phone, partySize } = data;
    if (!name || !phone || !partySize) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return json({ error: "Invalid phone number format" }, { status: 400 });
    }
    const result = await addToWaitlist(name, phoneDigits, parseInt(partySize));
    if (!result || !result.id) {
      throw new Error("Failed to add to waitlist");
    }
    const position = await getQueuePosition(result.id);
    if (!position) {
      throw new Error("Failed to get queue position");
    }
    return json({
      success: true,
      id: result.id,
      position: position.position + 1
    });
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return json({
      error: "Failed to add to waitlist. Please try again."
    }, { status: 500 });
  }
}
async function GET() {
  try {
    const count = await getCurrentPartiesCount();
    return json({ count });
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    return json({
      error: "Failed to get waitlist count",
      count: 0
    }, { status: 500 });
  }
}

export { GET, POST };
//# sourceMappingURL=_server-2xZ-NSJr.js.map
