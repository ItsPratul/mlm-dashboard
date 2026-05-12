let userModel = require("../model/user_model");

let Transaction = require("../model/transaction_model");

exports.add_balance = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const admin_data = await userModel.findOne({
      user_id: user_id,
    });

    if (!admin_data) {
      return {
        success: false,

        message: "User not found",
      };
    }

    return {
      success: true,

      admin_data,
    };
  } catch (error) {
    console.log("ADD BALANCE ERROR :", error);

    return {
      success: false,

      message: "Something went wrong",
    };
  }
};

exports.add_balance_post = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // ================= USER =================

    const admin_data = await userModel.findOne({
      user_id: user_id,
    });

    if (!admin_data) {
      return {
        success: false,

        message: "User not found",
      };
    }

    // ================= AMOUNT =================

    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return {
        success: false,

        message: "Invalid amount",
      };
    }

    // ================= BALANCE =================

    const oldBalance = Number(admin_data.wallet) || 0;

    const updatedBalance = oldBalance + amount;

    // ================= UPDATE WALLET =================

    await userModel.findOneAndUpdate(
      {
        user_id: user_id,
      },

      {
        $set: {
          wallet: updatedBalance,
        },
      },
    );

    // ================= SAVE TRANSACTION =================

    await Transaction.create({
      fromUserId: user_id,

      toUserId: user_id,

      oldBalance: oldBalance,

      amount: amount,

      updatedBalance: updatedBalance,

      type: "credit",

      remark: "Wallet Deposit",

      status: "success",
    });

    // ================= SUCCESS =================

    return {
      success: true,

      message: "Balance added successfully",
    };
  } catch (error) {
    console.log("ADD BALANCE POST ERROR :", error);

    return {
      success: false,

      message: "Something went wrong",
    };
  }
};

exports.withdraw_balance = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // ================= USER =================

    const admin_data = await userModel.findOne({
      user_id: user_id,
    });

    if (!admin_data) {
      return {
        success: false,

        message: "User not found",
      };
    }

    return {
      success: true,

      admin_data,
    };
  } catch (error) {
    console.log("WITHDRAW BALANCE ERROR :", error);

    return {
      success: false,

      message: "Something went wrong",
    };
  }
};

exports.withdraw_balance_post = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // ================= USER =================

    const admin_data = await userModel.findOne({
      user_id: user_id,
    });

    if (!admin_data) {
      return {
        success: false,

        message: "User not found",
      };
    }

    // ================= AMOUNT =================

    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return {
        success: false,

        message: "Invalid amount",
      };
    }

    // ================= CHECK WALLET =================

    const oldBalance = Number(admin_data.wallet) || 0;

    if (amount > oldBalance) {
      return {
        success: false,

        message: "Insufficient wallet balance",
      };
    }

    // ================= UPDATED BALANCE =================

    const updatedBalance = oldBalance - amount;

    // ================= UPDATE WALLET =================

    await userModel.findOneAndUpdate(
      {
        user_id: user_id,
      },

      {
        $set: {
          wallet: updatedBalance,
        },
      },
    );

    // ================= SAVE TRANSACTION =================

    await Transaction.create({
      fromUserId: user_id,

      toUserId: user_id,

      oldBalance: oldBalance,

      amount: amount,

      updatedBalance: updatedBalance,

      type: "debit",

      remark: "Wallet Withdrawal",

      status: "success",
    });

    // ================= SUCCESS =================

    return {
      success: true,

      message: "Balance withdrawn successfully",
    };
  } catch (error) {
    console.log("WITHDRAW BALANCE POST ERROR :", error);

    return {
      success: false,

      message: "Something went wrong",
    };
  }
};
