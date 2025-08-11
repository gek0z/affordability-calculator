# React + TypeScript + Vite + TalwindCSS + Vitest/RTL

A minimal Vite web app featuring my own take on the Affordability Calculator tool found on this [page](https://www.openrent.co.uk/find-flats-and-houses-for-rent-online) on the OpenRent website.

### Changes from the original OpenRent version

- Added a "City" input field that can provide an estimate including bills (based on the average for the zone); currently, it just uses placeholder values.
- Added a "Search now" button to search for properties for rent with the input provided.
- Took inspiration from the home page and the search page with the affordability calculators.

### Live Preview

[rent-calculator.riccardo.lol](https://rent-calculator.riccardo.lol)


### Requirements

- **Node.js**: >= 20.19.0  
  - If you use `nvm`: `nvm install 22 && nvm use 22`

### Setup
```bash
npm install
# or
pnpm install
```

### Development
```bash
npm run dev
# or 
pnpm run dev
```
Open `http://localhost:5173` in your browser.

```bash
# Watch mode
npm test

# CI mode
npm run test:run

# Coverage report
npm run test:coverage

# Vitest UI
npm run test:ui
```

-----
## Notes
- Assets, colors and font from [OpenRent.co.uk](https://www.openrent.co.uk/)
- Development time 2~ hours
- Cities are just placeholders for the MVP.
- The block could replace the current placement, or it could be expanded to be its own page.