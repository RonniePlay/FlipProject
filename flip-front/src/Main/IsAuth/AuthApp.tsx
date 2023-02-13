import { Route, Routes } from "react-router-dom";
import { Fliper } from "../../Pages/Fliper/Fliper";
import { Loyout } from "../../Components/Layout/Layout";
import { Profile } from "../../Pages/Profile/Profile";
import "./AuthApp.scss";

const AuthApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Loyout />}>
        <Route path=":profile" element={<Profile />} />
        <Route path="fliper" element={<Fliper />} />
      </Route>
      {/* <Route path="*" element={<NoMatch />} /> */}
    </Routes>
  );
};

export default AuthApp;
