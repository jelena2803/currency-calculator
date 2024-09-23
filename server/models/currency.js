const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  currencyName: String,
  isShown: Boolean,
});

const Currency = mongoose.model("Currency", currencySchema);

module.exports = Currency;
