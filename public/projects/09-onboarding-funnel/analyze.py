"""Run the onboarding SQL against synthetic fixtures. No third-party packages."""
import json,sqlite3
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def analyze(events):
 db=sqlite3.connect(':memory:');db.row_factory=sqlite3.Row
 db.execute('CREATE TABLE events(user TEXT,channel TEXT,stage TEXT,hour INTEGER)')
 db.executemany('INSERT INTO events VALUES (:user,:channel,:stage,:hour)',events)
 rows=[dict(row) for row in db.execute((ROOT/'analysis.sql').read_text())]
 db.close();return rows
if __name__=='__main__':
 events=json.loads((ROOT/'data/events.json').read_text())
 result=analyze(events)
 (ROOT/'sql-results.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
 print(json.dumps(result,indent=2))
