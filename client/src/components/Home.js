import React, { useEffect, useState } from "react";
import Calculator from "./Calculator";

function Home({ shownCurrencies, setShownCurrencies, getMyCurrencies }) {
  const [amount, setAmount] = useState(1);
  const [baseCurrency, setBaseCurrency] = useState({
    value: "EUR",
    label: "EUR",
  });
  const [targetCurrency, setTargetCurrency] = useState({
    value: "USD",
    label: "USD",
  });

  useEffect(() => {
    getMyCurrencies();
  }, []);

  return (
    <div className="pt-5">
      <Calculator
        shownCurrencies={shownCurrencies}
        amount={amount}
        setAmount={setAmount}
        baseCurrency={baseCurrency}
        setBaseCurrency={setBaseCurrency}
        targetCurrency={targetCurrency}
        setTargetCurrency={setTargetCurrency}
      />
    </div>
  );
}

export default Home;
