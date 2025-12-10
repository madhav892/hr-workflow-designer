# HR Workflow Designer

A fully functional HR Workflow Designer web application for creating, configuring, and testing internal HR workflows such as employee onboarding, leave approval processes, and document verification pipelines.

![HR Workflow Designer](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![React Flow](https://img.shields.io/badge/React%20Flow-12.x-green)

## 🚀 Project Overview

This application allows HR administrators to visually design workflows using a drag-and-drop interface powered by React Flow. Users can create complex HR processes by connecting different node types and test their workflows through a built-in simulation feature.

### Key Features

- ✅ **Visual Workflow Canvas** - Drag-and-drop interface with pan, zoom, and minimap
- ✅ **5 Custom Node Types** - Start, Task, Approval, Automated, and End nodes
- ✅ **Dynamic Configuration Forms** - Type-specific forms with validation
- ✅ **Real-time Validation** - Connection validation and workflow structure checks
- ✅ **Mock API Integration** - Simulated backend for automation actions
- ✅ **Workflow Simulation** - Test workflows with step-by-step execution logs
- ✅ **Modern UI** - Tailwind CSS styling with color-coded nodes

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 with TypeScript |
| Build Tool | Vite |
| Workflow Canvas | React Flow (@xyflow/react) |
| State Management | Zustand |
| Form Handling | React Hook Form |
| Validation | Zod |
| Styling | Tailwind CSS |
| Icons | Lucide React |

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-workflow-designer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 🎯 Usage Guide

### Creating a Workflow

1. **Add Nodes** - Drag nodes from the left palette onto the canvas
2. **Connect Nodes** - Click and drag from a node's output handle (right side) to another node's input handle (left side)
3. **Configure Nodes** - Click a node to open its configuration panel on the right
4. **Test Workflow** - Click "Run Simulation" in the bottom-right panel

### Node Types

| Node | Color | Description |
|------|-------|-------------|
| **Start** | 🟢 Green | Entry point - only one allowed, no incoming connections |
| **Task** | 🔵 Blue | Human task with assignee and due date |
| **Approval** | 🟠 Orange | Requires approval from specified role |
| **Automated** | 🟣 Purple | System action with dynamic parameters |
| **End** | 🔴 Red | Workflow completion - no outgoing connections |

### Connection Rules

- Start nodes cannot have incoming connections
- End nodes cannot have outgoing connections
- No self-connections or duplicate connections
- All nodes must be connected for simulation to pass

## 📁 Project Structure

```
src/
├── components/
│   ├── canvas/           # Workflow canvas components
│   │   ├── NodePalette.tsx    # Draggable node sidebar
│   │   └── WorkflowCanvas.tsx # Main React Flow canvas
│   ├── forms/            # Node configuration forms
│   │   ├── StartNodeForm.tsx
│   │   ├── TaskNodeForm.tsx
│   │   ├── ApprovalNodeForm.tsx
│   │   ├── AutomatedNodeForm.tsx
│   │   ├── EndNodeForm.tsx
│   │   └── NodeFormPanel.tsx  # Form container/router
│   ├── nodes/            # Custom React Flow nodes
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedNode.tsx
│   │   └── EndNode.tsx
│   └── simulation/       # Testing components
│       └── SimulationPanel.tsx
├── services/             # API and business logic
│   ├── api.ts            # Mock API endpoints
│   └── validation.ts     # Workflow validation
├── store/                # State management
│   └── workflowStore.ts  # Zustand store
├── types/                # TypeScript definitions
│   ├── workflow.ts       # Node and workflow types
│   └── api.ts            # API types
├── App.tsx               # Main application
└── main.tsx              # Entry point
```

## 🏗️ Architecture Decisions

### State Management: Zustand
Chosen for its simplicity and minimal boilerplate. The store manages:
- Workflow nodes and edges
- Selected node state
- Simulation results and loading states

### Form Handling: React Hook Form + Zod
- React Hook Form for performant form management with controlled components
- Zod for schema-based validation with type inference
- Real-time validation with debounced updates to the store

### Mock API Design
Local mock functions that return Promises with simulated delays:
- `GET /api/automations` - Returns available automation actions
- `POST /api/simulate` - Validates and simulates workflow execution

### React Flow Integration
- Custom node components with typed data props
- Store synchronization via useEffect hooks
- Connection validation with isValidConnection callback

## ✅ Implementation Details

### Workflow Validation
The validation service checks:
1. **Structural** - Start node exists (unique), End node exists
2. **Connection** - All nodes connected, no orphaned nodes
3. **Data** - Required fields filled (title, assignee, etc.)
4. **Rules** - No incoming to Start, no outgoing from End

### Cycle Detection
Uses DFS-based algorithm to detect cycles in the workflow graph (shown as warnings).

### Simulation Logic
1. Client-side validation runs first
2. BFS traversal from Start node to determine execution order
3. Each node generates a simulation step with timestamp and details
4. Results displayed in expandable log format

## 🧪 Testing Approach

### Manual Tests Performed
- ✅ Drag and drop all 5 node types
- ✅ Connect nodes with edges
- ✅ Delete nodes and edges
- ✅ Form validation for all node types
- ✅ Dynamic parameter loading for automated nodes
- ✅ Workflow simulation with valid workflows
- ✅ Error handling for invalid workflows

### Edge Cases Considered
- Empty workflow simulation
- Single node workflows
- Disconnected node detection
- Duplicate connection prevention
- Form field validation boundaries

## 📋 What Was Completed

- ✅ All 5 required node types (Start, Task, Approval, Automated, End)
- ✅ Drag-and-drop from palette to canvas
- ✅ Node connection with validation
- ✅ Dynamic configuration forms with validation
- ✅ Mock API for automation actions
- ✅ Workflow simulation with execution log
- ✅ Pre-simulation validation
- ✅ TypeScript types throughout
- ✅ Zustand state management
- ✅ Tailwind CSS styling

## 🚧 Known Issues

1. **React Flow State Sync** - Occasional delay between store updates and canvas rendering due to dual state management
2. **Form Re-renders** - Node forms re-render on each keystroke due to watched values
3. **Large Workflows** - Performance may degrade with 50+ nodes (not tested)

## 🔮 Future Enhancements

With more time, I would add:

- **Undo/Redo** - Command pattern for action history
- **Workflow Templates** - Pre-built workflow starters
- **Export/Import** - Save workflows as JSON files
- **Node Copy/Paste** - Keyboard shortcuts for node duplication
- **Dark Mode** - Theme toggle support
- **Unit Tests** - Jest + React Testing Library coverage
- **E2E Tests** - Playwright for full workflow testing
- **Backend Integration** - Real API endpoints with persistence

## 📝 Assumptions Made

1. **Single User** - No concurrent editing or collaboration features
2. **Browser Support** - Modern browsers (Chrome, Firefox, Safari, Edge)
3. **Workflow Size** - Designed for workflows with up to ~30 nodes
4. **No Persistence** - Workflows are not saved between sessions
5. **Sequential Execution** - Simulation assumes linear execution order

## 🤔 Challenges Faced

1. **React Flow v12 Types** - The new version has different type signatures; resolved by using simpler prop interfaces
2. **State Synchronization** - Keeping Zustand and React Flow states in sync required careful useEffect usage
3. **Zod Schema Updates** - Zod v4 has different API for some features; adapted schemas accordingly
4. **Form Value Updates** - Ensuring form changes propagate to nodes required debounced updates

## 📄 License

MIT License - Feel free to use this project as a reference or starting point.

---

Built with ❤️ using React, TypeScript, and React Flow
