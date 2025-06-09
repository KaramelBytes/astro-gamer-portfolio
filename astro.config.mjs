/**
 * Astro configuration file
 * Configures the build process, site metadata, and integrations
 * 
 * Environment variables are loaded from .env file if present
 * @see https://docs.astro.build/en/reference/configuration-reference/
 */

// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Load environment variables from .env file
// This allows for local development with environment-specific settings
// Note: In production, these should be set in the deployment environment
import dotenv from "dotenv";
dotenv.config();

/**
 * Main Astro configuration
 * @type {import('astro').AstroUserConfig}
 */
export default defineConfig({
  // Base URL for the site, used for sitemap generation and canonical URLs
  site: 'https://your-site.com',
  
  // Integrations extend Astro's functionality
  // - @astrojs/react: Enables React component support
  // - @astrojs/sitemap: Generates sitemap.xml for better SEO
  integrations: [
    react(),
    sitemap()
  ],
  
  // Additional configuration options can be added here
  // For example: build options, markdown settings, etc.
});
