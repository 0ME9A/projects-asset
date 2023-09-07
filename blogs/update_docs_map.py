import os
import json
from datetime import datetime
import subprocess

def update_docs_map(docs_dir, docs_map_file):
    with open(docs_map_file, 'r') as f:
        docs_map = json.load(f)
    docs_map_dict = {item['main']: item for item in docs_map}
    for root, dirs, files in os.walk(docs_dir):
        if not files:
            continue
        main = os.path.relpath(root, docs_dir)
        if main not in docs_map_dict:
            docs_map_dict[main] = {'main': main, 'sub': []}
        sub_dict = {item['name']: item for item in docs_map_dict[main]['sub']}
        for file in files:
            if not file.endswith('.mdx'):
                continue
            name = os.path.splitext(file)[0]
            if name not in sub_dict:
                sub_dict[name] = {'name': name}
            path = os.path.join(root, file)
            date = subprocess.check_output(['git', 'log', '--diff-filter=A', '--format=%aI', '-1', '--', path]).decode().strip()
            updated_at = subprocess.check_output(['git', 'log', '--diff-filter=M', '--format=%aI', '-1', '--', path]).decode().strip()
            sub_dict[name]['date'] = datetime.fromisoformat(date).strftime('%Y-%m-%d %H:%M:%S')
            sub_dict[name]['updated-at'] = datetime.fromisoformat(updated_at).strftime('%Y-%m-%d %H:%M:%S')
        docs_map_dict[main]['sub'] = list(sub_dict.values())
    docs_map = list(docs_map_dict.values())
    with open(docs_map_file, 'w') as f:
        json.dump(docs_map, f, indent=4)

update_docs_map('blogs/docs', 'blogs/docs-map.json')
