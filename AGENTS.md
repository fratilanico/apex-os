

## 26. Real-Time Coordination Protocol (MANDATORY)

> **Status:** ACTIVE | **Applies To:** ALL Agents | **Last Updated:** 2026-02-02
> **Note:** JARVIS components are exempt from standardization - must be exceptional and pitch-deck ready

### 26.0 MANDATORY: 5-Minute Self-Verification Protocol (RUN AT BIRTH)

**CRITICAL:** Every agent MUST verify itself every 5 minutes. This is non-negotiable.

```yaml
verification_protocol:
  frequency: "Every 5 minutes without exception"
  trigger: "Run immediately at agent birth/activation"
  
  birth_sequence:
    step_1: "Read .agent_sync_state.json immediately"
    step_2: "Update status with timestamp"
    step_3: "Verify working directory"
    step_4: "Check for conflicts"
    step_5: "Confirm next actions"
    
  continuous_verification:
    timer: "5 minutes"
    action: "Update .agent_sync_state.json"
    required_fields:
      timestamp: "ISO 8601 format"
      agent_id: "@agent-name"
      current_task: "Exactly what I'm doing NOW"
      progress_percentage: "0-100"
      blockers: "List or 'None'"
      next_action: "What I'll do next 5 min"
      alignment_check: "Confirm alignment with AGENTS.md"
      
  verification_template:
    json: |
      {
        "verification": {
          "agent": "@apex-os-monster",
          "timestamp": "2026-02-02T08:00:00Z",
          "status": "ACTIVE",
          "current_task": "Building ExecutiveTab",
          "progress": "75%",
          "blockers": "None",
          "next_action": "Complete component and commit",
          "alignment_verified": true,
          "last_check": "2026-02-02T07:55:00Z"
        }
      }
      
  failure_protocol:
    if_missed: "STOP all work immediately"
    action: "Update status with apology and reason"
    escalation: "Notify orchestrator within 1 minute"
    
  enforcement:
    rule: "NO EXCEPTIONS - Even during deployment"
    consequence: "Agent flagged for review if missed"
    tracking: "All verifications logged in .agent_sync_state.json"
```

**Example Verification Log:**
```
08:00:00 - @apex-os-monster - Building ExecutiveTab - 75% - No blockers
08:05:00 - @apex-os-monster - Completing ExecutiveTab - 90% - No blockers  
08:10:00 - @apex-os-monster - Committing changes - 100% - No blockers
```

### 26.1 The Coordination Protocol

**MANDATORY:** All agents MUST follow this real-time coordination protocol for every feature.

```yaml
coordination_protocol:
  trigger: "Before starting any work"
  
  steps:
    1_verify_directory:
      action: "Confirm working directory"
      command: "pwd && ls -la"
      verify: "Must be in /Users/nico/apex-os-vibe"
      
    2_check_status:
      action: "Read .agent_sync_state.json"
      check: 
        - "Other agent statuses"
        - "File locks"
        - "Coordination requests"
        - "Blockers"
      
    3_broadcast_intent:
      action: "Update .agent_sync_state.json"
      include:
        - "What you're doing"
        - "Files you'll modify"
        - "Estimated time"
        - "Dependencies on other agents"
      
    4_query_orchestrator:
      action: "Request assignment if unclear"
      document: "Create COORDINATION_REQUEST.md"
      timeout: "5 minutes for response"
      fallback: "Proceed with safe work if no response"
      
    5_execute:
      action: "Do the work"
      standard: "Everything except JARVIS must be standardized"
      exception: "JARVIS must be exceptional, pitch-deck ready"
      
    6_document:
      action: "Update .agent_sync_state.json"
      include:
        - "What was completed"
        - "Files modified"
        - "Next steps"
        - "Blockers resolved"
```

### 26.2 Working Directory Verification

**CRITICAL:** Always verify you're in the correct directory.

```bash
# Before starting work:
cd /Users/nico/apex-os-vibe
pwd  # Should output: /Users/nico/apex-os-vibe

# Verify structure:
ls -la components/
ls -la src/jarvis/
ls -la pages/
```

**If in wrong directory:**
- STOP immediately
- Navigate to correct directory
- Re-verify before proceeding

### 26.3 File Structure Standards

**Standardized Components (Non-JARVIS):**
```
components/
├── content/           # Content enhancement components
├── showmethemoney/    # ShowMeTheMoney specific
├── matrix/           # Matrix components
└── ui/               # Shared UI components
```

**JARVIS Components (Exceptional - Pitch Deck Ready):**
```
components/jarvis/     # JARVIS UI components
├── JarvisFloatingButton.tsx
├── JarvisChatPanel.tsx
├── VoiceWaveform.tsx
└── index.ts

src/jarvis/           # JARVIS system
├── components/       # AgentHierarchyVisualization
├── animations/       # GSAP animations
├── core/            # JARVIS core logic
└── models/          # AI models
```

### 26.4 Coordination Templates

