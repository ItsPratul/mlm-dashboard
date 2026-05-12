let userModel = require("../model/user_model");

let transactionModel = require("../model/transaction_model");

exports.transaction_manager = async (req, res) => {
  try {
    const login_user_id = req.user.user_id;

    // ================= USER =================

    const admin_data = await userModel.findOne({
      user_id: login_user_id,
    });

    if (!admin_data) {
      return {
        success: false,

        message: "User not found",
      };
    }

    // ================= FILTER =================

    let matchFilter = {};

    // ROOT USER CHECK

    if (req.user.parent_id != null) {
      matchFilter = {
        $or: [
          {
            fromUserId: login_user_id,
          },

          {
            toUserId: login_user_id,
          },
        ],
      };
    }

    // ================= FILTERS =================

    if (req.query.filterfromuserid) {
      matchFilter.fromUserId = Number(req.query.filterfromuserid);
    }

    if (req.query.filtertouserid) {
      matchFilter.toUserId = Number(req.query.filtertouserid);
    }

    if (req.query.filteramount) {
      matchFilter.amount = Number(req.query.filteramount);
    }

    if (req.query.filtertype) {
      matchFilter.type = req.query.filtertype;
    }

    // ================= AGGREGATION =================

    const transaction_data = await transactionModel.aggregate([
      {
        $match: matchFilter,
      },

      // ================= FROM USER =================

      {
        $lookup: {
          from: "users",

          localField: "fromUserId",

          foreignField: "user_id",

          as: "fromUser",
        },
      },

      // ================= TO USER =================

      {
        $lookup: {
          from: "users",

          localField: "toUserId",

          foreignField: "user_id",

          as: "toUser",
        },
      },

      // ================= ARRAY TO OBJECT =================

      {
        $addFields: {
          fromUser: {
            $arrayElemAt: ["$fromUser", 0],
          },

          toUser: {
            $arrayElemAt: ["$toUser", 0],
          },
        },
      },

      // ================= NAME FILTER =================

      ...(req.query.filtername
        ? [
            {
              $match: {
                $or: [
                  {
                    "fromUser.name": {
                      $regex: req.query.filtername,

                      $options: "i",
                    },
                  },

                  {
                    "toUser.name": {
                      $regex: req.query.filtername,

                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),

      // ================= FINAL OUTPUT =================

      {
        $project: {
          _id: 1,

          transaction_id: 1,

          fromUserId: 1,

          toUserId: 1,

          oldBalance: 1,

          amount: 1,

          updatedBalance: 1,

          type: 1,

          remark: 1,

          status: 1,

          createdAt: 1,

          fromUserName: "$fromUser.name",

          toUserName: "$toUser.name",
        },
      },

      // ================= SORT =================

      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return {
      success: true,

      admin_data,

      transaction_data,
    };
  } catch (error) {
    console.log("TRANSACTION SERVICE ERROR :", error);

    return {
      success: false,

      message: "Something went wrong",
    };
  }
};
