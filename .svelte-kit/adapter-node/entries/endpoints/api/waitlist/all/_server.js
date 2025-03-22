import { j as json } from "../../../../../chunks/index.js";
import { c as getWaitlist } from "../../../../../chunks/db.js";
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
export {
  GET
};
