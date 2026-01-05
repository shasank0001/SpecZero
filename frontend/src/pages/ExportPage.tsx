import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Package, FolderTree, FileCode, CheckCircle2, AlertCircle, Rocket, Sparkles, Zap, FileText, Database, Palette } from "lucide-react";

const exportItems = [
  { icon: FileText, name: "docs/prompts/", type: "folder" },
  { icon: Database, name: "prisma/", type: "folder" },
  { icon: Palette, name: "components/", type: "folder" },
  { icon: FileCode, name: "package.json", type: "file" },
  { icon: FileText, name: "README.md", type: "file" },
];

const validationItems = [
  { name: "Product Overview", status: "missing" },
  { name: "Database Schema", status: "missing" },
  { name: "Components", status: "missing" },
];

export default function ExportPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Export</h1>
            <p className="text-sm text-muted-foreground">
              Generate your production-ready project scaffold
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Export Preview Card */}
        <Card className="opacity-0 animate-fade-up stagger-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FolderTree className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Export Preview</CardTitle>
                <CardDescription>
                  Files included in your export
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.name}
                    className="group flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-default opacity-0 animate-fade-up"
                    style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground uppercase tracking-wider">
                      {item.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Export Status Card */}
        <Card className="opacity-0 animate-fade-up stagger-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <CardTitle>Export Status</CardTitle>
                <CardDescription>
                  Validation status for your project
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Validation Items */}
            <div className="space-y-2">
              {validationItems.map((item, index) => (
                <div 
                  key={item.name}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/30 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    {item.status === "complete" ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        <span className="text-xs font-medium text-success">Complete</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5 text-warning" />
                        <span className="text-xs font-medium text-warning">Missing</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-semibold">0 / 3</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: '0%' }}
                />
              </div>
            </div>

            {/* Export Button */}
            <Button 
              className="w-full h-11" 
              size="lg"
              disabled
            >
              <Package className="mr-2 h-4 w-4" />
              Export Project
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Complete all items above to enable export
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What's Included Section */}
      <Card className="opacity-0 animate-fade-up stagger-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Rocket className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>What's Included</CardTitle>
              <CardDescription>
                Your export package contains everything needed to start building
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Next.js 15", desc: "App Router ready" },
              { title: "Prisma Schema", desc: "Database ready" },
              { title: "Zod Validators", desc: "Type-safe APIs" },
              { title: "AI Prompts", desc: "Agent handoff" },
            ].map((item, index) => (
              <div 
                key={item.title}
                className="p-3 rounded-lg bg-muted/50 border border-border text-center opacity-0 animate-scale-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <h4 className="font-semibold text-sm mb-0.5">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="opacity-0 animate-fade-up stagger-4 border-dashed">
        <CardContent className="py-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold mb-1">Ready to Ship?</h3>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              Complete your product definition, design your screens, and export a production-ready scaffold
            </p>
            <code className="rounded-lg bg-muted border border-border px-3 py-1.5 text-sm font-mono">
              /export-project
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
