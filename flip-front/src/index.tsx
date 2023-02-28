import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { store } from "./Store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeActions } from "./Components/Theme/themeActions";
import "./Components/Axios/axios";
import AuthApp from "./Main/IsAuth/AuthApp";
import App from "./Main/NotAuth/App";
import { AuthUser } from "./Components/Auth/store/actions";
import jwtDecode from "jwt-decode";
import { JwtDecoder } from "./Interface/JwtDecoder";
import "./Components/i18n/i18n";
import axios from "axios";
import { Suspense } from "react";
import { Toast } from "./Components/Toast/Toast";

const ldMode = localStorage.getItem("LightDarkMode");
const token = localStorage.getItem("token");
const lng = localStorage.getItem("lng");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (!ldMode) localStorage.setItem("LightDarkMode", "light");

if (!lng) {
  axios.get("https://ipapi.co/json/").then((response) => {
    let data = response.data;

    if (data.country_name === "Ukraine") localStorage.setItem("lng", "ua");
    else if (data.country_name === "Russian") localStorage.setItem("lng", "ru");
    else localStorage.setItem("lng", "en");
  });
}

ThemeActions(store.dispatch);

const NotUser = () => {
  root.render(
    <Suspense fallback="">
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toast />
        </BrowserRouter>
      </Provider>
    </Suspense>
  );
};

if (token) {
  AuthUser(token as string, store.dispatch);
  const excToken = jwtDecode<JwtDecoder>(token);
  const date = new Date().getTime();

  setTimeout(() => {
    if (excToken.exp < date) {
      root.render(
        <Suspense fallback="">
          <Provider store={store}>
            <BrowserRouter>
              <div className="root_main">
                <AuthApp />
              </div>
              <Toast />
            </BrowserRouter>
          </Provider>
        </Suspense>
      );
    } else {
      NotUser();
    }
  }, 400);
} else {
  NotUser();
}

reportWebVitals();
