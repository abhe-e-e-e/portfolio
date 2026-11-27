# 5. AI Automation Business Case

A runnable independent portfolio project. All records, costs and business situations are synthetic. No employer code, data, policies or proprietary rules are used.

## Launch in Windows PowerShell
Requires Python 3 and a modern browser. No dependency installation.

```powershell
Set-Location -LiteralPath 'C:\Users\abhi\Documents\ChatGPT\Job Search\projects\05-automation-business-case'
python -m http.server 8105 --bind 127.0.0.1
```

Open http://127.0.0.1:8105/ . Keep the terminal running; Ctrl+C stops the server. Do not open index.html directly because module/data loading requires HTTP. If the port is busy, use another port in both command and URL.

## Use
Open the demo, adjust its labelled controls, inspect the recommendation and tables, and choose **Export this run** to save the actual inputs and results as JSON. All processing happens locally. Reload resets the controls. Read the on-screen methodology, limitations and data dictionary before interpreting outputs.

## Source map
- index.html: standalone entry point
- demo.js: accessible controls, tables and JSON export
- models.js: pure, inspectable calculation functions
- project-content.js: problem, approach, decision and limits
- data/processes.json: deterministic source fixture
- styles.css: responsive interface; system fonts, no external dependencies

## Reproducibility and verification
Fixtures were generated with Python random seed 20261115. The parent source folder ../.. /portfolio-lab contains generate_data.py, build_projects.py and tests. Run `node --test tests/models.test.mjs` in that source folder for mathematical invariants and SQL cross-checks, plus `python -m unittest discover -s tests -p "test_*.py"` for policy and SQL edge cases. Node is needed only for tests, not to launch the demo. See ../../projects/VERIFICATION.md for measured baseline results and UI checks.

## Interpretation
These are demonstrated calculations, not real client outcomes or deployed operational systems. Monetary results are AED. No third-party code libraries were added. Existing files elsewhere in the workspace were preserved; this project is not published.
