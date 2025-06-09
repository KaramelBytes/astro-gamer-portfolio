import { defineCollection, z } from 'astro:content';

// Define the about collection
const about = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
  }),
});

// Define the games collection schema
const games = defineCollection({
  type: 'data',
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string(),
    
    // Optional fields
    platform: z.string().optional(),
    developer: z.string().optional(),
    publisher: z.string().optional(),
    releaseDate: z.string().optional(),
    platforms: z.array(z.string()).optional(),
    genres: z.array(z.string()).optional(),
    rating: z.number().min(0).max(10).optional(),
    playtime: z.number().min(0).optional(),
    completed: z.boolean().optional(),
    completedDate: z.string().optional(),
    review: z.string().optional(),
    currentlyPlaying: z.boolean().optional(),
    favorite: z.boolean().optional(),
    tabletop: z.boolean().optional(),
    imageUrl: z.string().url().optional(),
    image: z.string().optional(),
    createdAt: z.string().or(z.date()).optional(),
    updatedAt: z.string().or(z.date()).optional(),
  }),
});

export const collections = {
  'about': about,
  'games': games,
};
