/// <reference types="vite/client" />

declare var process: {
    cwd(): string;
    env: Record<string, string | undefined>;
};

declare var __dirname: string;
