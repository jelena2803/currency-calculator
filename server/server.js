const express = require("express");
require("dotenv").config();
const connectToDb = require("./config/connectToDb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const adminController = require("./controllers/adminController");
const currencyController = require("./controllers/currencyController");
const requireAuth = require("./middleware/requireAuth");

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

connectToDb();

// ADMIN RELATED REQUESTS
// admin signup
app.post("/admin/signup", adminController.signup);
// admin log in
app.post("/admin/login", adminController.login);
//admin log out
app.get("/logout", adminController.logout);
// admin authentication
app.get("/checkAuth", requireAuth, adminController.checkAuth);

//CURRENCY RELATED REQUESTS
//fetch my currencies for both admin dashboard and user's homepage
app.get("/currencies", currencyController.getMyCurrencies);
// add new currency
app.post("/currencies", requireAuth, currencyController.addCurrency);
// update currency
app.put("/currencies/:id", requireAuth, currencyController.editCurrency);
// delete currency
app.delete("/currencies/:id", requireAuth, currencyController.deleteCurrency);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
