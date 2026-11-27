import {studies} from './extended-content.js';
import {reconcile, spend, booking, qa, startup, sum} from './models.js';
import {evEconomics, fragranceEconomics, experimentEffect} from './extended-models.js';

const id = Number(document.body.dataset.project);
const study = studies[id];
const main = document.querySelector('main');
const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[c]));
const money = value => new Intl.NumberFormat('en-AE', {style:'currency', currency:'AED'}).format(value);
const percent = fraction => (100 * fraction).toFixed(1) + '%';
const table = (headers, rows) => `<div class="table-scroll"><table><thead><tr>
  ${headers.map(header => `<th scope="col">${escape(header)}</th>`).join('')}
  </tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const number = (name, label, value, min, max, step = 1) =>
  `<label>${label}<input type="number" name="${name}" value="${value}" min="${min}" max="${max}" step="${step}" required></label>`;
const select = (name, label, options) => `<label>${label}<select name="${name}">${options.map(
  ([value, text]) => `<option value="${escape(value)}">${escape(text)}</option>`
).join('')}</select></label>`;
const metrics = entries => `<div class="metrics">${entries.map(([value, label]) =>
  `<div class="metric"><strong>${escape(value)}</strong><span>${escape(label)}</span></div>`
).join('')}</div>`;

function inventory(data, form) {
  const rows = reconcile(data.inventory, Number(form.get('tolerance')));
  const exceptions = rows.filter(row => row.status === 'Investigate').sort((a,b) => Math.abs(b.value) - Math.abs(a.value));
  const visible = form.get('scope') === 'exceptions' ? exceptions : rows;
  return {
    payload: {rows, exceptions},
    html: metrics([[exceptions.length,'SKUs to investigate'],[money(sum(exceptions.map(r => Math.abs(r.value)))),'Absolute exception exposure'],[sum(rows.map(r=>r.delta)),'Net unit variance']]) +
      (visible.length ? table(['SKU','Opening','Receipts','Sales','Returns','Expected','Counted','Variance','Cost exposure','Status'], visible.map(r =>
        [r.sku,r.opening,r.received,r.sold,r.returned,r.expected,r.counted,r.delta,money(r.value),r.status])) : '<p>No SKUs exceed this tolerance.</p>')
  };
}

function spendAnalysis(data, form) {
  const cleaned = spend(data.spend);
  const category = form.get('category');
  const selected = cleaned.rows.filter(row => category === 'all' || row.category === category);
  const result = spend(selected);
  const suppliers = Object.entries(result.suppliers).sort((a,b) => b[1] - a[1]);
  const categories = [...new Set(cleaned.rows.map(row => row.category))];
  return {
    payload: {selectedCategory:category, ...result, cleaning:{duplicates:cleaned.duplicates, rejected:cleaned.rejected}},
    html: metrics([[money(result.total),'Qualified spend'],[percent(result.concentration / 100),'Largest supplier share'],[money(result.opportunity),'Repricing opportunity']]) +
      `<p class="note">Dropped ${cleaned.duplicates} duplicate and ${cleaned.rejected.length} invalid invoice across the source file. ${result.rows.length} valid invoices match this filter.</p>` +
      '<h3>Category spend across all invoices</h3>' + table(['Category','Spend'],categories.map(name =>
        [name,money(sum(cleaned.rows.filter(r=>r.category===name).map(r=>r.amount)))])) +
      '<h3>Supplier concentration</h3>' + table(['Supplier','Spend','Share'],suppliers.map(([name,value])=>[name,money(value),percent(value/result.total)])) +
      '<h3>Comparable unit prices</h3>' + table(['Item / unit','Lowest','Highest','Repricing opportunity'],result.items.sort((a,b)=>b.opportunity-a.opportunity).map(r=>[r.item,money(r.low),money(r.high),money(r.opportunity)])) +
      '<details><summary>Inspect the selected cleaned invoices</summary>' + table(['Invoice','Supplier','Category','Amount'],result.rows.map(r=>[r.invoice,r.supplier,r.category,money(r.amount)])) + '</details>'
  };
}

function releaseQA(_data, form) {
  const version = form.get('build');
  const energy = Number(form.get('energy'));
  const selected = energy < 1 ? booking(0, form.get('slot'), version) : booking(energy, form.get('slot'), version);
  const results = qa(version);
  const passed = results.filter(row=>row.passed).length;
  const displayValue = value => typeof value === 'boolean' ? (value ? 'Accepted' : 'Rejected') : money(value);
  return {
    payload:{selected,results},
    html:`<div class="phone"><strong>Charging booking</strong><p>${escape(selected.message)}${selected.ok ? ' · ' + money(selected.price) : ''}</p></div>` +
      metrics([[passed + '/' + results.length,'Regression checks passed'],[results.length-passed,'Open failures'],[passed===results.length?'Advance to QA':'Hold','Release decision']]) +
      table(['Test','Requirement','Scenario','Expected','Observed','Result'],results.map(r=>
        [r.id,r.requirement,r.scenario,displayValue(r.expected),displayValue(r.actual),r.passed?'Pass':'Fail'])) +
      '<h3>Requirements</h3><p>R1 restricts energy to 1–80 kWh. R2 rejects full slots. R3 quotes AED 25 plus AED 2 per kWh at the entered precision. R4 confirms a valid request.</p>' +
      '<h3>Reproduce the seeded defects</h3>' + table(['Defect','Severity','Steps in defective build','Expected','Observed'],[
        ['D-01 / T3','High','Enter 20 kWh, select Full, run the check','Reject full slot','Confirms booking'],
        ['D-02 / T4','Medium','Enter 20.5 kWh, select Available, run the check','Quote AED 66','Quotes AED 65']
      ])
  };
}

function marketCase(_data, form) {
  const assumptions = Object.fromEntries([...form].map(([key,value])=>[key,Number(value)]));
  const result = evEconomics(assumptions);
  const feasibility = result.breakEven === null ? 'A positive session contribution is required.' :
    result.breakEven > result.capacity ? 'Break-even exceeds modeled capacity.' :
    result.completed < result.breakEven ? 'Modeled demand falls below break-even.' : 'Modeled volume reaches contribution break-even.';
  return {
    payload:result,
    html:metrics([[money(result.contribution),'Contribution / session'],[result.breakEven ?? 'Unavailable','Monthly sessions to break even'],[money(result.monthly),'Monthly contribution after fixed costs']]) +
      `<p class="note">${feasibility} ${result.completed} sessions can be completed at the selected demand, with ${result.unmet} above capacity.</p>` +
      table(['Variable cost / session','Theoretical monthly capacity','Operating days','Fixed cost / month'],
        [[money(result.variableCost),result.capacity,26,money(12000)]]) +
      '<h3>Delivery cost sensitivity</h3>' + table(['Delivery cost','Contribution per session','Break-even sessions'],[20,30,50].map(delivery=>{
        const scenario = evEconomics({...assumptions,delivery});
        return [money(delivery),money(scenario.contribution),scenario.breakEven ?? 'Unavailable'];
      }))
  };
}

function fragranceCase(_data, form) {
  const assumptions = Object.fromEntries([...form].map(([key,value])=>[key,Number(value)]));
  const result = fragranceEconomics(assumptions);
  return {
    payload:result,
    html:metrics([[money(result.contribution),'Expected contribution per acquired kit customer'],[result.breakEven===null?'Unavailable':percent(result.breakEven),'Break-even bottle conversion'],[money(result.bottleMargin),'Contribution per converted bottle']]) +
      `<p class="note">The kit contributes ${money(result.kitMargin)} before acquisition. ${result.breakEven > 1 ? 'A conversion rate above 100% is infeasible.' : 'The model applies AED 30 of kit credit to each converted bottle.'}</p>` +
      '<h3>Conversion and acquisition sensitivity</h3>' + table(['Kit-to-bottle conversion','CAC AED 25','CAC AED 45','CAC AED 70'],
        [5,15,25].map(conversion=>[conversion + '%',...[25,45,70].map(cac=>money(fragranceEconomics({...assumptions,conversion,cac}).contribution))]))
  };
}

function startupCase(data, form) {
  const search = Number(form.get('search'));
  const community = Number(form.get('community'));
  if (search + community > 100) throw new Error('Search and community shares must total at most 100%.');
  const shares = {Search:search,Community:community,Social:100-search-community};
  const channels = startup(data.channels.map(row=>({...row,share:shares[row.channel]})), Number(form.get('budget')));
  const effects = data.experiments.map(row=>({...row,...experimentEffect(row)}));
  const points = value => (value * 100).toFixed(1) + ' pp';
  return {
    payload:{channels,cohorts:data.cohorts,effects},
    html:metrics([[sum(channels.map(r=>r.activated)),'Modeled activations'],[sum(channels.map(r=>r.retained)),'Modeled week-four retained users'],[shares.Social + '%','Budget remaining for Social']]) +
      table(['Channel','Spend','Visits','Sign-ups','Activated','Week 4','Activation CAC'],channels.map(r=>
        [r.channel,money(r.spend),r.visits,r.signups,r.activated,r.retained,r.cac===null?'Unavailable':money(r.cac)])) +
      '<h3>Observed cohorts in the synthetic fixture</h3>' + table(['Cohort','Activated','Week 1','Week 2','Week 4'],data.cohorts.map(r=>
        [r.week,r.activated,percent(r.w1/r.activated),percent(r.w2/r.activated),percent(r.w4/r.activated)])) +
      '<h3>Experiment results</h3>' + table(['Experiment','Hypothesis','Control','Treatment','Lift','Approx. 95% interval'],effects.map(r=>
        [r.id,r.hypothesis,`${r.control}/${r.control_n}`,`${r.treatment}/${r.treatment_n}`,points(r.lift),points(r.lower)+' to '+points(r.upper)])) +
      '<p class="note">Use the effect ranges to plan follow-up tests. Neither experiment establishes a conclusive lift under this interval method.</p>'
  };
}

const configurations = {
  1:[inventory,number('tolerance','Unit tolerance',1,0,20) + select('scope','Show',[['exceptions','Flagged discrepancies'],['all','All SKUs']])],
  11:[spendAnalysis,select('category','Category',[['all','All categories'],['Electrical','Electrical'],['Finishes','Finishes'],['Hardware','Hardware']])],
  12:[releaseQA,select('build','Build',[['buggy','Defective baseline'],['fixed','Corrected candidate']]) + number('energy','Energy (kWh)',20.5,0,100,0.1) + select('slot','Slot',[['open','Available'],['full','Full']])],
  13:[marketCase,number('price','Price (AED)',109,0,500) + number('delivery','Delivery cost (AED)',30,0,150) + number('pods','Pods',6,1,30) + number('turns','Daily turns per pod',2,0.5,6,0.5) + number('demand','Monthly session demand',260,0,5000)],
  14:[fragranceCase,number('kitPrice','Kit price (AED)',60,0,200) + number('bottlePrice','Bottle price (AED)',420,172,900) + number('conversion','Bottle conversion (%)',15,0,100,0.1) + number('cac','Kit acquisition cost (AED)',45,0,150)],
  15:[startupCase,number('budget','Budget (AED)',6000,0,100000) + number('search','Search share (%)',45,0,100) + number('community','Community share (%)',25,0,100)]
};

async function start() {
  const response = await fetch('data.json');
  if (!response.ok) throw new Error('The project dataset could not be loaded.');
  const data = await response.json();
  const [render, controls] = configurations[id];
  main.innerHTML = `<section class="hero"><div><p class="eyebrow">Study ${String(id).padStart(2,'0')} / ${study.category}</p>
    <h1>${study.title}</h1><p>${study.question}</p></div></section>
    <section class="workbench"><h2>${id===12?'Booking and regression checks':'Explore the results'}</h2>
      <form><div class="controls">${controls}</div><button type="submit">Run scenario</button>
      <button type="button" id="export">Export results ↓</button></form>
      <div id="results" aria-live="polite"></div>
    </section>
    <section class="case-grid"><div><h2>Method</h2><p>${study.method}</p><h3>Next decision</h3><p>${study.next}</p></div>
    <div><h2>Limitations</h2><p>${study.limit}</p><p><a href="README.md">Reproduce the study</a> · <a href="data.json" download>Download inputs</a>${id===13||id===14?' · <a href="case-study.html">Read the research and pilot plan</a>':''}</p></div></section>`;
  const form = main.querySelector('form');
  const results = main.querySelector('#results');
  const exportButton = main.querySelector('#export');
  let saved;
  function run() {
    saved = null;
    exportButton.disabled = true;
    try {
      const inputs = new FormData(form);
      const result = render(data, inputs);
      results.innerHTML = result.html;
      saved = {study:id, inputs:Object.fromEntries(inputs), results:result.payload};
      exportButton.disabled = false;
    } catch (error) {
      results.textContent = error.message;
    }
  }
  form.addEventListener('submit', event=>{event.preventDefault();run();});
  exportButton.addEventListener('click',()=>{
    const url = URL.createObjectURL(new Blob([JSON.stringify(saved,null,2)],{type:'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = `study-${id}-results.json`;
    link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  run();
}

start().catch(error=>{main.textContent = error.message;});
