import React, { useEffect, useState } from "react";
import { MDBBtn, MDBInput, MDBContainer, MDBIcon } from "mdb-react-ui-kit";
import Select from "react-select";
import axios from "axios";

function Calculator({
  shownCurrencies,
  amount,
  setAmount,
  baseCurrency,
  setBaseCurrency,
  targetCurrency,
  setTargetCurrency,
}) {
  const [result, setResult] = useState(null);

  function handleInput(e) {
    setAmount(e.target.value);
  }

  async function calculateCurrency(e) {
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency.value}`
      );
      const rate = res.data.rates[targetCurrency.value];
      const exchangeResult = rate * amount;
      setResult(exchangeResult.toFixed(2));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function handleSelectBaseCurrency(e) {
    setBaseCurrency(e);
  }

  function handleSelectTargetCurrency(e) {
    setTargetCurrency(e);
  }

  function swapCurrencies() {
    const temp = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);
  }

  return (
    <>
      <MDBContainer
        breakpoint="sm"
        className="my-5 p-4 w-50 square bg-light rounded-3 shadow-3-strong"
      >
        <h5 className="text-center">Currency calculator</h5>
        <p className="my-2">Amount</p>
        <MDBInput
          type="number"
          id="amount"
          value={amount}
          onChange={handleInput}
        />

        <div className="mt-4 d-flex justify-content-between">
          <div>
            <p className="my-2">From</p>
            <Select
              id="fromCurrency"
              options={shownCurrencies}
              value={baseCurrency}
              onChange={(e) => handleSelectBaseCurrency(e)}
            />
          </div>
          <div className="exchange-icon-container">
            <i className="fas fa-exchange-alt" onClick={swapCurrencies}></i>
          </div>
          <div>
            <p className="my-2">To</p>
            <Select
              id="toCurrency"
              options={shownCurrencies}
              value={targetCurrency}
              onChange={(e) => handleSelectTargetCurrency(e)}
            />
          </div>
        </div>
        <div className="mt-4 d-flex justify-content-between">
          <MDBBtn type="submit" onClick={calculateCurrency}>
            Calculate
          </MDBBtn>
          <span tag="strong" className="fs-4">
            {result}
          </span>
        </div>
      </MDBContainer>
    </>
  );
}

export default Calculator;
