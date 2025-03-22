import { c as create_ssr_component } from "../../chunks/ssr.js";
const css = {
  code: ".app-container.svelte-utt2b0{width:100%;min-height:100vh;background-color:var(--background-color);display:flex;flex-direction:column}@media(max-width: 768px){.app-container.svelte-utt2b0{padding:0 0.75rem}}@media(max-width: 480px){.app-container.svelte-utt2b0{padding:0 0.5rem}}body{margin:0;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\n      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif}",
  map: `{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<script>\\n  import '../app.css';\\n<\/script>\\n\\n<div class=\\"app-container\\">\\n  <slot />\\n</div>\\n\\n<style>\\n  .app-container {\\n    width: 100%;\\n    min-height: 100vh;\\n    background-color: var(--background-color);\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  /* Responsive margins */\\n  @media (max-width: 768px) {\\n    .app-container {\\n      padding: 0 0.75rem;\\n    }\\n  }\\n\\n  @media (max-width: 480px) {\\n    .app-container {\\n      padding: 0 0.5rem;\\n    }\\n  }\\n\\n  :global(body) {\\n    margin: 0;\\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\\n      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\\n  }\\n</style> "],"names":[],"mappings":"AASE,4BAAe,CACb,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,CACjB,gBAAgB,CAAE,IAAI,kBAAkB,CAAC,CACzC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAClB,CAGA,MAAO,YAAY,KAAK,CAAE,CACxB,4BAAe,CACb,OAAO,CAAE,CAAC,CAAC,OACb,CACF,CAEA,MAAO,YAAY,KAAK,CAAE,CACxB,4BAAe,CACb,OAAO,CAAE,CAAC,CAAC,MACb,CACF,CAEQ,IAAM,CACZ,MAAM,CAAE,CAAC,CACT,WAAW,CAAE,aAAa,CAAC,CAAC,kBAAkB,CAAC,CAAC,UAAU,CAAC,CAAC,MAAM,CAAC,CAAC,MAAM;AAC9E,MAAM,MAAM,CAAC,CAAC,SAAS,CAAC,CAAC,WAAW,CAAC,CAAC,gBAAgB,CAAC,CAAC,UACtD"}`
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app-container svelte-utt2b0">${slots.default ? slots.default({}) : ``} </div>`;
});
export {
  Layout as default
};
