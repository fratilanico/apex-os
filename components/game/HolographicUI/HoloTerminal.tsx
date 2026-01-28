import { HoloPanel } from './HoloPanel';
import { TerminalChat } from '../../ui/Terminal/TerminalChat';

interface HoloTerminalProps {
  position?: [number, number, number];
}

export function HoloTerminal({ position = [0, 2, 0] }: HoloTerminalProps) {
  return (
    <HoloPanel position={position} width={8} height={6}>
      <div 
        className="pointer-events-auto bg-black/80 rounded border border-tron-cyan/30" 
        style={{ width: '600px', height: '450px', padding: '1rem' }}
      >
        <TerminalChat />
      </div>
    </HoloPanel>
  );
}
