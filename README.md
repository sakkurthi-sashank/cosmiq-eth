# Cosmiq - AI-Powered Web3 Application Builder

AI-powered platform that generates working Web3 applications from natural language prompts, running entirely in your browser with integrated Flow blockchain functionality.

![CosmIQ Demo](https://github.com/cosmiq/cosmiq/assets/placeholder-demo.gif)

## Features

### AI-Powered Development

- Natural language to code conversion
- Real-time streaming code generation
- Context-aware development
- Multi-model AI support (15+ providers)

### Web3 & Blockchain Integration

- Flow blockchain integration
- Smart contract generation and deployment
- Wallet authentication
- Real-time transaction tracking

### WebContainer Technology

- Browser-based Node.js runtime
- Live preview with hot reloading
- Terminal access
- No server required

### Development Environment

- Code editor with syntax highlighting
- File system management
- Import/export capabilities
- Design system integration

![CosmIQ Architecture](https://github.com/cosmiq/cosmiq/assets/placeholder-architecture.png)

## How It Works

### 1. Natural Language Input

Describe what you want to build in plain English.

### 2. AI Code Generation

- Analyzes requirements
- Generates application structure
- Creates smart contracts
- Sets up authentication and deployment

### 3. WebContainer Execution

- Full Node.js runtime in browser
- Package management
- Live preview with hot reloading
- Terminal access

### 4. Blockchain Integration

- Flow wallet authentication
- Smart contract deployment tracking
- Transaction management

![CosmIQ Workflow](https://github.com/cosmiq/cosmiq/assets/placeholder-workflow.png)

## Technology Stack

### Frontend Framework

- Remix - Full-stack React framework
- TypeScript - Type-safe development
- React 18 - Modern React features
- Tailwind CSS - Utility-first styling
- UnoCSS - Atomic CSS

### AI & Language Models

- Vercel AI SDK - AI integration
- Multiple Providers - OpenAI, Anthropic, Google, Cohere, Mistral, DeepSeek
- Streaming Responses - Real-time output
- Context Optimization - Smart context management

### Blockchain & Web3

- Flow Blockchain - Developer-friendly blockchain
- FCL - Flow authentication and transactions
- Cadence - Smart contract language
- Flow Testnet - Testing environment

### Development Environment

- WebContainer API - Browser-based Node.js runtime
- CodeMirror - Code editor
- Xterm.js - Terminal emulator
- Vite - Build tool

### State Management & Storage

- Nanostores - State management
- IndexedDB - Browser data persistence
- Zustand - Simple state management
- File System API - Browser file operations

## Project Structure

```
cosmiq/
├── app/                          # Remix application
│   ├── components/               # React components
│   │   ├── chat/                # AI chat interface
│   │   │   ├── BaseChat.tsx     # Main chat component
│   │   │   ├── ChatBox.tsx      # Input interface
│   │   │   ├── Messages.tsx     # Message display
│   │   │   └── Artifact.tsx     # Generated code artifacts
│   │   ├── workbench/           # Development environment
│   │   │   ├── CodeEditor.tsx   # Code editing interface
│   │   │   ├── Preview.tsx      # Live application preview
│   │   │   └── Terminal.tsx     # Terminal interface
│   │   ├── flow/                # Flow blockchain components
│   │   │   ├── AuthGuard.tsx    # Authentication wrapper
│   │   │   ├── WalletLogin.tsx  # Wallet connection
│   │   │   └── FlowAuthHeader.tsx # User status display
│   │   └── ui/                  # Reusable UI components
│   ├── routes/                  # Remix routes
│   │   ├── _index.tsx          # Landing page
│   │   ├── chat.$id.tsx        # Chat interface
│   │   ├── api.chat.ts         # AI chat API
│   │   └── webcontainer.*.tsx  # WebContainer endpoints
│   ├── lib/                    # Core libraries
│   │   ├── common/prompts/     # AI prompt engineering
│   │   ├── contexts/           # React contexts
│   │   ├── stores/             # State management
│   │   ├── webcontainer/       # WebContainer integration
│   │   └── persistence/        # Data persistence
│   ├── utils/                  # Utility functions
│   └── types/                  # TypeScript definitions
├── public/                     # Static assets
├── build/                      # Build output
├── functions/                  # Cloudflare Functions
└── contracts/                  # Smart contract examples
```

![CosmIQ File Structure](https://github.com/cosmiq/cosmiq/assets/placeholder-structure.png)

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- PNPM 9.4.0 or higher
- Modern Browser with WebContainer support

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/cosmiq/cosmiq.git
   cd cosmiq
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   # Add your AI provider API keys
   ```

4. Start development server

   ```bash
   pnpm dev
   ```

5. Open in browser
   ```
   http://localhost:5173
   ```

### Environment Variables

Create a `.env` file with your AI provider keys:

```env
# AI Provider API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
COHERE_API_KEY=your_cohere_key

# Flow Blockchain Configuration
FLOW_NETWORK=testnet
FLOW_ACCESS_NODE=https://rest-testnet.onflow.org

# Application Configuration
APP_URL=http://localhost:5173
```

## Core Features

### AI Chat Interface

- Multi-turn conversations
- Complete application generation
- Real-time streaming
- Error detection and fixing
- Code explanation

### WebContainer Integration

- Full Node.js runtime in browser
- Package installation
- File system operations
- Terminal access
- Live preview with hot reloading

### Flow Blockchain Integration

- FCL configuration for testnet
- Wallet authentication (Blocto, Lilico, Dapper)
- Smart contract generation
- Deployment automation
- Transaction tracking

### Development Workbench

- Code editor with syntax highlighting
- File explorer
- Terminal access
- Live preview
- Element inspector

## Advanced Configuration

### Flow Blockchain Setup

For blockchain development, ensure proper Flow configuration:

```typescript
// Flow configuration
export const flowConfig = {
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
  'app.detail.title': 'Your App Name',
  'fcl.limit': 1000,
};
```

### WebContainer Customization

Customize the WebContainer environment:

```typescript
// WebContainer options
const containerOptions = {
  coep: 'credentialless',
  workdirName: 'cosmiq-project',
  forwardPreviewErrors: true,
};
```

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Roadmap

- [x] AI chat interface
- [x] WebContainer integration
- [x] Flow blockchain support
- [x] Code generation and editing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Flow Blockchain](https://flow.com/) - For the amazing blockchain platform
- [WebContainer](https://webcontainer.io/) - For browser-based development environment
- [Remix](https://remix.run/) - For the excellent full-stack framework
- [Vercel AI SDK](https://sdk.vercel.ai/) - For AI integration capabilities
- Open Source Community - For the incredible tools and libraries
