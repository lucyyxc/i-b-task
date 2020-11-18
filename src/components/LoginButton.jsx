import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({updateView}) => {
  const { loginWithPopup } = useAuth0();

  return <p className="login-button" onClick={() => {
    loginWithPopup()
    updateView('selected', 'loading');
  }}>Log In</p>;
};

export default LoginButton;