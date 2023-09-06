import os
import json
from datetime import datetime
import subprocess

def update_docs_map(docs_dir, docs_map_file):
    docs_map = []
    for root, dirs, files in os.walk(docs_dir):
        if not files:
            continue
        main = os.path.relpath(root, docs_dir)
        sub = []
        for file in files:
            if not file.endswith('.mdx'):
                continue
            name = os.path.splitext(file)[0]
            path = os.path.join(root, file)
            date = subprocess.check_output(['git', 'log', '--diff-filter=A', '--format=%aI', '-1', '--', path]).decode().strip()
            updated_at = datetime.fromisoformat(subprocess.check_output(['git', 'log', '--diff-filter=M', '--format=%aI', '-1', '--', path]).decode().strip())
            sub.append({
                'name': name,
                'date': datetime.fromisoformat(date).strftime('%Y-%m-%d %H:%M:%S'),
                'updated-at': datetime.fromisoformat(updated_at).strftime('%Y-%m-%d %H:%M:%S')
            })
        if not sub:
            continue
        docs_map.append({
            'main': main,
            'sub': sub
        })
    with open(docs_map_file, 'w') as f:
        json.dump(docs_map, f, indent=4)

update_docs_map('blogs/docs', 'blogs/docs-map.json')
