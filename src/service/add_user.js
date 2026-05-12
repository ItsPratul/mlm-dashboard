const userModel = require("../model/user_model");
const Transaction = require("../model/transaction_model");
const bcrypt = require("bcryptjs");

exports.add_user_post = async (req) => {
  try {
    let {
      name,
      email,
      password,
      mobile,
      dob,
      gender,
      address,
      city,
      state,
      amount,
    } = req.body;

    const parent_id = req.user.user_id;

    // ================= VALIDATION =================

    if (!name || !email || !password) {
      return {
        success: false,
        message: "Required fields missing",
      };
    }

    amount = Number(amount);

    if (!amount || amount <= 0) {
      return {
        success: false,
        message: "Invalid amount",
      };
    }

    // ================= CHECK EXISTING USER =================

    const existingUser = await userModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return {
        success: false,
        message: "User Already Exists",
      };
    }

    // ================= HASH PASSWORD =================

    const hashPassword = await bcrypt.hash(password, 10);

    // ================= GENERATE USER ID =================

    const lastUser = await userModel.findOne().sort({
      user_id: -1,
    });

    const user_id = lastUser ? lastUser.user_id + 1 : 1;

    // ================= WALLET LOGIC =================

    const userWallet = parent_id ? amount * 0.75 : amount;

    // ================= POSITION =================

    let position = 1;

    if (parent_id) {
      const children = await userModel.countDocuments({
        parent_id,
      });

      position = children + 1;
    }

    // ================= CREATE USER =================

    const newUser = await userModel.create({
      name,
      user_id,
      email,
      password: hashPassword,
      parent_id: parent_id || null,
      wallet: userWallet,
      mobile,
      date_of_birth: dob,
      gender,
      address,
      city,
      state,
      position,
    });

    // ================= USER ENTRY BALANCE TRANSACTION =================

    await Transaction.create({
      fromUserId: user_id,
      toUserId: user_id,

      oldBalance: 0,

      amount: userWallet,

      updatedBalance: userWallet,

      type: "credit",

      remark: "Account Opening Balance",

      status: "success",
    });

    // ================= MLM COMMISSION DISTRIBUTION =================

    let remainingAmount = amount - userWallet;

    let currentParent = parent_id;

    while (currentParent && remainingAmount > 0) {
      const parent = await userModel.findOne({
        user_id: currentParent,
      });

      if (!parent) break;

      // ================= CALCULATE COMMISSION =================

      const commission =
        parent.parent_id === null ? remainingAmount : remainingAmount * 0.75;

      const oldBalance = parent.wallet;

      const updatedBalance = oldBalance + commission;

      // ================= UPDATE WALLET =================

      await userModel.updateOne(
        { user_id: currentParent },
        {
          $inc: {
            wallet: commission,
          },
        },
      );

      // ================= CREATE COMMISSION TRANSACTION =================

      await Transaction.create({
        fromUserId: newUser.user_id,

        toUserId: currentParent,

        oldBalance,

        amount: commission,

        updatedBalance,

        type: "credit",

        // remark: `Level Commission From User ID ${newUser.user_id}`,
        remark: "Level Commission",

        status: "success",
      });

      // ================= MOVE TO NEXT PARENT =================

      remainingAmount -= commission;

      currentParent = parent.parent_id;
    }

    return {
      success: true,
      message: "User Registered Successfully",
    };
  } catch (error) {
    console.error("Signup Error:", error);

    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

exports.update_user = async (req) => {
  try {
    const { user_id } = req.params;

    let { name, email, mobile, dob, gender, address, city, state } = req.body;

    // ===== CHECK USER EXISTS =====
    const existingUser = await userModel.findOne({ user_id });

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    // ===== UPDATE =====
    await userModel.updateOne(
      { user_id },
      {
        name,
        email,
        mobile,
        date_of_birth: dob,
        gender,
        address,
        city,
        state,
      },
    );

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Update User Error:", error.message);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};
