import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-83a44yp6ocoxkr5h.us.auth0.com"
      clientId="PzmI5uOI2npe4rMlmSKwsgx5KipIRXuz"
      cacheLocation="localstorage" // ✅ ADD THIS
      useRefreshTokens={true}
      authorizationParams={{
        redirect_uri: window.location.origin,
            audience: "https://jarvis-api",
      }}
    >
      <StrictMode>
        <App />
      </StrictMode>
    </Auth0Provider>
  </BrowserRouter>,
);
