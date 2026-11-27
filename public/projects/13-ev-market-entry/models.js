// Independent educational models. All inputs are synthetic unless cited in research.
export const sum = a => a.reduce((s,x)=>s+x,0);
export const mean = a => a.length ? sum(a)/a.length : 0;
export function quotes(rows,w) {
 const total=sum(w); if(total<=0) throw Error('Choose at least one non-zero weight.');
 const costs=rows.map(r=>r.unit*r.qty+r.freight), min=Math.min(...costs), fastest=Math.min(...rows.map(r=>r.days));
 return rows.map((r,i)=>({...r,total:costs[i],score:100*(w[0]*min/costs[i]+w[1]*fastest/r.days+w[2]*r.quality/100)/total})).sort((a,b)=>b.score-a.score||a.total-b.total);
}
export function reconcile(rows,tolerance=0) {return rows.map(r=>{const expected=r.opening+r.received-r.sold+r.returned;const delta=r.counted-expected;return {...r,expected,delta,value:delta*r.unitCost,status:Math.abs(delta)<=tolerance?'Within tolerance':'Investigate'};});}
export function dispatch(requests,fleet=3,strategy='fifo',price=85) {
 const vans=Array.from({length:fleet},()=>({free:0,x:0,busy:0})); const pending=requests.map(r=>({...r}));const jobs=[];
 while(pending.length){const van=vans.reduce((a,b)=>a.free<=b.free?a:b);let now=Math.max(van.free,Math.min(...pending.map(r=>r.arrival))); const eligible=pending.filter(r=>r.arrival<=now);
 const score=r=>strategy==='nearest'?Math.abs(van.x-r.x):strategy==='shortest'?r.kwh:r.arrival;
 eligible.sort((a,b)=>score(a)-score(b)||a.id-b.id);const r=eligible[0];pending.splice(pending.indexOf(r),1);
 const travel=Math.abs(van.x-r.x)*3+5, service=r.kwh/40*60, start=now+travel, end=start+service;
 van.free=end;van.x=r.x;van.busy+=travel+service;jobs.push({...r,start,end,wait:start-r.arrival,travel,service});}
 const horizon=Math.max(480,...vans.map(v=>v.free)), energy=sum(jobs.map(r=>r.kwh));
 return {jobs,wait:mean(jobs.map(r=>r.wait)),p90:jobs.map(r=>r.wait).sort((a,b)=>a-b)[Math.ceil(jobs.length*.9)-1]||0,utilization:sum(vans.map(v=>v.busy))/(horizon*fleet)*100,horizon,margin:jobs.length*price-energy*.65-sum(jobs.map(r=>r.travel))*1.2-fleet*350};
}
export function business(rows,adoption=70,wage=60){return rows.map(r=>{const hours=r.volume*r.minutes/60*adoption/100*r.eligible/100;const net=hours*wage-r.monthly;return {...r,hours,net,payback:net>0?r.setup/net:null,year:net*12-r.setup};}).sort((a,b)=>b.year-a.year);}
export const normalize=s=>s.toLowerCase().replace(/\s+/g,' ').trim();
export function policyDiff(a,b){const keys=[...new Set([...Object.keys(a),...Object.keys(b)])];return keys.map(key=>({section:key,before:a[key]||'',after:b[key]||'',status:!(key in a)?'Added':!(key in b)?'Removed':normalize(a[key])===normalize(b[key])?'Unchanged':'Changed'}));}
export function funnel(events,channel='All') {const users=[...new Set(events.filter(e=>e.stage==='visit'&&(channel==='All'||e.channel===channel)).map(e=>e.user))]; const stages=['visit','signup','documents','review','approved'];let eligible=users;const times={};for(const u of users){times[u]={};for(const stage of stages){const hours=events.filter(e=>e.user===u&&e.stage===stage).map(e=>e.hour);if(hours.length)times[u][stage]=Math.min(...hours);}}
 const counts=stages.map((stage,i)=>{eligible=eligible.filter(u=>times[u][stage]!==undefined&&(!i||times[u][stage]>=times[u][stages[i-1]]));return {stage,count:eligible.length};});
 const delays=eligible.map(u=>times[u].approved-times[u].review);
 return {counts,delay:mean(delays),completed:delays.length};}
export function spend(raw){const seen=new Set();let duplicates=0;const rows=[];const rejected=[];for(const r of raw){if(seen.has(r.invoice)){duplicates++;continue;}seen.add(r.invoice);if(r.qty<=0||r.unitPrice<=0){rejected.push(r);continue;} rows.push({...r,supplier:r.supplier.trim().toUpperCase(),category:r.item.includes('Cable')?'Electrical':r.item.includes('Paint')?'Finishes':'Hardware',amount:r.qty*r.unitPrice});}
 const total=sum(rows.map(r=>r.amount)), suppliers={};for(const r of rows)suppliers[r.supplier]=(suppliers[r.supplier]||0)+r.amount;
 const items=[...new Set(rows.map(r=>r.item))].map(item=>{const rr=rows.filter(r=>r.item===item),low=Math.min(...rr.map(r=>r.unitPrice)),high=Math.max(...rr.map(r=>r.unitPrice));return {item,low,high,opportunity:sum(rr.map(r=>(r.unitPrice-low)*r.qty))};});return {rows,duplicates,rejected,total,suppliers,items,concentration:Math.max(0,...Object.values(suppliers))/total*100,opportunity:sum(items.map(r=>r.opportunity))};}
export function booking(kwh,slot,version='fixed'){if(!Number.isFinite(kwh)||kwh<=0||kwh>80)return {ok:false,message:'Choose 1–80 kWh.'};if(version==='fixed'&&slot==='full')return {ok:false,message:'This slot is full.'}; return {ok:true,price:version==='buggy'?Math.floor(kwh)*2+25:kwh*2+25,message:'Demo booking confirmed'};}
export function qa(version){return [{id:'T1',requirement:'R1',scenario:'Reject zero energy',expected:false,actual:booking(0,'open',version).ok},{id:'T2',requirement:'R1',scenario:'Reject more than 80 kWh',expected:false,actual:booking(81,'open',version).ok},{id:'T3',requirement:'R2',scenario:'Reject a full slot',expected:false,actual:booking(20,'full',version).ok},{id:'T4',requirement:'R3',scenario:'Charge fractional kWh accurately',expected:66,actual:booking(20.5,'open',version).price},{id:'T5',requirement:'R4',scenario:'Confirm valid request',expected:true,actual:booking(20,'open',version).ok}].map(r=>({...r,passed:r.expected===r.actual}));}
export function market(jobs=6,price=110,days=26){const variable=25*.65+20,monthlyFixed=12500,contribution=price-variable;return {contribution,monthly:jobs*days*contribution-monthlyFixed,breakEven:contribution>0?monthlyFixed/contribution/days:null};}
export function fragrance(price=420,units=300,conversion=12){const converted=Math.round(units*conversion/100),cost=95,acquisition=units*18;return {converted,revenue:converted*price,contribution:converted*(price-cost)-acquisition,breakEven:price>cost?acquisition/(price-cost):null};}
export function startup(rows,budget=6000){return rows.map(r=>{const spend=budget*r.share/100,visits=Math.floor(spend/r.cpc),signups=Math.round(visits*r.signup),activated=Math.round(signups*r.activate),retained=Math.round(activated*r.retain);return {...r,spend,visits,signups,activated,retained,cac:activated?spend/activated:null};});}
