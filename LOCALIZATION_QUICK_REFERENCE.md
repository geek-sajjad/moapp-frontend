# Quick Reference: Localized Resources

## Summary
All external resources have been localized using npm packages. The application now works completely offline.

## What Was Changed

### 1. Fonts
- **Before**: Loaded from Google Fonts CDN
- **After**: Using `@fontsource/vazirmatn` npm package
- **Package**: `@fontsource/vazirmatn` v5.2.8

### 2. Files Modified
1. `src/styles.css` - Replaced Google Fonts CDN with @fontsource imports
2. `package.json` - Added @fontsource/vazirmatn dependency

### 3. Package Added
```bash
npm install @fontsource/vazirmatn
```

## Implementation

In `src/styles.css`:
```css
@import '@fontsource/vazirmatn/300.css';
@import '@fontsource/vazirmatn/400.css';
@import '@fontsource/vazirmatn/500.css';
@import '@fontsource/vazirmatn/600.css';
@import '@fontsource/vazirmatn/700.css';
@import '@fontsource/vazirmatn/800.css';
```

## Testing

Build the project:
```bash
npm run build
```

Serve the project:
```bash
npm start
```

## Verification Checklist

✅ Google Fonts CDN URL removed  
✅ @fontsource/vazirmatn package installed  
✅ CSS imports updated  
✅ Project builds successfully  
✅ Fonts bundled in build output  
✅ No external URLs in source files  

## Benefits

- ✅ **Offline Support**: Works without internet
- ✅ **Performance**: No external font requests
- ✅ **Privacy**: No tracking via Google Fonts
- ✅ **Reliability**: No dependency on external CDNs
- ✅ **Version Control**: Managed via package.json
- ✅ **Easy Updates**: `npm update @fontsource/vazirmatn`
- ✅ **Build Integration**: Automatically bundled and optimized

## Maintenance

To update fonts:
```bash
npm update @fontsource/vazirmatn
```

To add/remove font weights:
Edit imports in `src/styles.css`

To change to a different font:
1. Install the new font package: `npm install @fontsource/[font-name]`
2. Update imports in `src/styles.css`
3. Update font-family in CSS

## More Information

- Fontsource: https://fontsource.org/
- Vazirmatn on Fontsource: https://fontsource.org/fonts/vazirmatn
- Available fonts: https://fontsource.org/fonts

---
Last Updated: January 31, 2026
