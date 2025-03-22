export const manifest = (() => {
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
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/api/waitlist/_server.js'))
			},
			{
				id: "/api/waitlist/all",
				pattern: /^\/api\/waitlist\/all\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/waitlist/all/_server.js'))
			},
			{
				id: "/api/waitlist/debug",
				pattern: /^\/api\/waitlist\/debug\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/waitlist/debug/_server.js'))
			},
			{
				id: "/api/waitlist/[id]",
				pattern: /^\/api\/waitlist\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/waitlist/_id_/_server.js'))
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

export const prerendered = new Set([]);

export const base = "";