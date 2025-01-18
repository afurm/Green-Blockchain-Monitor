interface Config {
    openaiApiKey: string;
    appUrl: string;
}

const config: Config = {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

// Validate required environment variables
const requiredEnvVars = ['OPENAI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
}

export default config; 