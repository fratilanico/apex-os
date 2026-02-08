#!/usr/bin/env node
/**
 * Agent Orchestrator Script
 * Node.js script to orchestrate DevOps Agent Swarm tasks
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const AGENTS_DIR = path.join(__dirname, '..', '..', 'devops-agents');
const PROJECT_ROOT = path.join(__dirname, '..', '..');

const AGENTS = [
  { name: 'orchestrator', port: 3001 },
  { name: 'infrastructure-architect', port: 3002 },
  { name: 'security-monitor', port: 3003 },
  { name: 'compliance-guardian', port: 3004 },
  { name: 'deployment-automation', port: 3005 },
  { name: 'incident-response', port: 3006 },
  { name: 'cost-optimizer', port: 3007 },
];

class AgentOrchestrator {
  constructor() {
    this.processes = new Map();
    this.logs = [];
  }

  log(level, message, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };
    this.logs.push(entry);
    console.log(`[${level.toUpperCase()}] ${message}`, meta);
  }

  async startAgent(agentName) {
    const agent = AGENTS.find(a => a.name === agentName);
    if (!agent) {
      throw new Error(`Unknown agent: ${agentName}`);
    }

    const agentPath = path.join(AGENTS_DIR, agent.name, 'src', 'index.ts');
    
    if (!fs.existsSync(agentPath)) {
      throw new Error(`Agent not found: ${agentPath}`);
    }

    this.log('info', `Starting agent: ${agentName}`);

    const proc = spawn('npx', ['tsx', agentPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_ENV: 'production',
        AGENT_PORT: agent.port,
      },
    });

    proc.stdout.on('data', (data) => {
      this.log('info', `[${agentName}] ${data.toString().trim()}`);
    });

    proc.stderr.on('data', (data) => {
      this.log('error', `[${agentName}] ${data.toString().trim()}`);
    });

    proc.on('close', (code) => {
      this.log('warn', `Agent ${agentName} exited with code ${code}`);
      this.processes.delete(agentName);
    });

    this.processes.set(agentName, proc);
    
    // Wait for agent to start
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    this.log('info', `Agent ${agentName} started on port ${agent.port}`);
    return proc;
  }

  async startAll() {
    this.log('info', 'Starting all agents...');
    
    // Start orchestrator first
    await this.startAgent('orchestrator');
    
    // Start other agents in parallel
    const otherAgents = AGENTS.filter(a => a.name !== 'orchestrator');
    await Promise.all(otherAgents.map(agent => this.startAgent(agent.name)));
    
    this.log('info', 'All agents started successfully');
  }

  async stopAgent(agentName) {
    const proc = this.processes.get(agentName);
    if (proc) {
      this.log('info', `Stopping agent: ${agentName}`);
      proc.kill('SIGTERM');
      this.processes.delete(agentName);
    }
  }

  async stopAll() {
    this.log('info', 'Stopping all agents...');
    
    for (const [name, proc] of this.processes) {
      this.log('info', `Stopping agent: ${name}`);
      proc.kill('SIGTERM');
    }
    
    this.processes.clear();
    this.log('info', 'All agents stopped');
  }

  getStatus() {
    return {
      running: Array.from(this.processes.keys()),
      total: AGENTS.length,
      logs: this.logs.slice(-50), // Last 50 logs
    };
  }

  async runTask(agentName, taskType, payload = {}) {
    this.log('info', `Running task: ${taskType} on ${agentName}`, { payload });
    
    // This would integrate with the actual agent via MCP
    // For now, we log the intent
    return {
      success: true,
      agent: agentName,
      task: taskType,
      payload,
      timestamp: new Date().toISOString(),
    };
  }

  async runWorkflow(workflow) {
    this.log('info', 'Running workflow', { steps: workflow.length });
    
    const results = [];
    
    for (const step of workflow) {
      this.log('info', `Executing step ${step.step}: ${step.task}`);
      
      try {
        const result = await this.runTask(step.agent, step.task, step.payload);
        results.push({ step: step.step, status: 'completed', result });
      } catch (error) {
        results.push({ 
          step: step.step, 
          status: 'failed', 
          error: error.message 
        });
        
        if (!step.continueOnError) {
          break;
        }
      }
    }
    
    return results;
  }
}

// CLI Interface
async function main() {
  const orchestrator = new AgentOrchestrator();
  const command = process.argv[2];

  switch (command) {
    case 'start':
      const agentName = process.argv[3];
      if (agentName) {
        await orchestrator.startAgent(agentName);
      } else {
        await orchestrator.startAll();
      }
      break;

    case 'stop':
      const stopName = process.argv[3];
      if (stopName) {
        await orchestrator.stopAgent(stopName);
      } else {
        await orchestrator.stopAll();
      }
      process.exit(0);
      break;

    case 'status':
      console.log(JSON.stringify(orchestrator.getStatus(), null, 2));
      break;

    case 'task':
      const [taskAgent, taskType, ...taskArgs] = process.argv.slice(3);
      if (!taskAgent || !taskType) {
        console.error('Usage: task <agent> <task-type> [payload]');
        process.exit(1);
      }
      const payload = taskArgs.length > 0 ? JSON.parse(taskArgs.join(' ')) : {};
      const result = await orchestrator.runTask(taskAgent, taskType, payload);
      console.log(JSON.stringify(result, null, 2));
      break;

    case 'workflow':
      const workflowFile = process.argv[3];
      if (!workflowFile) {
        console.error('Usage: workflow <workflow-file.json>');
        process.exit(1);
      }
      const workflow = JSON.parse(fs.readFileSync(workflowFile, 'utf8'));
      const workflowResults = await orchestrator.runWorkflow(workflow);
      console.log(JSON.stringify(workflowResults, null, 2));
      break;

    default:
      console.log(`
Agent Orchestrator CLI

Usage:
  node agent-orchestrator.js <command> [options]

Commands:
  start [agent]     Start all agents or specific agent
  stop [agent]      Stop all agents or specific agent
  status            Show agent status
  task <agent> <type> [payload]  Run a task
  workflow <file>  Run workflow from JSON file

Examples:
  node agent-orchestrator.js start
  node agent-orchestrator.js start security-monitor
  node agent-orchestrator.js task security-monitor scan_vulnerabilities '{"path": "."}'
  node agent-orchestrator.js workflow deploy-workflow.json
      `);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down...');
  process.exit(0);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { AgentOrchestrator };
