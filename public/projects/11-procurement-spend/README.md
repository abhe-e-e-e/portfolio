# Procurement Spend Analytics

Run `python serve_portfolio.py` from the Job Search folder and open
`http://127.0.0.1:8110/projects/11-procurement-spend/`. Python 3 and a browser are sufficient.

Change the inputs and select **Run scenario**. **Export results** saves the
parameters and calculation output as JSON. Start from `data.json` to inspect the
fixtures, assumptions, or source ledger. The page explains the method and scope.
The research memos for studies 13 and 14 include dated evidence, decision rules
and the proposed pilot or launch design.

Rebuild the packaged studies with `python portfolio-lab/build_extended.py` from
Job Search. Synthetic data comes from `portfolio-lab/generate_data.py`.
The calculation functions are in `models.js` and `extended-models.js`.
