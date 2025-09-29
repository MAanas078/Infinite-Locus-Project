import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Signup from "./components/Signup.js";
import Login from "./components/Login.js";
import LostItems from "./components/LostItems.js";
import FoundItems from "./components/FoundItems.js";
import Home from "./components/Home.js";
import ItemPage from "./components/ItemPage.js";
import LostItem from "./components/Lost_item.js";
import MyListings from "./components/MyListings.js";
import Admin from "./components/Admin.js";
import Layout from "./layout.js"; 

window.OneSignal = window.OneSignal || [];
const OneSignal = window.OneSignal;
function App() {
 
  
  return (
      <BrowserRouter>
          <Layout>
          <Routes>

          <Route path="/" element={<Home />}  />
          <Route path="/admin" element={<Admin />}  />
          <Route path="/log-in" element={<Login/>} />
          <Route path="/sign-up" element={<Signup/>} />
          <Route path="/lostitems" element={<LostItems/>} />
          <Route path="/founditems" element={<FoundItems/>} />
          <Route path="/postitem" element={<LostItem/>} />
          <Route path="/mylistings" element={<MyListings/>} />
          <Route path="/:item" element={<ItemPage/>} />
          <Route path="/*" element={<Home/>} />
          </Routes>
          <ToastContainer />
          </Layout>
      </BrowserRouter>

  );
}

export default App;
