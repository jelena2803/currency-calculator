import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRadio,
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBNavbarBrand,
} from "mdb-react-ui-kit";
import Select from "react-select";
import axios from "axios";
import Calculator from "./Calculator";
import Modal from "./CurrencyEditDeleteModal";
import { Navigate, useNavigate } from "react-router-dom";

function Dashboard({
  currencies,
  shownCurrencies,
  hiddenCurrencies,
  getMyCurrencies,
  checkAuth,
  loggedIn,
  setLoggedIn,
}) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // currency calculations
  const [amount, setAmount] = useState(1);
  const [baseCurrency, setBaseCurrency] = useState({
    value: "EUR",
    label: "EUR",
  });
  const [targetCurrency, setTargetCurrency] = useState({
    value: "USD",
    label: "USD",
  });

  const [selectedNewCurrency, setSelectedNewCurrency] = useState({
    value: "USD",
    label: "USD",
  });

  // all currencies that can be fetched from api.exchangerate-api to be available for admin
  const [allCurrencies, setAllCurrencies] = useState([
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
  ]);

  //new currency to be added to db
  const [newCurrency, setNewCurrency] = useState({
    currencyName: "",
    isShown: true,
  });

  const [modalType, setModalType] = useState(null); // set type of modal to show or hide either edit or delete modal
  const [currentItem, setCurrentItem] = useState(null); // The current item (currency) being edited or deleted

  const [selectedCurrencyTab, setSelectedCurrencyTab] = useState("all"); //name of tab to filter the display of currencies (all, visible or hidden)

  async function getAllCurrencies() {
    try {
      const res = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/eur"
      );
      const temp = Object.keys(res.data.rates).filter((key) => key);
      const fetchedCurrencies = temp.map((currency) => {
        return { value: currency, label: currency };
      });
      setAllCurrencies(fetchedCurrencies);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // set the visibility status of new currency
  function handleRadioChange(e) {
    // verify if visible button is checked to mark true, else mark false
    const isVisible = e.target.id === "visible";
    // Update new currency isShown property before adding to db
    setNewCurrency((prevState) => ({
      ...prevState,
      isShown: isVisible,
    }));
  }

  // chose a new currency name from the list
  function handleSelectNewCurrency(e) {
    setNewCurrency((prevState) => ({
      ...prevState,
      currencyName: e.value,
    }));
    // set selected currency value
    setSelectedNewCurrency(e);
  }

  async function addNewCurrency() {
    if (newCurrency.currencyName != "") {
      try {
        const res = await axios.post(
          "http://localhost:3030/currencies",
          newCurrency,
          {
            withCredentials: true,
          }
        );
        if (res.status === 200) {
          // fetch from db
          getMyCurrencies();
        }
      } catch (err) {
        console.log("Error in adding a new currency", err);
      }
    }
  }

  // handle opening the modal
  function toggleModal(type, item) {
    // set the modal type (edit or delete)
    setModalType(type);
    // Set the currency data to be edited or deleted after confirmation modal
    setCurrentItem(item);
  }

  //edit currency visibility
  async function editCurrency(item) {
    try {
      const response = await axios.put(
        `http://localhost:3030/currencies/${item._id}`,
        { isShown: !item.isShown }, // Send updated isShown value
        { withCredentials: true }
      );
      // fetch all admin's currencies
      getMyCurrencies();
      // set modal type to null to close it
      setModalType(null);
    } catch (error) {
      console.error("Error updating currency:", error);
    }
  }

  //delete currency
  async function deleteCurrency(id) {
    await axios.delete(`http://localhost:3030/currencies/${id}`, {
      withCredentials: true,
    });
    // fetch all admin's currencies
    getMyCurrencies();
    // Close the modal
    setModalType(null);
  }

  function handleActiveCurrencyTab(option) {
    setSelectedCurrencyTab(option);
  }

  function renderActiveCurrencyTabContent(currencyList) {
    return currencyList.map((currency) => (
      <div
        key={currency.id}
        className="align-items-center justify-content-stretch currency-info"
      >
        <MDBRow className="g-0 h-100">
          <MDBCol
            className="d-flex flex-column align-items-center justify-content-center"
            md="7"
          >
            <h5 className="text-center mb-0">{currency.currencyName}</h5>
          </MDBCol>
          <MDBCol
            className="d-flex flex-column align-items-center justify-content-evenly currency-data-column text-end"
            md="5"
          >
            {currency.isShown ? (
              <MDBIcon
                far
                icon="eye"
                className="text-primary"
                onClick={() => toggleModal("edit", currency)}
              />
            ) : (
              <MDBIcon
                far
                icon="eye-slash"
                className="text-primary"
                onClick={() => toggleModal("edit", currency)}
              />
            )}

            <MDBIcon
              fas
              icon="trash"
              className="text-danger"
              onClick={() => toggleModal("delete", currency)}
            />
          </MDBCol>
        </MDBRow>
      </div>
    ));
  }

  async function handleLogout() {
    const res = await axios.get("http://localhost:3030/logout", {
      withCredentials: true,
    });
    if (res.status === 200) {
      setLoggedIn(false);
      navigate("/admin/login");
    }
  }

  useEffect(() => {
    async function verifyAuth() {
      const isAuthenticated = await checkAuth();
      setIsAuthenticated(isAuthenticated);
      if (!isAuthenticated) {
        navigate("/admin/login");
      }
      getAllCurrencies();
      getMyCurrencies();
    }
    verifyAuth();
  }, []);

  return (
    <>
      <MDBContainer fluid className="admin-navbar shadow-1">
        <MDBNavbarBrand>Admin Dashboard</MDBNavbarBrand>
        <MDBBtn className="log-out-btn" onClick={handleLogout}>
          LOG OUT
        </MDBBtn>
      </MDBContainer>

      {/* currency calculator section */}
      <div className="admin-calculator">
        <Calculator
          shownCurrencies={allCurrencies}
          amount={amount}
          setAmount={setAmount}
          baseCurrency={baseCurrency}
          setBaseCurrency={setBaseCurrency}
          targetCurrency={targetCurrency}
          setTargetCurrency={setTargetCurrency}
        />
      </div>

      {/* add new currency section */}
      <>
        <MDBContainer
          breakpoint="sm"
          className="my-4 p-4 w-50 square bg-light rounded-3 shadow-3-strong"
        >
          <h5 className="text-center">Add new currency</h5>
          <div className="mt-4 d-flex justify-content-between">
            <div>
              <p className="my-2">Choose a new currency</p>
              <Select
                id="fromCurrency"
                options={allCurrencies}
                value={selectedNewCurrency}
                onChange={(e) => handleSelectNewCurrency(e)}
              />
            </div>

            <div>
              <p className="my-2">New currency status</p>
              <MDBRadio
                name="flexRadioDefault"
                id="visible"
                label="Visible"
                onChange={handleRadioChange}
                defaultChecked
              />
              <MDBRadio
                name="flexRadioDefault"
                id="hidden"
                label="Hidden"
                onChange={handleRadioChange}
              />
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-between">
            <MDBBtn type="submit" onClick={addNewCurrency}>
              Add currency
            </MDBBtn>
          </div>
        </MDBContainer>
      </>

      {/* admin's currencies section */}
      <MDBContainer
        breakpoint="md"
        className="mb-6 p-4 square bg-light rounded-3 shadow-3-strong"
      >
        <h5 className="text-center">My currencies</h5>
        <MDBTabs justify className="mb-3">
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleActiveCurrencyTab("all")}
              active={selectedCurrencyTab === "all"}
            >
              All currencies
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleActiveCurrencyTab("shown")}
              active={selectedCurrencyTab === "shown"}
            >
              Shown currencies only
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleActiveCurrencyTab("hidden")}
              active={selectedCurrencyTab === "hidden"}
            >
              Hidden currencies only
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent className="d-flex flex-wrap gap-2">
          {selectedCurrencyTab === "shown"
            ? renderActiveCurrencyTabContent(shownCurrencies)
            : selectedCurrencyTab === "hidden"
            ? renderActiveCurrencyTabContent(hiddenCurrencies)
            : renderActiveCurrencyTabContent(currencies)}

          {/* Confirmation modal to edit currency */}
          {modalType === "edit" && currentItem && (
            <Modal
              title={`Edit currency status - change the user's access to ${currentItem.currencyName}`}
              text={
                currentItem.isShown
                  ? `${currentItem.currencyName} is on your list and on the user's currency list. Do you want to hide ${currentItem.currencyName} from the user's currency list and keep it as hidden on your currency list only?`
                  : `${currentItem.currencyName} is on the admin's currency list, but it is hidden from the user. Do you want to make ${currentItem.currencyName} visible for the user as well?`
              }
              confirmText="Save Changes"
              show={true}
              onClose={() => setModalType(null)}
              onConfirm={() => editCurrency(currentItem)}
            />
          )}

          {/* Confirmation modal to delete currency */}
          {modalType === "delete" && currentItem && (
            <Modal
              title="Delete currency"
              text={`Are you sure you want to delete ${currentItem.currencyName}?`}
              confirmText="Delete"
              show={true}
              onClose={() => setModalType(null)}
              onConfirm={() => deleteCurrency(currentItem._id)}
            />
          )}
        </MDBTabsContent>
      </MDBContainer>
    </>
  );
}

export default Dashboard;
