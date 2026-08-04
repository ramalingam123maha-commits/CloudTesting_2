# Monthly Budget Planner

A single-page, client-side budget planner. No backend or build step required —
open `index.html` in a browser and it works, persisting data to `localStorage`.

## Features

- **Income vs. expense input** — add transactions with type, category, amount, date, and description
- **Category breakdown doughnut chart** — visualizes expenses by category (Chart.js)
- **Savings goal progress bar** — set a monthly savings goal and track progress toward it
- **Transaction history table** — sortable-by-date list of all transactions with delete support
- **PDF export** — exports the current month's report (summary, chart, table) as a PDF (jsPDF + html2canvas)
- **Per-month data** — switch months via the month picker; each month keeps its own transactions and goal

## Getting Started

Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
npx serve budget-planner
# or
python3 -m http.server --directory budget-planner 8080
```

## Project Structure

```
budget-planner/
├── index.html   # Markup / layout
├── styles.css   # Styling
└── app.js       # State, rendering, chart, and PDF export logic
```

## Tech

- Vanilla HTML/CSS/JavaScript (no framework, no build step)
- [Chart.js](https://www.chartjs.org/) for the doughnut chart
- [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) for PDF export
- `localStorage` for persistence (data stays in your browser)
