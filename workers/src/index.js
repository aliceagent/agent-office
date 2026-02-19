export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Route: GET /api/tasks - Fetch tasks from Notion Mission Control
    if (url.pathname === '/api/tasks' && request.method === 'GET') {
      try {
        const notionResponse = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.NOTION_API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify({
            sorts: [
              {
                property: 'Created',
                direction: 'descending'
              }
            ],
            page_size: 100
          })
        });

        if (!notionResponse.ok) {
          throw new Error(`Notion API error: ${notionResponse.status}`);
        }

        const notionData = await notionResponse.json();
        
        // Transform Notion data to simplified format
        const tasks = notionData.results.map(page => {
          const properties = page.properties;
          
          return {
            id: page.id,
            taskId: properties.Name?.title?.[0]?.plain_text || '',
            assignee: properties.Assignee?.select?.name || '',
            status: properties.Status?.select?.name || 'Not Started',
            priority: properties.Priority?.select?.name || '',
            created: properties.Created?.created_time || '',
            url: page.url,
            description: properties.Description?.rich_text?.[0]?.plain_text || ''
          };
        }).filter(task => task.taskId); // Only include tasks with IDs

        return new Response(JSON.stringify({
          success: true,
          tasks: tasks,
          count: tasks.length,
          timestamp: new Date().toISOString()
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });

      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        worker: 'office-notion-proxy',
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Default 404 response
    return new Response(JSON.stringify({
      error: 'Not Found',
      availableEndpoints: ['/api/tasks', '/health']
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};