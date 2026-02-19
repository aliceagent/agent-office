# Office Notion Proxy Worker

Cloudflare Worker that proxies requests to the Notion Mission Control database.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the Notion API key as a secret:
   ```bash
   wrangler secret put NOTION_API_KEY
   ```

3. Deploy to Cloudflare:
   ```bash
   npm run deploy
   ```

## Endpoints

- `GET /api/tasks` - Fetch all tasks from Mission Control database
- `GET /health` - Health check endpoint

## Response Format

```json
{
  "success": true,
  "tasks": [
    {
      "id": "notion-page-id",
      "taskId": "OFFICE-1-1",
      "assignee": "Worker-Alpha",
      "status": "In Progress",
      "priority": "High",
      "created": "2024-01-01T00:00:00Z",
      "url": "https://notion.so/...",
      "description": "Task description"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-01T00:00:00Z"
}
```