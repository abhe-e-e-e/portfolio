"""Local policy snapshot monitor with content hashes and an append-only audit log."""
import argparse,hashlib,json,datetime
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def canonical(sections):
 return json.dumps({k:' '.join(v.lower().split()) for k,v in sorted(sections.items())},sort_keys=True)
def digest(sections):return hashlib.sha256(canonical(sections).encode()).hexdigest()
def compare(before,after):
 changes=[]
 for key in sorted(before.keys()|after.keys()):
  old,new=before.get(key),after.get(key)
  status='Added' if key not in before else 'Removed' if key not in after else 'Unchanged' if canonical({key:old})==canonical({key:new}) else 'Changed'
  changes.append(dict(section=key,status=status,before=old,after=new))
 return changes
def run(before,after):
 diffs=compare(before,after);selected=[r for r in diffs if r['status']!='Unchanged']
 return dict(baseline_hash=digest(before),candidate_hash=digest(after),selected=len(selected),skipped=len(diffs)-len(selected),processing='review required' if selected else 'skipped',diffs=diffs)
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--before',default='v1');parser.add_argument('--after',default='v2');parser.add_argument('--output',default='runs.jsonl');args=parser.parse_args()
 snapshots=json.loads((ROOT/'data/policies.json').read_text());versions={r['version']:r['sections'] for r in snapshots}
 if args.before not in versions or args.after not in versions:parser.error('Version must be one of '+', '.join(versions))
 result=run(versions[args.before],versions[args.after]);result.update(before=args.before,after=args.after,run_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
 with (ROOT/args.output).open('a',encoding='utf-8') as log:log.write(json.dumps(result)+'\n')
 print(json.dumps(result,indent=2))
