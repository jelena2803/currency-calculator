import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import {
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";

function Login({ loggedIn, setLoggedIn, checkAuth }) {
  const [admin, setAdmin] = useState({
    username: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // save the admin's input data to be sent to the backend
  const handleInput = (e) => {
    setShow(false);
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));
  };
  // request with the admin's data sent to the backed
  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:3030/admin/login", admin, {
        withCredentials: true,
      });
      if (res.status == 200) {
        // verify admin and cookie expiration before proceeding
        setLoggedIn(true);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response.data.msg);
      setShow(true);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/admin/dashboard");
    }
  }, []);

  return (
    <>
      <MDBContainer className="login-form mt-5 p-4">
        <h3 className="text-center mb-4">Sign in as admin</h3>
        <MDBInput
          className="mb-4"
          type="username"
          id="form1Input1"
          name="username"
          label="Username"
          value={admin.username}
          onChange={handleInput}
        />
        <MDBInput
          className="mb-4"
          type="password"
          id="form1Input2"
          name="password"
          label="Password"
          value={admin.password}
          onChange={handleInput}
        />
        {show && (
          <div
            className="mb-4"
            style={{
              backgroundColor: "#f9e1e5",
              color: "#af233a",
              borderRadius: "5px",
              textAlign: "left",
              padding: "0.8rem",
            }}
          >
            <MDBIcon fas icon="times" className="me-2" />
            {error}
          </div>
        )}
        <MDBRow className="mb-1 d-flex justify-content-center">
          <p>
            Don't have an admin account? <a href="/admin/signup">Sign up</a>
          </p>
          <p>
            Or return to the{" "}
            <a href="/">
              <b>website</b>
            </a>
          </p>
        </MDBRow>
        <div>
          <MDBBtn onClick={handleSubmit}>Sign in</MDBBtn>
        </div>
      </MDBContainer>
    </>
  );
}

export default Login;
