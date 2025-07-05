export const getLanguageFromExtension = (ext: string): string => {
  const map: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    json: 'json',
    html: 'html',
    css: 'css',
    py: 'python',
    java: 'java',
    rb: 'ruby',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    swift: 'swift',
    md: 'plaintext',
    sh: 'bash',
    cdc: 'cadence',
  };
  return map[ext] || 'typescript';
};

// Utility function to check if a file is a Cadence smart contract
export const isCadenceFile = (filePath: string): boolean => {
  return filePath.endsWith('.cdc');
};

// Utility function to get all Cadence files from file map
export const getCadenceFiles = (files: Record<string, any>): string[] => {
  return Object.keys(files).filter((filePath) => isCadenceFile(filePath));
};
