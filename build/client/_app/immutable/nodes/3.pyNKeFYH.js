import{s as vt,n as J,o as _t,e as tt}from"../chunks/C3mXhKtC.js";import{S as mt,i as pt,d as v,s as L,a as z,b as i,m as dt,n as C,c as p,e as N,o as W,g as R,f as V,h as g,j as I,t as H,u as gt,v as et}from"../chunks/CeLBSusy.js";function lt(l){return(l==null?void 0:l.length)!==void 0?l:Array.from(l)}function st(l,t,e){const a=l.slice();return a[8]=t[e],a[10]=e,a}function at(l){let t,e,a="Last Updated:",o,c=G(l[3])+"",n;return{c(){t=g("div"),e=g("strong"),e.textContent=a,o=I(),n=H(c),this.h()},l(f){t=p(f,"DIV",{class:!0});var u=N(t);e=p(u,"STRONG",{"data-svelte-h":!0}),W(e)!=="svelte-1c3bkrf"&&(e.textContent=a),o=R(u),n=V(u,c),u.forEach(v),this.h()},h(){C(t,"class","status-item svelte-18ccqjy")},m(f,u){z(f,t,u),i(t,e),i(t,o),i(t,n)},p(f,u){u&8&&c!==(c=G(f[3])+"")&&L(n,c)},d(f){f&&v(t)}}}function nt(l){let t,e,a;return{c(){t=g("div"),e=g("p"),a=H(l[2]),this.h()},l(o){t=p(o,"DIV",{class:!0});var c=N(t);e=p(c,"P",{});var n=N(e);a=V(n,l[2]),n.forEach(v),c.forEach(v),this.h()},h(){C(t,"class","error-message svelte-18ccqjy")},m(o,c){z(o,t,c),i(t,e),i(e,a)},p(o,c){c&4&&L(a,o[2])},d(o){o&&v(t)}}}function bt(l){let t,e,a,o='<tr><th class="svelte-18ccqjy">Position</th> <th class="svelte-18ccqjy">Name</th> <th class="svelte-18ccqjy">Phone</th> <th class="svelte-18ccqjy">Party Size</th> <th class="svelte-18ccqjy">Time Added</th> <th class="svelte-18ccqjy">Status</th> <th class="svelte-18ccqjy">Actions</th></tr>',c,n,f,u,b,j=lt(l[0]),r=[];for(let s=0;s<j.length;s+=1)r[s]=ct(st(l,j,s));let h=l[0].length===0&&ot(),m=l[4]&&rt(l);return{c(){t=g("div"),e=g("table"),a=g("thead"),a.innerHTML=o,c=I(),n=g("tbody");for(let s=0;s<r.length;s+=1)r[s].c();f=I(),h&&h.c(),u=I(),m&&m.c(),b=et(),this.h()},l(s){t=p(s,"DIV",{class:!0});var y=N(t);e=p(y,"TABLE",{class:!0});var d=N(e);a=p(d,"THEAD",{"data-svelte-h":!0}),W(a)!=="svelte-w1bkh9"&&(a.innerHTML=o),c=R(d),n=p(d,"TBODY",{});var S=N(n);for(let O=0;O<r.length;O+=1)r[O].l(S);S.forEach(v),d.forEach(v),f=R(y),h&&h.l(y),y.forEach(v),u=R(s),m&&m.l(s),b=et(),this.h()},h(){C(e,"class","svelte-18ccqjy"),C(t,"class","waitlist-container svelte-18ccqjy")},m(s,y){z(s,t,y),i(t,e),i(e,a),i(e,c),i(e,n);for(let d=0;d<r.length;d+=1)r[d]&&r[d].m(n,null);i(t,f),h&&h.m(t,null),z(s,u,y),m&&m.m(s,y),z(s,b,y)},p(s,y){if(y&65){j=lt(s[0]);let d;for(d=0;d<j.length;d+=1){const S=st(s,j,d);r[d]?r[d].p(S,y):(r[d]=ct(S),r[d].c(),r[d].m(n,null))}for(;d<r.length;d+=1)r[d].d(1);r.length=j.length}s[0].length===0?h||(h=ot(),h.c(),h.m(t,null)):h&&(h.d(1),h=null),s[4]?m?m.p(s,y):(m=rt(s),m.c(),m.m(b.parentNode,b)):m&&(m.d(1),m=null)},d(s){s&&(v(t),v(u),v(b)),gt(r,s),h&&h.d(),m&&m.d(s)}}}function wt(l){let t,e="Loading waitlist data...";return{c(){t=g("p"),t.textContent=e},l(a){t=p(a,"P",{"data-svelte-h":!0}),W(t)!=="svelte-pjfdmx"&&(t.textContent=e)},m(a,o){z(a,t,o)},p:J,d(a){a&&v(t)}}}function it(l){let t,e="Remove",a,o;function c(){return l[7](l[8])}return{c(){t=g("button"),t.textContent=e,this.h()},l(n){t=p(n,"BUTTON",{class:!0,"data-svelte-h":!0}),W(t)!=="svelte-rc61dh"&&(t.textContent=e),this.h()},h(){C(t,"class","remove-button svelte-18ccqjy")},m(n,f){z(n,t,f),a||(o=dt(t,"click",c),a=!0)},p(n,f){l=n},d(n){n&&v(t),a=!1,o()}}}function ct(l){let t,e,a=(l[8].status==="waiting"?l[0].filter(ht).indexOf(l[8])+1:"-")+"",o,c,n,f=l[8].name+"",u,b,j,r=ft(l[8].phone)+"",h,m,s,y=l[8].party_size+"",d,S,O,B=G(l[8].created_at)+"",U,T,q,M=l[8].status+"",F,P,_,E,A,k=l[8].status==="waiting"&&it(l);return{c(){t=g("tr"),e=g("td"),o=H(a),c=I(),n=g("td"),u=H(f),b=I(),j=g("td"),h=H(r),m=I(),s=g("td"),d=H(y),S=I(),O=g("td"),U=H(B),T=I(),q=g("td"),F=H(M),P=I(),_=g("td"),k&&k.c(),E=I(),this.h()},l(D){t=p(D,"TR",{class:!0});var w=N(t);e=p(w,"TD",{class:!0});var Y=N(e);o=V(Y,a),Y.forEach(v),c=R(w),n=p(w,"TD",{class:!0});var K=N(n);u=V(K,f),K.forEach(v),b=R(w),j=p(w,"TD",{class:!0});var Q=N(j);h=V(Q,r),Q.forEach(v),m=R(w),s=p(w,"TD",{class:!0});var X=N(s);d=V(X,y),X.forEach(v),S=R(w),O=p(w,"TD",{class:!0});var Z=N(O);U=V(Z,B),Z.forEach(v),T=R(w),q=p(w,"TD",{class:!0});var $=N(q);F=V($,M),$.forEach(v),P=R(w),_=p(w,"TD",{class:!0});var x=N(_);k&&k.l(x),x.forEach(v),E=R(w),w.forEach(v),this.h()},h(){C(e,"class","svelte-18ccqjy"),C(n,"class","svelte-18ccqjy"),C(j,"class","svelte-18ccqjy"),C(s,"class","svelte-18ccqjy"),C(O,"class","svelte-18ccqjy"),C(q,"class","svelte-18ccqjy"),C(_,"class","svelte-18ccqjy"),C(t,"class",A=tt(l[8].status==="waiting"?"waiting":"completed")+" svelte-18ccqjy")},m(D,w){z(D,t,w),i(t,e),i(e,o),i(t,c),i(t,n),i(n,u),i(t,b),i(t,j),i(j,h),i(t,m),i(t,s),i(s,d),i(t,S),i(t,O),i(O,U),i(t,T),i(t,q),i(q,F),i(t,P),i(t,_),k&&k.m(_,null),i(t,E)},p(D,w){w&1&&a!==(a=(D[8].status==="waiting"?D[0].filter(ht).indexOf(D[8])+1:"-")+"")&&L(o,a),w&1&&f!==(f=D[8].name+"")&&L(u,f),w&1&&r!==(r=ft(D[8].phone)+"")&&L(h,r),w&1&&y!==(y=D[8].party_size+"")&&L(d,y),w&1&&B!==(B=G(D[8].created_at)+"")&&L(U,B),w&1&&M!==(M=D[8].status+"")&&L(F,M),D[8].status==="waiting"?k?k.p(D,w):(k=it(D),k.c(),k.m(_,null)):k&&(k.d(1),k=null),w&1&&A!==(A=tt(D[8].status==="waiting"?"waiting":"completed")+" svelte-18ccqjy")&&C(t,"class",A)},d(D){D&&v(t),k&&k.d()}}}function ot(l){let t,e="No entries in the waitlist";return{c(){t=g("p"),t.textContent=e,this.h()},l(a){t=p(a,"P",{class:!0,"data-svelte-h":!0}),W(t)!=="svelte-8oj6ox"&&(t.textContent=e),this.h()},h(){C(t,"class","no-data svelte-18ccqjy")},m(a,o){z(a,t,o)},d(a){a&&v(t)}}}function rt(l){let t,e,a="Debug Information",o,c,n=JSON.stringify(l[4],null,2)+"",f;return{c(){t=g("div"),e=g("h2"),e.textContent=a,o=I(),c=g("pre"),f=H(n),this.h()},l(u){t=p(u,"DIV",{class:!0});var b=N(t);e=p(b,"H2",{"data-svelte-h":!0}),W(e)!=="svelte-1tzkjs1"&&(e.textContent=a),o=R(b),c=p(b,"PRE",{class:!0});var j=N(c);f=V(j,n),j.forEach(v),b.forEach(v),this.h()},h(){C(c,"class","svelte-18ccqjy"),C(t,"class","debug-section svelte-18ccqjy")},m(u,b){z(u,t,b),i(t,e),i(t,o),i(t,c),i(c,f)},p(u,b){b&16&&n!==(n=JSON.stringify(u[4],null,2)+"")&&L(f,n)},d(u){u&&v(t)}}}function yt(l){let t,e,a="Waitlist Admin",o,c,n,f,u="Total Waiting:",b,j=l[0].filter(ut).length+"",r,h,m,s,y=l[1]?"Refreshing...":"Refresh Now",d,S,O,B,U,T=l[3]&&at(l),q=l[2]&&nt(l);function M(_,E){return _[1]&&!_[0].length?wt:bt}let F=M(l),P=F(l);return{c(){t=g("main"),e=g("h1"),e.textContent=a,o=I(),c=g("div"),n=g("div"),f=g("strong"),f.textContent=u,b=I(),r=H(j),h=I(),T&&T.c(),m=I(),s=g("button"),d=H(y),S=I(),q&&q.c(),O=I(),P.c(),this.h()},l(_){t=p(_,"MAIN",{class:!0});var E=N(t);e=p(E,"H1",{class:!0,"data-svelte-h":!0}),W(e)!=="svelte-omdrwe"&&(e.textContent=a),o=R(E),c=p(E,"DIV",{class:!0});var A=N(c);n=p(A,"DIV",{class:!0});var k=N(n);f=p(k,"STRONG",{"data-svelte-h":!0}),W(f)!=="svelte-16s4w4h"&&(f.textContent=u),b=R(k),r=V(k,j),k.forEach(v),h=R(A),T&&T.l(A),m=R(A),s=p(A,"BUTTON",{class:!0});var D=N(s);d=V(D,y),D.forEach(v),A.forEach(v),S=R(E),q&&q.l(E),O=R(E),P.l(E),E.forEach(v),this.h()},h(){C(e,"class","svelte-18ccqjy"),C(n,"class","status-item svelte-18ccqjy"),C(s,"class","refresh-button svelte-18ccqjy"),s.disabled=l[1],C(c,"class","status-bar svelte-18ccqjy"),C(t,"class","svelte-18ccqjy")},m(_,E){z(_,t,E),i(t,e),i(t,o),i(t,c),i(c,n),i(n,f),i(n,b),i(n,r),i(c,h),T&&T.m(c,null),i(c,m),i(c,s),i(s,d),i(t,S),q&&q.m(t,null),i(t,O),P.m(t,null),B||(U=dt(s,"click",l[5]),B=!0)},p(_,[E]){E&1&&j!==(j=_[0].filter(ut).length+"")&&L(r,j),_[3]?T?T.p(_,E):(T=at(_),T.c(),T.m(c,m)):T&&(T.d(1),T=null),E&2&&y!==(y=_[1]?"Refreshing...":"Refresh Now")&&L(d,y),E&2&&(s.disabled=_[1]),_[2]?q?q.p(_,E):(q=nt(_),q.c(),q.m(t,O)):q&&(q.d(1),q=null),F===(F=M(_))&&P?P.p(_,E):(P.d(1),P=F(_),P&&(P.c(),P.m(t,null)))},i:J,o:J,d(_){_&&v(t),T&&T.d(),q&&q.d(),P.d(),B=!1,U()}}}function G(l){return new Date(l).toLocaleString()}function ft(l){const t=l.replace(/\D/g,"");return t.length===10?`(${t.slice(0,3)}) ${t.slice(3,6)}-${t.slice(6)}`:l}const ut=l=>l.status==="waiting",ht=l=>l.status==="waiting";function jt(l,t,e){let a=[],o=!0,c=null,n=null,f=null;_t(async()=>{await u(),setInterval(u,3e4)});async function u(){try{e(1,o=!0),e(2,c=null);const h=await(await fetch("/api/waitlist/debug")).json();e(4,f=h);const s=await(await fetch("/api/waitlist/all")).json();if(s.error)throw new Error(s.error);s.waitlist&&(e(0,a=s.waitlist),e(3,n=new Date))}catch(r){console.error("Error fetching waitlist:",r),e(2,c=r.message||"Failed to load waitlist data")}finally{e(1,o=!1)}}async function b(r){if(confirm("Are you sure you want to remove this party from the waitlist?"))try{const h=await fetch(`/api/waitlist/${r}`,{method:"DELETE"}),m=await h.json();if(!h.ok)throw new Error(m.error||"Failed to remove from waitlist");await u()}catch(h){console.error("Error removing from waitlist:",h),e(2,c=h.message||"Failed to remove from waitlist")}}return[a,o,c,n,f,u,b,r=>b(r.id)]}class Ct extends mt{constructor(t){super(),pt(this,t,jt,yt,vt,{})}}export{Ct as component};
