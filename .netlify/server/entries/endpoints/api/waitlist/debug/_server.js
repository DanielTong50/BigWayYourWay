import { j as json } from "../../../../../chunks/index.js";
import { d as getDatabaseStatus } from "../../../../../chunks/db.js";
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
export {
  GET
};
