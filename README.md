# PennyWise - AI-Powered Financial Assistant

A demo financial management app with AI-powered insights. Guest users can upload CSV files with transaction data and chat with AI about their spending.

## Features

✅ **CSV Upload & Parsing** - Upload transaction CSV files with automatic parsing
✅ **Real-time Dashboard** - View spending stats, charts, and trends
✅ **AI Chat** - Ask questions about your spending and get insights
✅ **Budget Simulator** - Set and track budget limits by category
✅ **Local Storage** - All data stored in browser localStorage (guest mode)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Demo Workflow

### Step 1: Upload Transactions

1. Navigate to **Upload** page from the sidebar
2. Upload a CSV file with your transaction data
3. Sample CSV format:
   ```csv
   Date,Description,Amount,Category
   2024-11-01,Whole Foods Market,87.43,Food & Dining
   2024-11-02,Shell Gas Station,45.00,Transportation
   ```
4. A sample file is included: `public/sample-transactions.csv`

### Step 2: View Dashboard

1. Navigate to **Dashboard**
2. See your spending stats, charts, and trends
3. All numbers are calculated from your uploaded data

### Step 3: Chat with AI

1. Navigate to **AI Insights**
2. Ask questions like:
   - "How much did I spend this month?"
   - "What's my biggest expense category?"
   - "How can I save more money?"
3. The AI analyzes your transaction data and provides insights

### Step 4: Manage Budget

1. Navigate to **Budget**
2. Set spending limits for each category
3. See how much you've spent vs. your budget

## CSV File Format

Your CSV file should have these columns (names are flexible):

- **Date** - Transaction date (YYYY-MM-DD format)
- **Description** / **Merchant** / **Name** - What you bought
- **Amount** / **Price** / **Total** - How much you spent
- **Category** (optional) - Will auto-categorize if missing

Example:

```csv
Date,Description,Amount,Category
2024-11-15,Starbucks,6.50,Food & Dining
2024-11-16,Gas Station,45.00,Transportation
2024-11-17,Netflix,15.99,Entertainment
```

## AI Integration (Optional)

To enable real OpenAI chat (instead of mock responses):

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Create a `.env.local` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
3. Restart the dev server

Without an API key, the app uses smart mock responses based on your data.

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **OpenAI API** - AI chat (optional)

## Data Storage

All data is stored in your browser's localStorage:

- No account needed
- Data persists between sessions
- Clear data: Developer Tools > Application > Local Storage

## Notes

- This is a demo app for guest users
- All data stays in your browser
- No backend or authentication required
- CSV parsing happens client-side
- AI chat uses your transaction data for context