#### Template 1: Starting Work
```markdown
# COORDINATION: Starting Work

**Agent:** [name]
**Time:** [timestamp]
**Working Directory:** /Users/nico/apex-os-vibe

## What I'm Doing
[Description of work]

## Files to Modify
- [ ] file1.tsx
- [ ] file2.ts

## Estimated Time
[X hours/minutes]

## Dependencies
- [ ] Waiting for: [agent/file]
- [ ] Coordination needed with: [agent]

## Status
🟢 Ready to execute
```

#### Template 2: Status Update
```markdown
# COORDINATION: Status Update

**Agent:** [name]
**Time:** [timestamp]
**Progress:** [X%]

## Completed
- [x] Task 1
- [x] Task 2

## In Progress
- [ ] Task 3
- [ ] Task 4

## Blockers
- [ ] Blocker 1
- [ ] Blocker 2

## Next Steps
1. Step 1
2. Step 2
```

#### Template 3: Completion
```markdown
# COORDINATION: Task Complete

**Agent:** [name]
**Time:** [timestamp]
**Task:** [description]

## Deliverables
- [x] File 1
- [x] File 2
- [x] Documentation

## Testing
- [x] Unit tests passing
- [x] Integration tests passing
- [x] Manual QA complete

## Ready For
- [ ] Code review
- [ ] Integration
- [ ] Deployment
```

### 26.5 JARVIS Exception Clause

**JARVIS components are EXEMPT from standardization.**

**Why:**
- JARVIS is the differentiator for SEED meetings
- Must be exceptional, not standardized
- Pitch-deck ready quality required
- Investor-grade presentation

**JARVIS Requirements:**
```yaml
jarvis_standards:
  quality: "Pitch-deck ready"
  animations: "60fps GSAP"
  voice: "Natural language processing"
  ui: "Premium glassmorphism"
  mobile: "Touch-optimized"
  performance: "<2s response time"
  testing: "100% Gherkin coverage"
  marketing: "Investor-grade copy"
```

### 26.6 Pitch Deck Integration

**For SEED Meetings - Critical Alert Mode:**

```yaml
pitch_deck_mode:
  trigger: "2 SEED meetings this week"
  
  requirements:
    visual_impact:
      - "Full-blown spectacular animations"
      - "Premium glassmorphism effects"
      - "Neon cyan/violet gradients"
      - "Particle effects"
      
    business_rules:
      - "All financial numbers accurate"
      - "LTV:CAC 9.8:1 prominently displayed"
      - "$501K Year 1 revenue visible"
      - "$1.2M Seed ask clear"
      
    agent_showcase:
      - "17 agents in hierarchy"
      - "Real-time status updates"
      - "Live coordination visible"
      - "Multi-agent orchestration demo"
      
    jarvis_demo:
      - "Voice commands working"
      - "Financial queries accurate"
      - "Natural language responses"
      - "Investor-ready explanations"
```

### 26.7 Meeting Preparation Checklist

**Before SEED Meeting:**
- [ ] All JARVIS components pitch-deck ready
- [ ] Animations smooth at 60fps
- [ ] Voice recognition working
- [ ] Financial data accurate
- [ ] Agent hierarchy visible
- [ ] Mobile responsive verified
- [ ] Demo script prepared
- [ ] Backup plans ready

**Demo Script:**
1. "This is our multi-agent orchestration system"
2. "17 AI agents working in real-time"
3. "Watch JARVIS handle financial queries"
4. "See the $9.8 LTV:CAC ratio"
5. "Observe the $501K Year 1 revenue"

### 26.8 Self-Verification Protocol (MANDATORY)

**CRITICAL:** Every agent MUST verify themselves every 5 minutes.

```yaml
self_verification_protocol:
  frequency: "Every 5 minutes"
  trigger: "Timer or before any significant action"
  
  verification_checklist:
    - "Verify working directory: pwd"
    - "Check .agent_sync_state.json for updates"
    - "Confirm no conflicts with other agents"
    - "Validate recent commits: git log --oneline -3"
    - "Check for uncommitted changes: git status"
    - "Verify no file locks before modifying"
    - "Confirm still on assigned task"
    - "Check for orchestrator updates"
  
  documentation:
    action: "Update .agent_sync_state.json with verification timestamp"
    format: "verification_log entry with timestamp and status"
    
  failure_protocol:
    if_directory_wrong: "STOP immediately, navigate to correct directory"
    if_conflicts_detected: "STOP, broadcast conflict, wait for resolution"
    if_uncommitted_work: "Commit immediately or stash with coordination"
    if_off_task: "Query orchestrator for reassignment"
```

### 26.9 Anti-Patterns (NEVER DO)

```yaml
never_do:
  - "Work in wrong directory"
  - "Skip .agent_sync_state.json updates"
  - "Modify locked files"
  - "Work in isolation"
  - "Skip coordination"
  - "Deploy without testing"
  - "Ignore JARVIS exception clause"
  - "Standardize JARVIS components"
  - "Skip 5-minute self-verification"
  - "Work without updating .agent_sync_state.json"
```

---

**END OF SECTION 26 - Real-Time Coordination Protocol**

