require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");

const { connectDB } = require("./db/dbconnection");
const userModel = require("./src/model/user_model");

const app = express();

// ================= BASIC MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= SESSION =================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  }),
);

// ================= FLASH =================
app.use(flash());

// ================= FLASH GLOBAL =================
app.use((req, res, next) => {
  res.locals.message = {
    success: req.flash("success")[0] || null,
    error: req.flash("error")[0] || null,
    warning: req.flash("warning")[0] || null,
    info: req.flash("info")[0] || null,
  };
  next();
});

// ================= GLOBAL USER MIDDLEWARE (IMPORTANT) =================
app.use(async (req, res, next) => {
  try {
    if (req.cookies?.token) {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

      const user = await userModel
        .findById(decoded.id)
        .select("-password -auth_key");

      res.locals.admin_data = user || null;
    } else {
      res.locals.admin_data = null;
    }

    next();
  } catch (error) {
    console.error("User Middleware Error:", error.message);
    res.locals.admin_data = null;
    next();
  }
});

// ================= STATIC =================
app.use(express.static(path.join(__dirname, "public")));

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// ================= ROUTES =================
app.use("/", require("./src/router/user_validation"));
app.use("/", require("./src/router/user_dashboard"));
app.use("/", require("./src/router/add_user"));
app.use("/", require("./src/router/view_update_user"));
app.use("/", require("./src/router/transaction_manager"));
app.use("/", require("./src/router/balance_manager"));
app.use("/", require("./src/router/user_profile"));
app.use("/", require("./src/router/products_manager"));

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Went Wrong");
});

// ================= DB + SERVER =================
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
