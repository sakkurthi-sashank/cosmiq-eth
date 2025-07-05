import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--cosmiq-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--cosmiq-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--cosmiq-elements-terminal-textColor'),
    background: cssVar('--cosmiq-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--cosmiq-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--cosmiq-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--cosmiq-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--cosmiq-elements-terminal-color-black'),
    red: cssVar('--cosmiq-elements-terminal-color-red'),
    green: cssVar('--cosmiq-elements-terminal-color-green'),
    yellow: cssVar('--cosmiq-elements-terminal-color-yellow'),
    blue: cssVar('--cosmiq-elements-terminal-color-blue'),
    magenta: cssVar('--cosmiq-elements-terminal-color-magenta'),
    cyan: cssVar('--cosmiq-elements-terminal-color-cyan'),
    white: cssVar('--cosmiq-elements-terminal-color-white'),
    brightBlack: cssVar('--cosmiq-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--cosmiq-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--cosmiq-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--cosmiq-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--cosmiq-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--cosmiq-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--cosmiq-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--cosmiq-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}
