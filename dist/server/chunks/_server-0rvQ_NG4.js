import { j as json } from './index-BIAFQWR9.js';
import { c as getWaitlist } from './db-DiPfE1r4.js';
import '@supabase/supabase-js';

async function GET() {
  try {
    const waitlist = await getWaitlist();
    return json({ waitlist });
  } catch (error) {
    console.error("Error getting waitlist:", error);
    return json({
      error: "Failed to get waitlist",
      waitlist: []
    }, { status: 500 });
  }
}

export { GET };
//# sourceMappingURL=_server-0rvQ_NG4.js.map
