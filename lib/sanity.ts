/// <reference path="../global.d.ts" />
/// <reference path="../vite-env.d.ts" />
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

// Helper to determine if we have a valid config to attempt real fetches
export const hasSanityConfig = () => {
  return !!import.meta.env.VITE_SANITY_PROJECT_ID;
};
