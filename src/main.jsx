import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Detail from "./detail.jsx";
import Panier from "./Panier.jsx";
import Aide from "./Aide.jsx";
import Commande from "./Commande.jsx";
import Compte from "./Compte.jsx";
import Decouvrir from "./Decouvrir.jsx";
import { CartProvider } from "./CartContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/aide" element={<Aide />} />
          <Route path="/commande" element={<Commande />} />
          <Route path="/compte" element={<Compte />} />
          <Route path="/decouvrir" element={<Decouvrir />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
