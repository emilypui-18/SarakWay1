import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// 1. Import Amplify
import { Amplify } from 'aws-amplify';

// 2. Configure Cognito (Replace with your actual IDs)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_L5j6Nvm4a',
      userPoolClientId: '7b7krehjq1tdoo6h9qof35qn6l',
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
