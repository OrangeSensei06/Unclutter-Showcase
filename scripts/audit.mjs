import fs from 'node:fs';
import path from 'node:path';
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const data=JSON.parse(fs.readFileSync('src/emails.json','utf8'));
if(data.length!==50||new Set(data.map(e=>e.id)).size!==50)throw Error('Expected exactly 50 unique fictional messages');
for(const e of data){if(!e.sender.match(/<[\w.+-]+@[\w.-]+\.example\.test>$/))throw Error('Unexpected sender');}
const issues=[];const all=[...files('src'),...files('public'),...files('dist')];
for(const p of all){if(/\.map$|(?:^|[\\/])(?:\.env|server|backend|credentials)(?:[.\\/]|$)/i.test(p))issues.push(p);if(!/\.(?:tsx?|css|html|json|svg|js)$/.test(p))continue;const s=fs.readFileSync(p,'utf8');for(const pattern of [/https?:\/\/(?!www\.w3\.org\/(?:2000\/svg|1998\/Math\/MathML|1999\/xlink|XML\/1998\/namespace)|react\.dev\/errors\/|console\.groq\.com\/docs\/rate-limits)[^\s"'<>]+/g,/\b(?:fetch|WebSocket|EventSource|XMLHttpRequest)\s*\(/g,/sourceMappingURL|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|AIza[\w-]{20,}|sk-[\w-]{20,}/g,/localhost|127\.0\.0\.1|192\.168\.|googleusercontent|mail\.google|\/api\//gi]){const match=s.match(pattern);if(match)issues.push({p,match});}}
if(issues.length){console.error(issues);process.exitCode=1;}else console.log('PASS: 50 reserved-domain fictional emails; source/public/build checked for private URLs, runtime connections, secrets, source maps and forbidden file classes.');
