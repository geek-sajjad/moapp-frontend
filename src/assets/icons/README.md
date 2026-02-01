# Icons

This directory contains SVG icon files used throughout the application.

## Available Icons

- `arrow-left.svg` - Back/Return arrow
- `user.svg` - Single user icon
- `users.svg` - Multiple users icon
- `user-plus.svg` - Add user icon
- `phone.svg` - Phone/Contact icon
- `map-pin.svg` - Location/Address icon
- `edit.svg` - Edit/Pencil icon
- `dollar-sign.svg` - Currency/Money icon
- `calendar.svg` - Date/Calendar icon
- `plus.svg` - Add/Plus icon
- `minus.svg` - Subtract/Minus icon
- `save.svg` - Save icon
- `x.svg` - Close/Cancel icon
- `file.svg` - File icon
- `file-text.svg` - Document with text icon
- `share.svg` - Share icon
- `log-out.svg` - Logout icon
- `book.svg` - Ledger/Book icon
- `search.svg` - Search icon
- `lock.svg` - Lock/Password icon
- `alert-circle.svg` - Alert/Error icon
- `info.svg` - Information icon

## Usage

Icons are used through the `IconComponent`. Example:

```html
<app-icon name="user" [size]="20" />
<app-icon name="edit" [size]="16" class="text-blue-600" />
```

### Properties

- `name` (required): IconName - The name of the icon file (without .svg extension)
- `size` (optional): number - Size in pixels (default: 20)
- `class` (optional): string - Additional CSS classes

## Adding New Icons

1. Add the SVG file to this directory
2. Update the `IconName` type in `src/app/components/ui/icon/icon.component.ts`
3. Document the icon in this README

## Icon Guidelines

- All icons should be 24x24 viewBox
- Use `stroke="currentColor"` to inherit text color
- Keep stroke-width consistent (usually 2 or 2.5)
- Use stroke-linecap="round" and stroke-linejoin="round" for consistency
