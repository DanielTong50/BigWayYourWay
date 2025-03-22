

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.pyNKeFYH.js","_app/immutable/chunks/C3mXhKtC.js","_app/immutable/chunks/CeLBSusy.js"];
export const stylesheets = ["_app/immutable/assets/3.C7mYxGlc.css"];
export const fonts = [];
