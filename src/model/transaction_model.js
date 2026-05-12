// ====================== TRANSACTION MODEL ======================

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transaction_id: {
    type: Number,
  },

  // ================= USERS =================

  fromUserId: {
    type: Number,
    required: true,
  },

  toUserId: {
    type: Number,
    required: true,
  },

  // ================= BALANCE =================

  oldBalance: {
    type: Number,
    required: true,
    default: 0,
  },

  amount: {
    type: Number,
    required: true,
  },

  updatedBalance: {
    type: Number,
    required: true,
  },

  // ================= TYPE =================

  type: {
    type: String,

    required: true,

    enum: ["credit", "debit"],
  },

  // ================= REMARK =================

  remark: {
    type: String,
    default: "",
  },

  // ================= STATUS =================

  status: {
    type: String,

    enum: ["success", "pending", "failed"],

    default: "success",
  },

  // ================= DATE =================

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ====================== AUTO TRANSACTION ID ======================

transactionSchema.pre("save", async function (next) {
  if (!this.transaction_id) {
    const lastTransaction = await this.constructor.findOne().sort({
      transaction_id: -1,
    });

    this.transaction_id = lastTransaction
      ? lastTransaction.transaction_id + 1
      : 1;
  }

  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
