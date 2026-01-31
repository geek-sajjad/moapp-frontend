# دفتر معین شخصی (Personal Ledger)

A Persian/Farsi personal accounting ledger application built with Angular 21, TailwindCSS, and shadcn-ui design patterns.

## Features

- ✅ User authentication (login/logout)
- ✅ Manage people/contacts
- ✅ Track transactions (debit/credit)
- ✅ Calculate balances automatically
- ✅ Search and filter
- ✅ Export data to JSON
- ✅ Share statements via SMS/WhatsApp
- ✅ Fully responsive design
- ✅ RTL (Right-to-Left) support for Persian
- ✅ Local storage for data persistence

## Technology Stack

- **Angular 21** - Modern web framework
- **TailwindCSS 4** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **Signals** - Reactive state management
- **Local Storage** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Default Credentials

- Username: `admin`
- Password: `admin`

## Project Structure

```
src/app/
├── components/
│   ├── login/              # Login component
│   ├── person-list/        # People management
│   ├── transaction-view/   # Transaction management
│   └── ui/                 # Shared UI components
├── models/                 # TypeScript interfaces
├── services/               # Business logic and data services
│   ├── auth.service.ts
│   ├── person.service.ts
│   ├── transaction.service.ts
│   ├── export.service.ts
│   ├── alert.service.ts
│   └── date-util.service.ts
└── guards/                 # Route guards
    └── auth.guard.ts
```

## Features in Detail

### Authentication
Simple mock authentication system using local storage. Users must log in to access the application.

### Person Management
- Add new people/contacts
- Edit person details (name, phone, address)
- Delete people (with confirmation)
- Search by name

### Transaction Management
- Record debit and credit transactions
- Persian date support
- Edit and delete transactions
- Automatic balance calculation
- Transaction history per person

### Data Export
- Export all data to JSON format
- Share transaction statements via native share API or clipboard

## Removed Features

The following features from the original HTML version were removed as requested:
- API integrations (all data is stored locally)
- jQuery dependency
- Font Awesome (replaced with inline buttons)
- Persian Datepicker library (using browser native date input)

## UI Components

The application uses custom UI components following shadcn-ui patterns:
- Button
- Input
- Textarea
- Select
- Modal
- Confirm Dialog
- Alert/Toast

## Development

```bash
# Run development server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

This project is provided as-is for personal or educational use.

## Converting from HTML

This Angular application was converted from a raw HTML/CSS/jQuery project to use modern Angular 21 features:
- Standalone components
- Signals for reactive state
- TailwindCSS for styling
- TypeScript for type safety
- Modular architecture
