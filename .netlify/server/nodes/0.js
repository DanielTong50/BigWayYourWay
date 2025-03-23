

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DsyubiMB.js","_app/immutable/chunks/C3mXhKtC.js","_app/immutable/chunks/CeLBSusy.js"];
export const stylesheets = ["_app/immutable/assets/0.BcOUbcgM.css"];
export const fonts = [];
