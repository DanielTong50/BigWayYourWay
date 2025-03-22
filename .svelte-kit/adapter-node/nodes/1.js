

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BMAAGOR6.js","_app/immutable/chunks/C3mXhKtC.js","_app/immutable/chunks/CeLBSusy.js","_app/immutable/chunks/DSr7hFQS.js"];
export const stylesheets = [];
export const fonts = [];
