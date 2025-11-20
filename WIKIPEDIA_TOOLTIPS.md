# Wikipedia Tooltips Feature

## Overview
The Wikipedia tooltips feature automatically highlights key terms in Mike's Vietnam remembrances and provides interactive tooltips with Wikipedia summaries when users hover over them.

## How It Works

### Components

1. **WikiTooltip.jsx** - The tooltip component that:
   - Fetches Wikipedia summaries using the Wikipedia REST API
   - Displays a beautiful tooltip with thumbnail, summary, and link
   - Handles loading states and errors gracefully

2. **WikiText.jsx** - The text processing component that:
   - Parses text to identify Wikipedia-worthy terms
   - Wraps identified terms with WikiTooltip components
   - Handles overlapping matches intelligently

3. **wikiTerms.js** - The dictionary of terms that includes:
   - Weapons (AK-47, F-4 Phantom, etc.)
   - Military units (3rd Marine Division, 101st Air Cavalry, etc.)
   - Places (Vietnam, DMZ, Quang Tri, etc.)
   - Ships (USS Okinawa, USS Bon Homme Richard, etc.)
   - Events (Tet Offensive)
   - Military terms (C-rations, foxhole, LZ, etc.)

## Adding New Terms

To add new Wikipedia-worthy terms, edit `src/utils/wikiTerms.js`:

```javascript
export const wikiTerms = {
    // Add your term here
    'Term as it appears in text': 'Wikipedia article title',
    
    // Example:
    'M16': 'M16 rifle',
    'Saigon': 'Ho Chi Minh City',
};
```

**Important Notes:**
- The key should match how the term appears in the text (case-insensitive)
- The value should be the exact Wikipedia article title
- Longer terms are matched first to avoid partial matches
- Multiple variations can point to the same Wikipedia article

## Visual Styling

Highlighted terms appear with:
- Blue dotted underline
- Cursor changes to help cursor on hover
- Smooth color transition on hover

Tooltips feature:
- Thumbnail image (if available)
- Article title
- 4-line summary excerpt
- "Read more on Wikipedia" link
- Smooth fade-in/fade-out animations

## API Usage

The feature uses the Wikipedia REST API:
- Endpoint: `https://en.wikipedia.org/api/rest_v1/page/summary/{term}`
- No authentication required
- Rate limits apply (should be fine for normal usage)
- Gracefully handles missing articles

## Browser Compatibility

The feature works in all modern browsers that support:
- ES6 JavaScript
- Fetch API
- CSS Grid and Flexbox
- CSS custom properties

## Performance

- Tooltips are fetched on-demand (only when hovered)
- 300ms delay before fetching to avoid unnecessary API calls
- Results are cached in component state
- Minimal impact on initial page load
