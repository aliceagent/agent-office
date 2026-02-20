#!/usr/bin/env python3
"""
Sync agent status from Mission Control (Notion) to agent-status.json
"""

import json
import os
import requests
from datetime import datetime

NOTION_TOKEN = os.environ.get('NOTION_TOKEN')
MISSION_CONTROL_DB = '2fe419064d3081bc8155ee2719c1d365'

AGENT_NAMES = ['alice', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta']

def get_mission_control_tasks():
    """Fetch all In Progress tasks from Mission Control"""
    if not NOTION_TOKEN:
        print("Warning: No NOTION_TOKEN, using fallback")
        return []
    
    url = f"https://api.notion.com/v1/databases/{MISSION_CONTROL_DB}/query"
    headers = {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }
    
    payload = {
        "filter": {
            "property": "Status",
            "select": {
                "equals": "In Progress"
            }
        }
    }
    
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        tasks = []
        for page in data.get('results', []):
            props = page.get('properties', {})
            
            task_id_prop = props.get('Task ID', {})
            if task_id_prop.get('type') == 'title':
                title_arr = task_id_prop.get('title', [])
                task_id = title_arr[0]['plain_text'] if title_arr else None
            else:
                task_id = None
            
            assigned_prop = props.get('Assignee', {})
            if assigned_prop.get('type') == 'select':
                select = assigned_prop.get('select')
                assigned_raw = select.get('name', '') if select else None
                # Normalize: "Worker-Zeta" -> "zeta"
                if assigned_raw and 'Worker-' in assigned_raw:
                    assigned = assigned_raw.replace('Worker-', '').lower()
                elif assigned_raw:
                    assigned = assigned_raw.lower()
                else:
                    assigned = None
            else:
                assigned = None
            
            name_prop = props.get('Name', {})
            if name_prop.get('type') == 'rich_text':
                text_arr = name_prop.get('rich_text', [])
                name = text_arr[0]['plain_text'] if text_arr else task_id
            else:
                name = task_id
            
            if task_id and assigned:
                tasks.append({
                    'task_id': task_id,
                    'assigned': assigned,
                    'name': name or task_id
                })
        
        return tasks
    except Exception as e:
        print(f"Error fetching from Notion: {e}")
        return []


def build_agent_status(tasks):
    """Build agent status JSON from tasks"""
    agents = {}
    
    for agent in AGENT_NAMES:
        agents[agent] = {'status': 'sleeping', 'task': None}
    
    agents['alice'] = {'status': 'working', 'task': 'Chatting with J'}
    
    for task in tasks:
        agent = task['assigned'].lower()
        if agent in agents:
            task_display = f"{task['task_id']}: {task['name']}" if task['name'] != task['task_id'] else task['task_id']
            agents[agent] = {'status': 'working', 'task': task_display}
    
    return {
        'success': True,
        'agents': agents,
        'taskCount': len(tasks),
        'timestamp': int(datetime.now().timestamp() * 1000),
        'updatedAt': datetime.now().isoformat()
    }


def main():
    print("Fetching tasks from Mission Control...")
    tasks = get_mission_control_tasks()
    print(f"Found {len(tasks)} in-progress tasks")
    
    status = build_agent_status(tasks)
    
    with open('agent-status.json', 'w') as f:
        json.dump(status, f, indent=2)
    
    working = [a for a, s in status['agents'].items() if s['status'] == 'working']
    print(f"Working agents: {', '.join(working)}")


if __name__ == '__main__':
    main()
