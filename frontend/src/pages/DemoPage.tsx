import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Database, 
  Palette, 
  Download,
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code,
  Layers,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Demo mock data for "TaskFlow" - A project management app
const demoData = {
  productOverview: {
    name: "TaskFlow",
    tagline: "Streamlined project management for modern teams",
    problem: "Teams struggle with scattered tasks across emails, spreadsheets, and chat tools. Critical work gets lost, deadlines slip, and collaboration becomes chaotic.",
    targetUsers: [
      { role: "Team Leads", need: "Track team progress and assign work efficiently" },
      { role: "Developers", need: "Manage tasks and track time spent on features" },
      { role: "Project Managers", need: "Get visibility into project health and blockers" },
    ],
    features: [
      { name: "Task Boards", description: "Kanban-style boards with drag-and-drop" },
      { name: "Sprint Planning", description: "Plan and track sprint cycles" },
      { name: "Time Tracking", description: "Log hours and generate reports" },
      { name: "Team Chat", description: "Contextual discussions on tasks" },
    ],
  },
  schema: `model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  role      Role     @default(MEMBER)
  tasks     Task[]   @relation("assignee")
  created   Task[]   @relation("creator")
  projects  ProjectMember[]
  createdAt DateTime @default(now())
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(ACTIVE)
  members     ProjectMember[]
  tasks       Task[]
  sprints     Sprint[]
  createdAt   DateTime @default(now())
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority @default(MEDIUM)
  assignee    User?    @relation("assignee", fields: [assigneeId], references: [id])
  assigneeId  String?
  creator     User     @relation("creator", fields: [creatorId], references: [id])
  creatorId   String
  project     Project  @relation(fields: [projectId], references: [id])
  projectId   String
  sprint      Sprint?  @relation(fields: [sprintId], references: [id])
  sprintId    String?
  dueDate     DateTime?
  createdAt   DateTime @default(now())
}

model Sprint {
  id        String   @id @default(cuid())
  name      String
  startDate DateTime
  endDate   DateTime
  project   Project  @relation(fields: [projectId], references: [id])
  projectId String
  tasks     Task[]
}`,
  validators: `import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

export const taskSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assigneeId: z.string().cuid().optional(),
  projectId: z.string().cuid(),
  dueDate: z.date().optional(),
});

export const projectSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "ARCHIVED", "COMPLETED"]),
});`,
  sampleTasks: [
    { id: 1, title: "Set up authentication", status: "DONE", priority: "HIGH", assignee: "Alex Chen" },
    { id: 2, title: "Design dashboard UI", status: "IN_PROGRESS", priority: "HIGH", assignee: "Sarah Kim" },
    { id: 3, title: "Implement API endpoints", status: "IN_REVIEW", priority: "MEDIUM", assignee: "Mike Johnson" },
    { id: 4, title: "Write unit tests", status: "TODO", priority: "MEDIUM", assignee: null },
    { id: 5, title: "Deploy to staging", status: "TODO", priority: "LOW", assignee: null },
  ],
  exportFiles: [
    { name: "package.json", type: "config" },
    { name: "prisma/schema.prisma", type: "database" },
    { name: "lib/validators.ts", type: "validation" },
    { name: "components/tasks/TaskBoard.tsx", type: "component" },
    { name: "components/tasks/TaskCard.tsx", type: "component" },
    { name: "docs/instructions/main.md", type: "docs" },
    { name: "docs/prompts/kickoff.md", type: "prompt" },
  ],
};

const steps = [
  {
    id: "intro",
    title: "Welcome to SpecZero",
    icon: Sparkles,
    description: "Transform your app idea into production-ready code",
  },
  {
    id: "plan",
    title: "1. Plan Your Product",
    icon: FileText,
    description: "Define your vision, target users, and key features",
  },
  {
    id: "data",
    title: "2. Architect Your Data",
    icon: Database,
    description: "Design your database schema and validators",
  },
  {
    id: "designs",
    title: "3. Design Your UI",
    icon: Palette,
    description: "Build and preview components with live data",
  },
  {
    id: "export",
    title: "4. Export & Build",
    icon: Download,
    description: "Generate a complete project for any AI agent",
  },
];

