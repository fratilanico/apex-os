export interface AuthUser {
  email: string;
  name?: string;
  authMethod: 'cli'; // Enforce CLI OAuth
}

export interface AuthenticatedTerminalProps {
  onAuthenticated: (user: AuthUser) => void;
  onClose: () => void;
}

export const DEMO_CREDENTIALS = {
  username: 'vibefounder',
  password: 'apex2024',
  email: 'demo@vibeacademy.com'
};
