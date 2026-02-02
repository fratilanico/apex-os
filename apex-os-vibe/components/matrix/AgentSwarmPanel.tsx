import React from 'react';
import type { AgentSwarmState } from '../types';

interface AgentSwarmPanelProps {
  swarm: AgentSwarmState;
}

export const AgentSwarmPanel: React.FC<AgentSwarmPanelProps> = ({ swarm }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'busy': return '🟡';
      case 'offline': return '⚪';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🤖</span>
            Agent Swarm
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {swarm.summary.total} agents • {swarm.summary.online} online • {swarm.summary.busy} busy
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded">
            {swarm.summary.online} Online
          </span>
          <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded">
            {swarm.summary.busy} Busy
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {swarm.agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                <div>
                  <h3 className="font-medium text-sm">{agent.name}</h3>
                  <p className="text-xs text-gray-400">@{agent.id}</p>
                </div>
              </div>
              <span className="text-lg" title={agent.status}>
                {getStatusIcon(agent.status)}
              </span>
            </div>

            {agent.currentTask && (
              <div className="mt-3 text-xs text-yellow-400">
                🔄 {agent.currentTask}
              </div>
            )}

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
              <span>✓ {agent.tasksCompleted} completed</span>
              {agent.tasksFailed > 0 && (
                <span className="text-red-400">✗ {agent.tasksFailed} failed</span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {agent.capabilities.slice(0, 3).map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs rounded"
                >
                  {cap}
                </span>
              ))}
              {agent.capabilities.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs rounded">
                  +{agent.capabilities.length - 3}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