// Step content components
function IntroStep() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">The Missing Design Process</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Between your app idea and your codebase, there's a gap. SpecZero bridges that gap 
          by helping you architect your entire application before writing a single line of production code.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">Visual Prototyping</h3>
            <p className="text-sm text-muted-foreground">
              See your UI components running live as you design them
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <Database className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2">Full-Stack Architecture</h3>
            <p className="text-sm text-muted-foreground">
              Design your database, auth, and business logic alongside UI
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">AI-Ready Export</h3>
            <p className="text-sm text-muted-foreground">
              Export a package any AI coding agent can execute
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center mt-8">
        <Badge variant="outline" className="text-sm px-4 py-2">
          Let's build <span className="font-bold text-primary ml-1">TaskFlow</span> - A project management app
        </Badge>
      </div>
    </div>
  );
}

function PlanStep() {
  const { productOverview } = demoData;
  
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{productOverview.name}</h2>
          <p className="text-muted-foreground">{productOverview.tagline}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{productOverview.problem}</p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Target Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productOverview.targetUsers.map((user, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{user.role}</p>
                  <p className="text-sm text-muted-foreground">{user.need}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productOverview.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
        <Code className="w-5 h-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Generated from <code className="bg-background px-2 py-0.5 rounded text-primary">product/product-overview.md</code>
        </p>
      </div>
    </div>
  );
}

function DataStep() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
          <Database className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Data Architecture</h2>
          <p className="text-muted-foreground">Prisma schema and Zod validators auto-generated</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline">Prisma</Badge>
              Database Schema
            </CardTitle>
            <CardDescription>Defines your database models and relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
              <code className="text-foreground">{demoData.schema}</code>
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline">Zod</Badge>
              Validators
            </CardTitle>
            <CardDescription>Type-safe runtime validation for your data</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
              <code className="text-foreground">{demoData.validators}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
      
      {/* ERD Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Entity Relationship Diagram</CardTitle>
          <CardDescription>Visual representation of your data model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-center">
            <div className="flex items-center gap-8">
              {/* User Entity */}
              <div className="bg-background border-2 border-blue-500/50 rounded-lg p-4 w-40">
                <div className="font-bold text-blue-500 border-b pb-2 mb-2">User</div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div>id: String (PK)</div>
                  <div>email: String</div>
                  <div>name: String</div>
                  <div>role: Role</div>
                </div>
              </div>
              
              {/* Arrow */}
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
              
              {/* Task Entity */}
              <div className="bg-background border-2 border-green-500/50 rounded-lg p-4 w-40">
                <div className="font-bold text-green-500 border-b pb-2 mb-2">Task</div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div>id: String (PK)</div>
                  <div>title: String</div>
                  <div>status: Status</div>
                  <div>assigneeId: FK</div>
                </div>
              </div>
              
              {/* Arrow */}
              <ArrowRight className="w-6 h-6 text-muted-foreground" />
              
              {/* Project Entity */}
              <div className="bg-background border-2 border-purple-500/50 rounded-lg p-4 w-40">
                <div className="font-bold text-purple-500 border-b pb-2 mb-2">Project</div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div>id: String (PK)</div>
                  <div>name: String</div>
                  <div>status: Status</div>
                  <div>description: String?</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DesignsStep() {
  const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    IN_REVIEW: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
    DONE: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  };
  
  const priorityColors: Record<string, string> = {
    LOW: "border-gray-300",
    MEDIUM: "border-yellow-400",
    HIGH: "border-orange-500",
    URGENT: "border-red-500",
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
          <Palette className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Live Component Preview</h2>
          <p className="text-muted-foreground">Your UI components rendered with sample data</p>
        </div>
      </div>
      
      {/* Mock Task Board Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">TaskBoard Component</CardTitle>
              <CardDescription>Kanban-style task management board</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Desktop</Badge>
              <Badge variant="secondary" className="text-xs">Live Preview</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-6 border-2 border-dashed">
            {/* Mock App Shell */}
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              {/* Mock Header */}
              <div className="border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold">TaskFlow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                </div>
              </div>
              
              {/* Mock Kanban Board */}
              <div className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  {["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].map((status) => (
                    <div key={status} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded",
                          statusColors[status]
                        )}>
                          {status.replace("_", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {demoData.sampleTasks.filter(t => t.status === status).length}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {demoData.sampleTasks
                          .filter(t => t.status === status)
                          .map((task) => (
                            <div 
                              key={task.id}
                              className={cn(
                                "bg-background border-l-4 rounded-lg p-3 shadow-sm",
                                priorityColors[task.priority]
                              )}
                            >
                              <p className="text-sm font-medium">{task.title}</p>
                              {task.assignee && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {task.assignee}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sample Data</CardTitle>
            <CardDescription>Mock data used for previews</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto max-h-[200px] overflow-y-auto">
              <code>{JSON.stringify(demoData.sampleTasks, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Component Props</CardTitle>
            <CardDescription>Type-safe interfaces for your components</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto max-h-[200px] overflow-y-auto">
              <code>{`interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, status: Status) => void;
  onTaskClick: (task: Task) => void;
  onCreateTask: () => void;
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ExportStep() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
          <Download className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Export Your Project</h2>
          <p className="text-muted-foreground">Get a production-ready package for any AI agent</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Contents</CardTitle>
            <CardDescription>Everything you need to build your app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demoData.exportFiles.map((file, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "w-8 h-8 rounded flex items-center justify-center",
                    file.type === "config" && "bg-gray-100 dark:bg-gray-800",
                    file.type === "database" && "bg-green-100 dark:bg-green-900/30",
                    file.type === "validation" && "bg-blue-100 dark:bg-blue-900/30",
                    file.type === "component" && "bg-purple-100 dark:bg-purple-900/30",
                    file.type === "docs" && "bg-yellow-100 dark:bg-yellow-900/30",
                    file.type === "prompt" && "bg-orange-100 dark:bg-orange-900/30",
                  )}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <code className="text-sm">{file.name}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Stack</CardTitle>
            <CardDescription>Production-ready technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Next.js 15", desc: "App Router + React 18" },
                { name: "TypeScript", desc: "Full type safety" },
                { name: "Prisma", desc: "Database ORM" },
                { name: "Clerk", desc: "Authentication" },
                { name: "Tailwind CSS", desc: "Utility-first styling" },
                { name: "shadcn/ui", desc: "UI components" },
              ].map((tech, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="font-medium">{tech.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">— {tech.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Ready to Export?</h3>
              <p className="text-muted-foreground">
                Generate a complete Next.js project with AI agent instructions
              </p>
            </div>
            <Button size="lg" className="gap-2">
              <Download className="w-4 h-4" />
              Download ZIP
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          The export includes <code className="bg-background px-2 py-0.5 rounded">.cursorrules</code> and 
          <code className="bg-background px-2 py-0.5 rounded ml-1">docs/prompts/kickoff.md</code> files
          that guide any AI coding agent to complete your application.
        </p>
        <Badge variant="outline">
          Compatible with Cursor, Windsurf, Claude Code, GitHub Copilot
        </Badge>
      </div>
    </div>
  );
}

const stepComponents: Record<string, React.FC> = {
  intro: IntroStep,
  plan: PlanStep,
  data: DataStep,
  designs: DesignsStep,
  export: ExportStep,
};

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const CurrentStepComponent = stepComponents[steps[currentStep].id];
  
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "flex flex-col items-center gap-2 group transition-all",
                  isActive && "scale-105",
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  isActive && "bg-primary text-primary-foreground shadow-lg",
                  isCompleted && "bg-green-500 text-white",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground group-hover:bg-muted/80"
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium hidden sm:block",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title.split(". ").pop()}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Progress bar */}
        <div className="mt-6 max-w-4xl mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mt-8 pt-8 border-t">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        {currentStep === steps.length - 1 ? (
          <Button asChild className="gap-2">
            <Link to="/">
              <Play className="w-4 h-4" />
              Try it yourself
            </Link>
          </Button>
        ) : (
          <Button onClick={goNext} className="gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
