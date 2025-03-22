const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["_redirects","favicon.png","location.svg","logo.png","phone.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.ih788Pox.js",app:"_app/immutable/entry/app.DWnAal8J.js",imports:["_app/immutable/entry/start.ih788Pox.js","_app/immutable/chunks/DHFB-38-.js","_app/immutable/chunks/C3mXhKtC.js","_app/immutable/entry/app.DWnAal8J.js","_app/immutable/chunks/C3mXhKtC.js","_app/immutable/chunks/CeLBSusy.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-C2Ap1UF1.js')),
			__memo(() => import('./chunks/1-D1eUTYzA.js')),
			__memo(() => import('./chunks/2-rInVH2W3.js')),
			__memo(() => import('./chunks/3-CBl8Oqm4.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/waitlist",
				pattern: /^\/api\/waitlist\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-2xZ-NSJr.js'))
			},
			{
				id: "/api/waitlist/all",
				pattern: /^\/api\/waitlist\/all\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-0rvQ_NG4.js'))
			},
			{
				id: "/api/waitlist/debug",
				pattern: /^\/api\/waitlist\/debug\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-BU1QFPXv.js'))
			},
			{
				id: "/api/waitlist/[id]",
				pattern: /^\/api\/waitlist\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-Cc2lRZsN.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
