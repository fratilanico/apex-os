import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runBusinessHealthChecks() {
  console.log("📈 Initializing Business Health Monitoring...");
  
  try {
    // 1. Check Security Compliance (SOC2)
    console.log("🔒 Checking SOC2 Compliance Status...");
    const complianceResult = await callAgent('compliance-guardian', 'audit_compliance', {
      standard: 'SOC2',
      scope: 'all'
    });
    console.log("Compliance Result:", complianceResult);

    // 2. Check Security Vulnerabilities
    console.log("🛡️  Scanning for Vulnerabilities...");
    const securityResult = await callAgent('security-monitor', 'scan_vulnerabilities', {
      path: '.',
      scanType: 'dependencies'
    });
    console.log("Security Result:", securityResult);

    // 3. Check Cost Anomaly
    console.log("💰 Analyzing Infrastructure Costs...");
    const costResult = await callAgent('cost-optimizer', 'detect_anomalies', {
      threshold: 15
    });
    console.log("Cost Analysis:", costResult);

    // 4. Generate Business Alert if needed
    if (JSON.parse(complianceResult).score < 90 || JSON.parse(securityResult).summary.high > 0) {
      console.log("🚨 CRITICAL BUSINESS ALERT: Security or Compliance threshold breached!");
      await callAgent('incident-response', 'create_incident', {
        severity: 'p1',
        title: 'Business Compliance Risk Detected',
        service: 'vibe-academy',
        description: 'Automated monitoring detected security vulnerabilities or compliance gaps.'
      });
    } else {
      console.log("✅ Business health looks optimal.");
    }

  } catch (error) {
    console.error("❌ Monitoring Failed:", error);
  }
}

async function callAgent(agentName: string, toolName: string, args: any) {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['tsx', `/Users/nico/devops-agents/${agentName}/src/index.ts`]
  });

  const client = new Client({
    name: 'monitor-client',
    version: '1.0.0'
  });

  await client.connect(transport);
  const result = await client.callTool({
    name: toolName,
    arguments: args
  });
  
  await client.close();
  return result.content[0].text;
}

runBusinessHealthChecks().catch(console.error);
