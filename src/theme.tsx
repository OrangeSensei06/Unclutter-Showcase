import { useEffect, useState, type CSSProperties } from 'react';

export type Appearance = 'light' | 'dark' | 'system';
export const stored = (key: string, fallback: string) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
export function persist(key: string, value: string) { try { localStorage.setItem(key, value); } catch { /* Private browsing may disallow storage. */ } }
export function readAppearance(): Appearance { const value = stored('unclutter-appearance', 'system'); return value === 'light' || value === 'dark' ? value : 'system'; }
export function AppearanceControl() {
  const [value, setValue] = useState<Appearance>(readAppearance);
  useEffect(() => { const changed = () => setValue(readAppearance()); window.addEventListener('unclutter-appearance', changed); return () => window.removeEventListener('unclutter-appearance', changed); }, []);
  return <label className="appearance-control" title="Appearance"><Icon name="moon"/><span className="sr-only">Appearance</span><select aria-label="Appearance" value={value} onChange={e => { const next = e.target.value as Appearance; persist('unclutter-appearance', next); setValue(next); window.dispatchEvent(new Event('unclutter-appearance')); }}>{['light', 'dark', 'system'].map(v => <option key={v} value={v}>{v[0]!.toUpperCase() + v.slice(1)}</option>)}</select></label>;
}
export function SidebarAppearance(){
  const resolved=():'light'|'dark'=>document.documentElement.dataset.theme==='dark'||(!document.documentElement.dataset.theme&&(readAppearance()==='dark'||readAppearance()==='system'&&window.matchMedia?.('(prefers-color-scheme: dark)')?.matches))?'dark':'light';
  const [value,setValue]=useState(resolved);
  useEffect(()=>{const update=()=>setValue(resolved());update();window.addEventListener('unclutter-theme-applied',update);return()=>window.removeEventListener('unclutter-theme-applied',update);},[]);
  const next=value==='dark'?'light':'dark';
  return <button className="appearance-toggle" title={'Switch to '+next+' mode'} aria-label={'Switch to '+next+' mode'} onClick={()=>{persist('unclutter-appearance',next);setValue(next);window.dispatchEvent(new Event('unclutter-appearance'));}}><Icon name="moon"/><span className="nav-label">{value==='dark'?'Dark':'Light'}</span></button>;
}
export function SidebarTools({settings,disabled=false}:{settings:()=>void;disabled?:boolean}) {
  return <div className="sidebar-tools"><SidebarAppearance/><button title="Settings" aria-label="Settings" disabled={disabled} onClick={settings}><Icon name="settings"/><span className="nav-label">Settings</span></button></div>;
}
export function ThemeController() {
  useEffect(() => { const media = window.matchMedia('(prefers-color-scheme: dark)'); const apply = () => { const value = readAppearance(),next=value==='system'?(media.matches?'dark':'light'):value;
    const change=()=>{document.documentElement.dataset.theme=next;document.documentElement.style.colorScheme=next;window.dispatchEvent(new Event('unclutter-theme-applied'));};
    if(document.documentElement.dataset.theme&&document.documentElement.dataset.theme!==next&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&typeof document.startViewTransition==='function'){
      const transition=document.startViewTransition(change);void transition.ready.catch(()=>{});void transition.finished.catch(()=>{});
    }else change(); }; const visibility = () => { document.documentElement.dataset.paused = String(document.hidden); }; apply(); visibility(); media.addEventListener('change', apply); window.addEventListener('storage', apply); window.addEventListener('unclutter-appearance', apply); document.addEventListener('visibilitychange', visibility); return () => { media.removeEventListener('change', apply); window.removeEventListener('storage', apply); window.removeEventListener('unclutter-appearance', apply); document.removeEventListener('visibilitychange', visibility); }; }, []);
  return null;
}
export function Icon({ name }: { name: string }) { return <span className="ui-icon" aria-hidden="true"><img className="icon-light" src={`${import.meta.env.BASE_URL}design/icon-${name}.svg`} alt=""/><img className="icon-dark" src={`${import.meta.env.BASE_URL}design/dark-icon-${name}.svg`} alt=""/></span>; }
export function Brand({ large = false }: { large?: boolean }) { return <a className={`brand ${large ? 'brand-large' : ''}`} href={import.meta.env.BASE_URL} aria-label="Unclutter home"><Icon name="spark"/><span>unclutter<span className="brand-dot">.</span></span></a>; }

