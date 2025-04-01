import{r as l,e as k,f as x,i as p,g as E,h as v,k as j,l as M,n as R,s as S,o as N,c as A,u as $,j as u,m as h}from"./index-1KeI2Oak.js";function b(t){return typeof t=="number"?t:parseFloat(t)}function w(t,r={}){const{isStatic:o}=l.useContext(k),s=l.useRef(null),a=x(p(t)?b(t.get()):t),i=l.useRef(a.get()),d=l.useRef(()=>{}),e=()=>{const n=s.current;n&&n.time===0&&n.sample(j.delta),c(),s.current=M({keyframes:[a.get(),i.current],velocity:a.getVelocity(),type:"spring",restDelta:.001,restSpeed:.01,...r,onUpdate:d.current})},c=()=>{s.current&&s.current.stop()};return l.useInsertionEffect(()=>a.attach((n,f)=>o?f(n):(i.current=n,d.current=f,E.update(e),a.get()),c),[JSON.stringify(r)]),v(()=>{if(p(t))return t.on("change",n=>a.set(b(n)))},[a]),a}function I(t){t.values.forEach(r=>r.stop())}function y(t,r){[...r].reverse().forEach(s=>{const a=t.getVariant(s);a&&S(t,a),t.variantChildren&&t.variantChildren.forEach(i=>{y(i,r)})})}function V(t,r){if(Array.isArray(r))return y(t,r);if(typeof r=="string")return y(t,[r]);S(t,r)}function Y(){const t=new Set,r={subscribe(o){return t.add(o),()=>void t.delete(o)},start(o,s){const a=[];return t.forEach(i=>{a.push(R(i,o,{transitionOverride:s}))}),Promise.all(a)},set(o){return t.forEach(s=>{V(s,o)})},stop(){t.forEach(o=>{I(o)})},mount(){return()=>{r.stop()}}};return r}function L(){const t=N(Y);return v(t.mount,[]),t}const T=L;/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=A("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]),O=()=>{const t=l.useRef(null),r=x(0),o=x(0),s=w(o,{stiffness:100,damping:30}),a=w(r,{stiffness:100,damping:30}),{theme:i}=$(),d=[{text:"React",meme:"useState({brain: null})"},{text:"TypeScript",meme:"any: Allow me to introduce myself"},{text:"Python",meme:"indentation: am I a joke to you?"},{text:"JavaScript",meme:"undefined is not a function"},{text:"CSS",meme:"position: absolute; top: -9999px;"},{text:"HTML",meme:"<div class='center'>still not centered</div>"}];return l.useEffect(()=>{const e=c=>{var g;const n=(g=t.current)==null?void 0:g.getBoundingClientRect();if(!n)return;const f=n.left+n.width/2,C=n.top+n.height/2;r.set((c.clientX-f)/20),o.set((c.clientY-C)/20)};return window.addEventListener("mousemove",e),()=>window.removeEventListener("mousemove",e)},[r,o]),u.jsx("div",{ref:t,className:"w-40 h-40 perspective-1000 cursor-pointer mx-auto",children:u.jsx(h.div,{className:"w-full h-full relative transform-style-3d",style:{rotateX:s,rotateY:a},children:d.map((e,c)=>u.jsxs("div",{className:"absolute w-full h-full flex flex-col items-center justify-center transition-colors duration-300",style:{transform:{0:"translateZ(80px)",1:"translateZ(-80px) rotateY(180deg)",2:"translateX(80px) rotateY(90deg)",3:"translateX(-80px) rotateY(-90deg)",4:"translateY(-80px) rotateX(90deg)",5:"translateY(80px) rotateX(-90deg)"}[c],backgroundColor:`color-mix(in srgb, var(--color-${i}-primary) 15%, black)`,borderColor:`var(--color-${i}-accent)`,boxShadow:`0 0 20px rgba(var(--rgb-${i}-primary), 0.2)`,border:"1px solid",backdropFilter:"blur(8px)"},children:[u.jsx("span",{className:"text-white/90 font-mono text-sm mb-2",children:e.text}),u.jsx("span",{className:"text-white/60 font-mono text-xs px-2 text-center",children:e.meme})]},c))})})},m=(t,r)=>Math.random()*(r-t)+t,X=()=>{const[t,r]=l.useState({width:window.innerWidth,height:window.innerHeight});return l.useEffect(()=>{const o=()=>{r({width:window.innerWidth,height:window.innerHeight})};return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),t},z=[`// Random comment to make it look more authentic
const { data, loading, error } = useQuery(GET_REPOS);`,`// Matrix-style code animation
function Matrix() {
  return (
    <div className="matrix-container">
      {Array(50).fill(0).map((_, i) => (
        <motion.span
          key={i}
          animate={{ y: 100 }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          {String.fromCharCode(0x3000 + Math.floor(Math.random() * 0x30))} 
        </motion.span>
      ))}
    </div>
  );
}`],W=()=>{const{theme:t}=$(),{width:r,height:o}=X(),[s,a]=l.useState([]),i=T();l.useEffect(()=>{const e=z.map((c,n)=>({id:n,code:c,x:m(5,95),y:m(5,95),rotation:m(-15,15),scale:m(.6,1.2),delay:m(0,5),duration:m(20,40),opacity:m(.05,.15)}));a(e),i.start({opacity:1,transition:{duration:5,ease:"easeInOut",delay:d(.5)}})},[]);const d=e=>s.map((c,n)=>n*e);return u.jsx(h.div,{className:"absolute inset-0 overflow-hidden pointer-events-none z-0",initial:{opacity:0},animate:i,children:s.map(e=>u.jsx(h.div,{className:"absolute font-mono text-xs opacity-0 bg-black/30 rounded p-2 backdrop-blur-sm border border-opacity-10",style:{left:`${e.x}%`,top:`${e.y}%`,maxWidth:Math.min(r*.3,300),maxHeight:Math.min(o*.3,200),borderColor:`var(--color-${t}-primary)`,color:`var(--color-${t}-primary)`,boxShadow:`0 0 15px rgba(var(--rgb-${t}-primary), ${e.opacity*2})`,transform:`rotate(${e.rotation}deg) scale(${e.scale})`},initial:{opacity:0},animate:{opacity:[0,e.opacity,e.opacity,0],y:[`${e.y}%`,`${e.y-5}%`,`${e.y+8}%`,`${e.y}%`],x:[`${e.x}%`,`${e.x+4}%`,`${e.x-4}%`,`${e.x}%`],scale:[e.scale,e.scale*1.1,e.scale*.9,e.scale],rotate:[e.rotation,e.rotation+2,e.rotation-2,e.rotation]},transition:{repeat:1/0,duration:e.duration,delay:e.delay,ease:"easeInOut"},children:u.jsx("pre",{className:"opacity-80 whitespace-pre-wrap break-all",children:u.jsx("code",{children:e.code})})},e.id))})};export{W as F,O as R,H as T};
