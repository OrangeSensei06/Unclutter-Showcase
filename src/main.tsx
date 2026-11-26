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
function Home(){return <main id="content" className="story home"><span className="eyebrow">YOUR SPACE, A LITTLE CLEARER</span><h1>A little room<br/>to think<span className="brand-dot">.</span></h1><p className="lede">An inbox organized around what an email means to you. See its category, understand the explanation, and put it where it belongs.</p><a className="button primary" href={base+'try/'}>Try It Yourself</a><span className="home-note">50 fictional emails · simulated classification · no login</span><section className="home-example"><span className="eyebrow">A MOMENT IN THE INBOX</span><div><span className="example-category">Events</span><h2>Music on the lawn</h2><p>An optional campus concert is an event. A rehearsal for club members belongs somewhere else. Similar words, different intent.</p></div><p>Open a message, read why it was categorized, then change the category yourself. Your choices stay in this browser tab until you reset or reload.</p></section><a className="text-link" href={base+'architecture/'}>Explore the batching tradeoff</a></main>;}
function App(){return <><ThemeController/><a className="skip-link" href="#content">Skip to content</a><header className="site-header"><Brand/><nav aria-label="Showcase pages">{[['','Home'],['try/','Try It Yourself'],['architecture/','Architecture']].map(([url,label])=><a key={url} href={base+url} aria-current={route===url.replace(/\/$/,'')?'page':undefined}>{label}</a>)}</nav><SidebarAppearance/></header>{route==='try'?<Inbox/>:route==='architecture'?<Architecture/>:<Home/>}<footer className="site-footer">Unclutter showcase · Fictional data. Simulated classification. Browser-only interactions.</footer></>;}
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
