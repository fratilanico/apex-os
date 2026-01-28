import React, { useState, useEffect } from 'react';
import { TerminalWindow, TerminalLine, TerminalPrompt } from '../../ui/Terminal';
import { useTerminal } from '../../../hooks/useTerminal';

export const TerminalContact: React.FC = () => {
  const { lines, isTyping, processSequence, addLine } = useTerminal();
  const [step, setStep] = useState<'boot' | 'identity' | 'vision' | 'mission' | 'success'>('boot');

  useEffect(() => {
    const bootSequence = [
      { text: '> VIBE_VENTURE_PROTOCOL v1.0', type: 'system', delay: 500 },
      { text: '> LOADING NEURAL_INTERFACE... DONE', type: 'success', delay: 300 },
      { text: '> ESTABLISHING ENCRYPTED_CHANNEL... DONE', type: 'success', delay: 300 },
      { text: '> SYSTEM READY.', type: 'success', delay: 400 },
      { text: '', type: 'output', delay: 200 },
      { text: 'WELCOME, FOUNDER.', type: 'header', delay: 600 },
      { text: '', type: 'output', delay: 300 },
    ];
    processSequence(bootSequence as any).then(() => setStep('identity'));
  }, []); // Only once on mount

  const handleCommand = async (cmd: string) => {
    addLine({ text: cmd, type: 'input', showPrompt: true } as any);

    if (step === 'identity') {
      // Email validation
      if (!cmd.includes('@') || !cmd.includes('.')) {
        await processSequence([
          { text: 'ERROR: INVALID_FOUNDER_ID. MUST BE VALID EMAIL.', type: 'error', delay: 100 },
        ] as any);
        return;
      }
      await processSequence([
        { text: '> identity_locked.', type: 'success', delay: 200 },
        { text: '', type: 'output', delay: 200 },
        { text: '> define_vision (what_are_we_building?):', type: 'header', delay: 400 },
        { text: '', type: 'output', delay: 100 },
      ] as any);
      setStep('vision');
    } else if (step === 'vision') {
      if (cmd.trim().length < 10) {
        await processSequence([
          { text: 'ERROR: VISION_TOO_VAGUE. ELABORATE.', type: 'error', delay: 100 },
        ] as any);
        return;
      }
      await processSequence([
        { text: '> vision_locked.', type: 'success', delay: 200 },
        { text: '> analyzing_feasibility... [OK]', type: 'system', delay: 500 },
        { text: '', type: 'output', delay: 200 },
        { text: '> transmit_mission_brief:', type: 'header', delay: 400 },
        { text: '  (describe your timeline, budget, tech requirements)', type: 'output', delay: 100 },
        { text: '', type: 'output', delay: 100 },
      ] as any);
      setStep('mission');
    } else if (step === 'mission') {
      if (cmd.trim().length < 20) {
        await processSequence([
          { text: 'ERROR: INSUFFICIENT_DETAIL. PROVIDE MORE CONTEXT.', type: 'error', delay: 100 },
        ] as any);
        return;
      }
      setStep('success');
      await processSequence([
        { text: '', type: 'output', delay: 200 },
        { text: '> TRANSMISSION RECEIVED.', type: 'success', delay: 300 },
        { text: '> ENCRYPTING...', type: 'system', delay: 500 },
        { text: '> ROUTING THROUGH OBFUSCATION_LAYER...', type: 'system', delay: 400 },
        { text: '> DISPATCHING ARCHITECT TO INBOX...', type: 'system', delay: 600 },
        { text: '', type: 'output', delay: 300 },
        { text: '✓ TRANSMISSION COMPLETE.', type: 'success', delay: 800 },
        { text: '', type: 'output', delay: 200 },
        { text: 'EXPECT RESPONSE WITHIN 24 CYCLES.', type: 'header', delay: 400 },
      ] as any);
      
      // TODO: Integrate with backend email service API
      // console.log('Form submitted:', formData);
    }
  };

  const getPromptText = () => {
    switch (step) {
      case 'identity':
        return '> enter_founder_id (email):';
      case 'vision':
        return '> define_vision:';
      case 'mission':
        return '> transmit_mission_brief:';
      default:
        return '';
    }
  };

  return (
    <TerminalWindow title="contact_uplink.sh" className="max-w-2xl mx-auto shadow-2xl shadow-cyan-500/10">
      <div className="flex flex-col gap-1">
        {lines.map((line, i) => (
          <TerminalLine key={i} {...line} />
        ))}
        
        {/* Show prompt text before input */}
        {step !== 'boot' && step !== 'success' && !isTyping && (
          <div className="mt-3">
            <div className="text-cyan-400/80 text-sm mb-2">{getPromptText()}</div>
            <TerminalPrompt 
              onCommand={handleCommand} 
              prefix="founder"
            />
          </div>
        )}
      </div>
    </TerminalWindow>
  );
};
