const mongoose = require("mongoose");
const Currency = require("../models/currency");

//add new currency
const addCurrency = async (req, res) => {
  try {
    // request body handler
    const { currencyName, isShown } = req.body;

    const currencyFound = await Currency.findOne({ currencyName });
    // return error message if there is already the same currency in db
    if (currencyFound) {
      return res.status(400).json({ msg: "Currency is already added" });
    }

    //Create a student with the data sent
    const currency = await Currency.create({
      currencyName,
      isShown,
    });

    //Send a response
    res.json(currency);
  } catch (err) {
    res.sendStatus(500);
  }
};

// edit currency visibility
const editCurrency = async (req, res) => {
  const { isShown } = req.body;
  try {
    // Find the currency by its ID and update the isShown field
    const currencyToBeEdited = await Currency.findOneAndUpdate(
      { _id: req.params.id }, // Find the currency by _id
      { $set: { isShown } }, // Update the isShown field
      { new: true } // Return the updated document
    );

    // If the currency is not found
    if (!currencyToBeEdited) {
      return res.status(404).json({ error: "Currency not found" });
    }
    // Send the updated currency back to the client
    res.json(currencyToBeEdited);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete a currency from db
const deleteCurrency = async (req, res) => {
  try {
    const deletedCurrency = await Currency.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletedCurrency) {
      return res.status(404).json({ error: "Currency not found" });
    }
    res.json({ msg: "Currency deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all currencies from db
const getMyCurrencies = async (req, res) => {
  try {
    const myCurrencies = await Currency.find({});
    res.json(myCurrencies);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addCurrency,
  editCurrency,
  deleteCurrency,
  getMyCurrencies,
};
