import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthBg } from "../../Components/Auth/SignBg/AuthBg";
import { AuthSelection } from "../../Pages/Auth/Selection/AuthSelection";
import { SignIn } from "../../Pages/Auth/SignIn/SignIn";
import { SignUp } from "../../Pages/Auth/SignUp/SignUp";
import { ConfirmEmail } from "../../Components/Auth/SignUp/ConfirmEmail/ConfirmEmail";

const App = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Le0YTQkAAAAAHftYF71fIFvFCyVdwfIlI5aLGDK">
      <Routes>
        <Route path="/" element={<AuthBg />}>
          <Route index element={<AuthSelection />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="email-confirm" element={<ConfirmEmail />} />
        </Route>
        {/* <Route path="*" element={<NoMatch />} /> */}
      </Routes>
    </GoogleReCaptchaProvider>
  );
};

export default App;
