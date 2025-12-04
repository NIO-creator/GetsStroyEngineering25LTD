import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Note: loadEnv is not strictly necessary unless you need to access *all* env variables globally,
    // but we can leave it if you need it elsewhere.
    // const env = loadEnv(mode, '.', ''); 
    
    return {
      // CRITICAL FIX FOR GITHUB PAGES: The base path must match the repository name.
      base: "/GetsStroyEngineering25LTD/",
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      
      // REMOVED custom 'define' block to prevent conflicts with 
      // VITE_GEMINI_API_KEY injection during GitHub Actions build.
      
      resolve: {
        alias: {
          // Assuming the path alias is correctly set up for your project structure
          '@': path.resolve(__dirname, '.'), 
        }
      }
    };
});
