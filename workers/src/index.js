import { AgentEventsManager } from './agent-events.js';

// Global agent events manager (simulated persistence for demo)
let globalAgentEvents = null;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Initialize agent events manager if not exists
    if (!globalAgentEvents) {
      globalAgentEvents = new AgentEventsManager(env);
      
      // Initialize with default agent states
      await globalAgentEvents.simulateAgentEvent('alice', null, {
        state: 'working', location: 'desk-alice', task: 'OFFICE-1-1'
      });
      await globalAgentEvents.simulateAgentEvent('alpha', null, {
        state: 'working', location: 'desk-alpha', task: 'OFFICE-1-2'
      });
      await globalAgentEvents.simulateAgentEvent('beta', null, {
        state: 'sleeping', location: 'cot-1', task: null
      });
      await globalAgentEvents.simulateAgentEvent('epsilon', null, {
        state: 'sleeping', location: 'cot-2', task: null
      });
    }

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

    // WebSocket upgrade for real-time agent events
    if (url.pathname === '/ws' && request.headers.get('Upgrade') === 'websocket') {
      return await globalAgentEvents.handleWebSocket(request);
    }

    // OFF-RT-2: REST fallback polling API endpoint
    if (url.pathname === '/api/agent-status' && request.method === 'GET') {
      try {
        const agentStates = globalAgentEvents.getAgentStates();
        const recentEvents = globalAgentEvents.getRecentEvents(5);
        
        return new Response(JSON.stringify({
          success: true,
          data: {
            agents: agentStates,
            recentEvents: recentEvents,
            connectionCount: globalAgentEvents.getConnectionCount(),
            timestamp: Date.now(),
            syncEndpoint: '/ws'
          }
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message,
          timestamp: Date.now()
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Agent state update endpoint (for Mission Control integration)
    if (url.pathname === '/api/agent-update' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { agentId, state, location, task, animationState } = body;
        
        if (!agentId || !state || !location) {
          throw new Error('Missing required fields: agentId, state, location');
        }

        await globalAgentEvents.simulateAgentEvent(agentId, null, {
          state,
          location, 
          task: task || null,
          animationState: animationState || 'idle'
        });

        return new Response(JSON.stringify({
          success: true,
          message: `Agent ${agentId} updated`,
          timestamp: Date.now()
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
          timestamp: Date.now()
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Simulate agent movement (for testing)
    if (url.pathname === '/api/test-movement' && request.method === 'POST') {
      try {
        const scenarios = [
          { agentId: 'beta', fromState: { state: 'sleeping', location: 'cot-1' }, toState: { state: 'moving', location: 'desk-beta', animationState: 'walking', task: 'TEST-1' }},
          { agentId: 'gamma', fromState: { state: 'sleeping', location: 'cot-3' }, toState: { state: 'moving', location: 'desk-gamma', animationState: 'walking', task: 'TEST-2' }},
        ];
        
        const body = await request.json();
        const agentId = body.agentId || 'beta';
        
        const scenario = scenarios.find(s => s.agentId === agentId) || scenarios[0];
        
        await globalAgentEvents.simulateAgentEvent(scenario.agentId, scenario.fromState, scenario.toState);
        
        // After 3 seconds, complete the animation
        setTimeout(async () => {
          await globalAgentEvents.simulateAgentEvent(scenario.agentId, scenario.toState, {
            ...scenario.toState,
            state: 'working',
            animationState: 'idle'
          });
        }, 3000);

        return new Response(JSON.stringify({
          success: true,
          message: `Test movement started for ${scenario.agentId}`,
          scenario: scenario
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
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
            taskId: properties['Task ID']?.title?.[0]?.plain_text || '',
            assignee: properties.Assignee?.select?.name || '',
            status: properties.Status?.select?.name || 'Not Started',
            priority: properties.Priority?.select?.name || '',
            created: properties.Created?.date?.start || '',
            url: page.url,
            description: properties.Notes?.rich_text?.[0]?.plain_text || ''
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
        worker: 'office-agent-events',
        features: [
          'WebSocket real-time events (/ws)',
          'REST polling fallback (/api/agent-status)',
          'Agent state updates (/api/agent-update)',
          'Test movement simulation (/api/test-movement)'
        ],
        connectionCount: globalAgentEvents ? globalAgentEvents.getConnectionCount() : 0,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Default response with available endpoints
    return new Response(JSON.stringify({
      error: 'Not Found',
      availableEndpoints: {
        '/ws': 'WebSocket endpoint for real-time agent events',
        '/api/agent-status': 'REST polling fallback for agent states',
        '/api/agent-update': 'POST - Update agent state',
        '/api/test-movement': 'POST - Simulate agent movement for testing',
        '/api/tasks': 'GET - Fetch tasks from Notion',
        '/health': 'Health check and status'
      }
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};