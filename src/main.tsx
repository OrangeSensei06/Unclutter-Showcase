import { Home } from './Home';
import { Architecture } from './Architecture';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import './styles.css';
import './desktop.css';
import './showcase.css';
import { Brand, SidebarAppearance, ThemeController } from './theme';
import { Inbox } from './Inbox';
const base = import.meta.env.BASE_URL;
const route = location.pathname.slice(base.length).replace(/index\.html$/, '').replace(/\/$/, '');
function App(){return <><ThemeController/><a className="skip-link" href="#content">Skip to content</a><header className="site-header"><Brand/><nav aria-label="Showcase pages">{[['','Home'],['try/','Try It Yourself'],['architecture/','Architecture']].map(([url,label])=><a key={url} href={base+url} aria-current={route===url.replace(/\/$/,'')?'page':undefined}>{label}</a>)}</nav><SidebarAppearance/></header>{route==='try'?<Inbox/>:route==='architecture'?<Architecture/>:<Home/>}<footer className="site-footer">Unclutter showcase · Fictional data. Simulated classification. Browser-only interactions.</footer></>;}
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
