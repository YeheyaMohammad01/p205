# Quick Start Guide - Testing Your PennyWise Demo

## ✅ Server is Running!

Your app is now live at: **http://localhost:3000**

## 🎯 How to Test the Demo

### 1. First Look (Home Page)

- Open http://localhost:3000
- You'll see the landing page
- Click **"Get Started"** or **"Start Free Trial"**

### 2. Upload Sample Transactions

1. Click **"Upload"** in the sidebar
2. Drag & drop the sample CSV file OR click **"Browse Files"**
3. Sample file location: `public/sample-transactions.csv`
4. Watch as transactions are imported!
5. You'll see a success notification

### 3. View Your Dashboard

1. Click **"Dashboard"** in the sidebar
2. See real stats calculated from your data:
   - Total Spent
   - Monthly Budget
   - Top Category
   - Average Daily Spending
3. View charts showing your spending trends

### 4. Chat with AI

1. Click **"AI Insights"** in the sidebar
2. Try asking:
   - "How much did I spend?"
   - "What's my biggest expense?"
   - "How can I save money?"
   - "Show me my spending by category"
3. AI analyzes YOUR uploaded transactions!

### 5. Manage Budget

1. Click **"Budget"** in the sidebar
2. Adjust spending limits using sliders
3. See red/green indicators for over/under budget
4. Click **"Save Changes"**

### 6. View Transactions

1. Click **"Transactions"** in the sidebar
2. See all uploaded transactions
3. Search by name
4. Filter by category

## 📊 Upload Your Own Data

Create a CSV file with this format:

```csv
Date,Description,Amount,Category
2024-11-15,Starbucks,6.50,Food & Dining
2024-11-16,Gas Station,45.00,Transportation
2024-11-17,Netflix,15.99,Entertainment
```

Minimum required columns:

- **Date** (YYYY-MM-DD format)
- **Description** (what you bought)
- **Amount** (how much)
- Category is optional - auto-categorized if missing!

## 🧪 Test Features

### Test CSV Parsing

- ✅ Upload a CSV → See transaction count in toast
- ✅ Check Dashboard → Numbers update
- ✅ Check Transactions page → See all entries

### Test AI Chat

- ✅ Ask about spending → Get real answers based on your data
- ✅ No API key needed → Smart mock responses
- ✅ Optional: Add OpenAI key for real AI

### Test Data Persistence

- ✅ Refresh page → Data stays (localStorage)
- ✅ Upload more files → Adds to existing data
- ✅ Close browser → Data persists

### Test Budget Management

- ✅ Adjust budget sliders → See changes
- ✅ Save budget → Toast notification
- ✅ View spending vs budget → Visual indicators

## 🐛 Troubleshooting

### No data showing?

1. Make sure you uploaded a CSV file
2. Check Upload page for success message
3. CSV must have Date, Description, Amount columns

### AI not responding?

- Responses work without API key
- If you want real OpenAI, add `.env.local` with `OPENAI_API_KEY`

### Want to start fresh?

- Open Developer Tools (F12)
- Go to Application → Local Storage
- Delete `pennywise_data`
- Refresh page

## 🎉 Demo Flow

**Full workflow:**

1. Upload sample CSV (14 transactions)
2. Go to Dashboard → See $786.31 spent
3. Go to Budget → Adjust limits
4. Go to Insights → Ask "What did I spend the most on?"
5. AI tells you about your top categories!

## 📝 Key Differences from Before

**Before:** Fake hardcoded data
**Now:** Real data from CSV uploads!

**Before:** Mock AI responses only
**Now:** AI analyzes YOUR actual transactions!

**Before:** Can't save anything
**Now:** Data persists in browser storage!

---

Enjoy testing your working demo! 🚀
