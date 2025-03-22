import { j as json } from './index-BIAFQWR9.js';
import { d as getDatabaseStatus } from './db-DiPfE1r4.js';
import '@supabase/supabase-js';

async function GET() {
  try {
    const status = await getDatabaseStatus();
    return json({
      status,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      dbPath: process.cwd()
    });
  } catch (error) {
    console.error("Error getting debug info:", error);
    return json({
      error: "Failed to get debug information",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, { status: 500 });
  }
}

export { GET };
//# sourceMappingURL=_server-BU1QFPXv.js.map
