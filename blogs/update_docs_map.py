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
            date_str = subprocess.check_output(['git', 'log', '--diff-filter=A', '--format=%aI', '-1', '--', path]).decode().strip()
            updated_at_str = subprocess.check_output(['git', 'log', '--diff-filter=M', '--format=%aI', '-1', '--', path]).decode().strip()
            date = datetime.fromisoformat(date_str).strftime('%Y-%m-%d %H:%M:%S') if date_str else 'N/A'
            updated_at = datetime.fromisoformat(updated_at_str).strftime('%Y-%m-%d %H:%M:%S') if updated_at_str else 'N/A'
            sub.append({
                'name': name,
                'date': date,
                'updated-at': updated_at
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
