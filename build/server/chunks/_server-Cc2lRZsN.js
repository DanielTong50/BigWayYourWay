import { j as json } from './index-BIAFQWR9.js';
import { r as removeFromWaitlist } from './db-DiPfE1r4.js';
import '@supabase/supabase-js';

async function DELETE({ params }) {
  try {
    const { id } = params;
    const result = await removeFromWaitlist(id);
    if (result) {
      return json({ success: true });
    } else {
      return json({ error: "Entry not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error removing from waitlist:", error);
    return json({ error: "Failed to remove from waitlist" }, { status: 500 });
  }
}

export { DELETE };
//# sourceMappingURL=_server-Cc2lRZsN.js.map
