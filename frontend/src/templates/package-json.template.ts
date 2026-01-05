import type { TemplateConfig } from './types';

export function generatePackageJson(config: TemplateConfig): string {
  const packageJson = {
    name: config.projectName.toLowerCase().replace(/\s+/g, '-'),
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
      "db:generate": "prisma generate",
      "db:push": "prisma db push",
      "db:migrate": "prisma migrate dev",
      "db:seed": "npx tsx prisma/seed.ts",
      "db:studio": "prisma studio"
    },
    dependencies: {
      "next": "15.0.0",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "@clerk/nextjs": "^5.0.0",
      "@prisma/client": "^5.20.0",
      "zod": "^3.23.8",
      "clsx": "^2.1.1",
      "tailwind-merge": "^2.5.2",
      "lucide-react": "^0.447.0",
      "@radix-ui/react-slot": "^1.1.0",
      "class-variance-authority": "^0.7.0"
    },
    devDependencies: {
      "@types/node": "^22.0.0",
      "@types/react": "^18.3.11",
      "@types/react-dom": "^18.3.0",
      "typescript": "^5.6.0",
      "tailwindcss": "^4.0.0",
      "@tailwindcss/postcss": "^4.0.0",
      "prisma": "^5.20.0",
      "tsx": "^4.19.0"
    }
  };

  return JSON.stringify(packageJson, null, 2);
}
