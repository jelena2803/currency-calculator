import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PageNotFound from "./components/PageNotFound";
import "./index.css";
import axios from "axios";

function App() {
  // check if the admin is logged in or not
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  //admin's currencies fetched from db and filtered if shown or not to the user
  const [currencies, setCurrencies] = useState([]);
  const [shownCurrencies, setShownCurrencies] = useState([]);
  const [hiddenCurrencies, setHiddenCurrencies] = useState([]);

  // admin authentication request
  async function checkAuth() {
    try {
      const responseFromAuth = await axios.get(
        "http://localhost:3030/checkAuth",
        {
          withCredentials: true,
        }
      );
      if (responseFromAuth.status === 200) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  async function getMyCurrencies() {
    try {
      const res = await axios.get("http://localhost:3030/currencies");
      // add more key value pairs to data to be used for display on frontend
      const myCurrenciesFromDb = await res.data.map((i) => ({
        ...i,
        value: i.currencyName,
        label: i.currencyName,
      }));

      // divide and store the data from db that are marked as either shown or hidden
      const onlyShownCurrencies = await myCurrenciesFromDb.filter(
        (i) => i.isShown == true
      );
      const onlyHiddenCurrencies = await myCurrenciesFromDb.filter(
        (i) => i.isShown != true
      );

      setCurrencies(myCurrenciesFromDb);
      setShownCurrencies(onlyShownCurrencies);
      setHiddenCurrencies(onlyHiddenCurrencies);
    } catch (error) {
      console.error("Error fetching currencies from db:", error);
    }
  }

  useEffect(() => {
    async function verifyAuth() {
      setLoading(true);
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        setLoggedIn(isAuthenticated);
      }
      setLoading(false);
    }
    verifyAuth();
  }, []);

  if (loading) {
    // While checking for authentication, show temporary message
    return <div>Please wait, the page is loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              shownCurrencies={shownCurrencies}
              setShownCurrencies={setShownCurrencies}
              getMyCurrencies={getMyCurrencies}
            />
          }
        />
        <Route path="admin/signup" element={<Signup />} />
        <Route
          path="admin/login"
          element={
            <Login
              loggedIn={loggedIn}
              checkAuth={checkAuth}
              setLoggedIn={setLoggedIn}
            />
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <Dashboard
              currencies={currencies}
              shownCurrencies={shownCurrencies}
              hiddenCurrencies={hiddenCurrencies}
              setShownCurrencies={setShownCurrencies}
              getMyCurrencies={getMyCurrencies}
              checkAuth={checkAuth}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              loading={loading}
            />
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
