import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate 
} from 'react-router-dom';
import Checkout from "./scenes/checkout/Checkout";
import Confirmation from "./scenes/checkout/Confirmation";
import CartMenu from "./scenes/global/CartMenu";
import Navbar from "./scenes/global/Navbar";
import Home from "./scenes/home/Home"
import ItemDetails from "./scenes/itemDetails/itemDetails";
import Footer from "./scenes/global/Footer"

import Profile from "./components/Profile/Profile.jsx";
import SocialCards from "./SocialCards/SocialCards.jsx";
import { getToken } from "./helpers.js";
import SignIn from "./scenes/SignIn/SignIn";
import SignUp from "./scenes/SignUp/SignUp";
import FavouriteList from "./scenes/home/FavouriteList.jsx";

const ScrollTotop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  return null;
}

function App() {
  return (<div className="app">
    <BrowserRouter>
    <Navbar />
      <ScrollTotop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="item/:itemId" element={<ItemDetails />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout/success" element={<Confirmation/>} />
        <Route path="/social" element={<SocialCards />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/favorite" element={<FavouriteList />} />
        <Route
            path="/profile"
            element={getToken() ? <Profile /> : <Navigate to="/signin" />}
          />
      </Routes>
      
      <CartMenu></CartMenu>
      <Footer />
    </BrowserRouter>

  </div>
  );
}

export default App;
