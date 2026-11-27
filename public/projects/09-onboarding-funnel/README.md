# 9. Fintech Onboarding Funnel Analysis

A runnable independent portfolio project. All records, costs and business situations are synthetic. No employer code, data, policies or proprietary rules are used.

## Launch in Windows PowerShell
Requires Python 3 and a modern browser. No dependency installation.

```powershell
Set-Location -LiteralPath 'C:\Users\abhi\Documents\ChatGPT\Job Search\projects\09-onboarding-funnel'
python -m http.server 8109 --bind 127.0.0.1
```

Open http://127.0.0.1:8109/ . Keep the terminal running; Ctrl+C stops the server. Do not open index.html directly because module/data loading requires HTTP. If the port is busy, use another port in both command and URL.

## Use
Open the demo, adjust its labelled controls, inspect the recommendation and tables, and choose **Export this run** to save the actual inputs and results as JSON. All processing happens locally. Reload resets the controls. Read the on-screen methodology, limitations and data dictionary before interpreting outputs.

## Source map
- index.html: standalone entry point
- demo.js: accessible controls, tables and JSON export
- models.js: pure, inspectable calculation functions
- project-content.js: problem, approach, decision and limits
- data/events.json: deterministic source fixture
- styles.css: responsive interface; system fonts, no external dependencies

## Run the SQL analysis
```powershell
python analyze.py
```
The Python standard-library sqlite3 engine executes analysis.sql in memory and writes sql-results.json. The browser computes the same fixture by channel; the verification suite compares every count and mean with the SQL output. Duplicate stages use the earliest timestamp. Ordered progression is required. Each synthetic user has one channel; multi-touch attribution is out of scope.

## Reproducibility and verification
Fixtures were generated with Python random seed 20261115. The parent source folder ../.. /portfolio-lab contains generate_data.py, build_projects.py and tests. Run `node --test tests/models.test.mjs` in that source folder for mathematical invariants and SQL cross-checks, plus `python -m unittest discover -s tests -p "test_*.py"` for policy and SQL edge cases. Node is needed only for tests, not to launch the demo. See ../../projects/VERIFICATION.md for measured baseline results and UI checks.

## Interpretation
These are demonstrated calculations, not real client outcomes or deployed operational systems. Monetary results are AED. No third-party code libraries were added. Existing files elsewhere in the workspace were preserved; this project is not published.
