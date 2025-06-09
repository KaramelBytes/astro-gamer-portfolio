# Content Management Guide

This guide explains how to manage the content for your gaming portfolio website.

## Content Structure

The website's content is organized into the following directories:

- `src/content/` - Contains all content collections
  - `about/` - About page content
  - `games/` - Game collections
    - `favorite-games/` - Your favorite video games
    - `currently-playing/` - Games you're currently playing
    - `tabletop-games/` - Your favorite tabletop games
    - `currently-playing-tabletop/` - Tabletop games you're currently playing
- `src/data/` - Site-wide data and configuration
  - `site.ts` - Global site configuration (edit this to customize your site)
  - `games.ts` - Game data utilities

## Adding or Editing Games

1. **Video Games**
   - Add new games to the appropriate collection in `src/content/games/`
   - Each game should be a JSON file with the following structure:
     ```json
     {
       "title": "Game Title",
       "platform": "Platform Name",
       "description": "Game description",
       "imageUrl": "URL to game cover image",
       "rating": 8.5,
       "playtime": 25,
       "completed": true,
       "completedDate": "2023-01-15",
       "review": "Personal thoughts about the game"
     }
     ```

2. **Tabletop Games**
   - Similar to video games but stored in the tabletop collections
   - Use the same structure as video games

## Updating the About Page

Edit the markdown file at `src/content/about/index.md` to update the about page content. The frontmatter at the top controls the hero section:

```yaml
---
name: "Your Gamertag"
tagline: "Your Tagline"
description: |
  Your bio goes here...
---
```

## Site Configuration

Global site settings can be modified in `src/data/site.ts`:

```typescript
export const SITE = {
  title: 'YourGamertag',
  description: 'Gaming, Streaming, And More',
  url: 'https://your-site.com',
  // ... other settings
};
```

## Adding New Content Types

1. Create a new directory in `src/content/` for your content type
2. Add a schema in `src/content/config.ts`
3. Create components to display the content
4. Add routes as needed

## Best Practices

- Keep game images optimized (recommended max width: 800px)
- Use descriptive filenames for game assets
- Keep descriptions concise but informative
- Regularly backup your content

## Local Development

To see your changes locally:

1. Run the development server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:4321` in your browser

## Deployment

Content changes will be automatically deployed when pushed to the main branch. The site is built using Astro's static site generation.