type RGB = [number, number, number];
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const parse = (hex: string): RGB => /^#[\da-f]{6}$/i.test(hex) ? [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255) as RGB : parse('#CE571C');
const linear = (v: number) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
const gamma = (v: number) => clamp(v <= .0031308 ? 12.92 * v : 1.055 * Math.max(v, 0) ** (1 / 2.4) - .055);
const hex = (rgb: RGB) => '#' + rgb.map(v => Math.round(clamp(v) * 255).toString(16).padStart(2, '0')).join('');
export function contrast(a: string, b: string) { const lum = (value: string) => { const c = parse(value).map(linear); return c[0]! * .2126 + c[1]! * .7152 + c[2]! * .0722; }; const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
// OKLab lightness adjustment retains hue/chroma where in gamut. The final RGB
// value is clamped and contrast-checked against both actual neutral surfaces.
export function readable(color: string, dark: boolean) {
  const original = hex(parse(color));
  const mix = (background:string, amount:number) => hex(parse(original).map((v,i)=>v*amount+parse(background)[i]!*(1-amount)) as RGB);
  const backgrounds = dark ? ['#25262A','#28292C','#1F2023',mix('#25262A',.17),mix('#25262A',.12)] : ['#FAF4EF','#F6EFEB','#F2E8E1',mix('#FAF4EF',.17),mix('#F2E8E1',.12)];
  const valid = (c: string) => backgrounds.every(bg => contrast(c, bg) >= 4.5);
  const preferred = original.toUpperCase()==='#CE571C' ? dark ? '#F2AD83' : '#A64C27' : original;
  if (valid(preferred)) return preferred;
  const [r, g, b] = parse(original).map(linear) as RGB;
  const l = Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b), m = Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b), s = Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
  const L = .2104542553*l+.793617785*m-.0040720468*s, A = 1.9779984951*l-2.428592205*m+.4505937099*s, B = .0259040371*l+.7827717662*m-.808675766*s;
  for (let step = 1; step <= 100; step++) { const light = L + ((dark ? 1 : 0)-L)*step/100, chroma = 1-step/100; const ll = (light+.3963377774*A*chroma+.2158037573*B*chroma)**3, mm = (light-.1055613458*A*chroma-.0638541728*B*chroma)**3, ss = (light-.0894841775*A*chroma-1.291485548*B*chroma)**3; const result = hex([gamma(4.0767416621*ll-3.3077115913*mm+.2309699292*ss), gamma(-1.2684380046*ll+2.6097574011*mm-.3413193965*ss), gamma(-.0041960863*ll-.7034186147*mm+1.707614701*ss)]); if (valid(result)) return result; }
  return dark ? '#F2AD83' : '#A64C27';
}
export function accentStyle(color: string): CSSProperties { return { '--accent-light': readable(color, false), '--accent-dark': readable(color, true), '--tint': /^#[\da-f]{6}$/i.test(color) ? color : '#CE571C' } as CSSProperties; }
export function Ambient({ color = '#CE571C', login = false }: { color?: string; login?: boolean }) {
  const [layers, setLayers] = useState([color, color]), [front, setFront] = useState(0);
  useEffect(() => { if (layers[front] === color) return; const next = 1 - front; setLayers(old => old.map((v, i) => i === next ? color : v)); setFront(next); }, [color, front, layers]);
  return <div className={`ambient ${login ? 'ambient-login' : ''}`} aria-hidden="true">{layers.map((c, i) => <div key={i} className={i === front ? 'visible' : ''} style={{ '--tint': c } as CSSProperties}/>)}</div>;
}
