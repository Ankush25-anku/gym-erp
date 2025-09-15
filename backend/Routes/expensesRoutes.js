const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ✅ Get all expenses
router.get("/", async (req, res) => {
  const { gymId } = req.query;

  try {
    const filter = {};
    if (gymId) filter.gymId = gymId;

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});


// ✅ Create a new expense
router.post("/", async (req, res) => {
  const { gymId, category, amount, paidTo, date, paymentMethod, description, receiptUrl } = req.body;

  if (!gymId || !category || !amount || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newExpense = new Expense({
      gymId,
      category,
      amount,
      paidTo,
      date,
      paymentMethod,
      description,
      receiptUrl,
    });

    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: "Failed to save expense" });
  }
});


// ✅ Update an expense
router.put("/:id", async (req, res) => {
  try {
    const { title, amount, category, notes, date } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        category,
        notes,
        date: date ? new Date(date) : new Date(),
      },
      { new: true }
    );
    if (!updatedExpense)
      return res.status(404).json({ error: "Expense not found" });

    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete an expense
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Expense not found" });

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get total expense amount
// GET /api/expenses/total?gymId=...
// ✅ Get total expense amount
// GET /api/expenses/total?gymId=...
router.get("/total", async (req, res) => {
  try {
    const { gymId } = req.query;

    // 🔒 Validate gymId
    const isValidObjectId = gymId && gymId !== "null" && gymId !== "undefined";

    const filter = {};
    if (isValidObjectId) {
      filter.gymId = gymId;
    }

    // Filter expenses by gymId (if valid)
    const expenses = await Expense.find(filter);

    // Calculate total amount
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + (expense.amount || 0),
      0
    );

    res.json({ total: totalExpenses });
  } catch (err) {
    console.error("Error calculating total:", err);
    res.status(500).json({ error: "Failed to calculate total expenses" });
  }
});


// ✅ Monthly expense breakdown for chart
router.get("/revenue/breakdown", async (req, res) => {
  try {
    const expenses = await Expense.find();

    const expenseByMonth = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.date || expense.createdAt || Date.now());
      const monthIndex = date.getMonth(); // 0 = Jan
      const month = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ][monthIndex];

      if (!expenseByMonth[month]) {
        expenseByMonth[month] = 0;
      }
      expenseByMonth[month] += expense.amount || 0;
    });

    const orderedMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlyExpense = orderedMonths
      .filter((month) => expenseByMonth[month])
      .map((month) => ({
        month,
        total: expenseByMonth[month],
      }));

    res.json({ monthlyExpense });
  } catch (err) {
    console.error("❌ Expense breakdown error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
