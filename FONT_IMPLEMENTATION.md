# Font Implementation - Fontsource Package

## Overview

This project uses the `@fontsource/vazirmatn` npm package instead of loading fonts from Google Fonts CDN. This approach provides better performance, privacy, and offline support.

## Why Fontsource?

### Advantages over CDN
1. **Self-Hosted**: No external dependencies or network requests
2. **Privacy**: No user tracking or data sent to Google
3. **Performance**: Fonts served from same origin, no DNS lookup
4. **Reliability**: No dependency on external CDN availability
5. **Version Control**: Font versions managed via package.json
6. **Build Optimization**: Webpack automatically optimizes and bundles fonts
7. **Developer Experience**: Simple npm install and CSS imports

### Advantages over Manual Font Files
1. **Maintainability**: Easy updates via `npm update`
2. **No Manual Work**: No need to download files manually
3. **Build Integration**: Automatically integrated into build process
4. **Proper Font Loading**: Includes optimized @font-face declarations
5. **Subsets Support**: Can easily add/remove specific weights or subsets
6. **Consistent Updates**: Package manager handles versioning

## Implementation

### Package Installation
```bash
npm install @fontsource/vazirmatn
```

### CSS Imports (src/styles.css)
```css
@import '@fontsource/vazirmatn/300.css';
@import '@fontsource/vazirmatn/400.css';
@import '@fontsource/vazirmatn/500.css';
@import '@fontsource/vazirmatn/600.css';
@import '@fontsource/vazirmatn/700.css';
@import '@fontsource/vazirmatn/800.css';
```

### Build Process
- Angular's build system automatically processes the imports
- Font files are extracted to `dist/*/browser/media/` directory
- CSS is optimized and bundled
- Font files are hashed for cache busting

## Font Files in Build

The build output includes:
- WOFF2 files (modern browsers)
- WOFF files (fallback for older browsers)
- Separate files for different weights (300-800)
- Separate files for different subsets (Arabic, Latin, Latin-Extended)
- All files are hashed: `vazirmatn-arabic-400-normal-77ROWRWV.woff`

## Usage in Code

The font is already configured in the global styles. Just use it in your components:

```css
.my-element {
  font-family: 'Vazirmatn', 'B Nazanin', 'Arial', sans-serif;
}
```

The font-family is already set globally on the body element in `src/styles.css`.

## Updating Fonts

To update to the latest version:
```bash
npm update @fontsource/vazirmatn
```

## Adding/Removing Weights

To add a weight (e.g., 900):
```css
@import '@fontsource/vazirmatn/900.css';
```

To remove a weight, simply remove its import line from `src/styles.css`.

## Alternative Fonts

To use a different font from Fontsource:

1. Install the font package:
```bash
npm install @fontsource/[font-name]
```

2. Update imports in `src/styles.css`:
```css
@import '@fontsource/[font-name]/400.css';
```

3. Update font-family in CSS

Browse available fonts: https://fontsource.org/fonts

## Resources

- Fontsource Website: https://fontsource.org/
- Vazirmatn on Fontsource: https://fontsource.org/fonts/vazirmatn
- GitHub Repository: https://github.com/fontsource/font-files
- NPM Package: https://www.npmjs.com/package/@fontsource/vazirmatn

## License

- **Vazirmatn Font**: SIL Open Font License 1.1
- **@fontsource/vazirmatn Package**: OFL-1.1
- Package maintained by the Fontsource team

---
Implementation Date: January 31, 2026
