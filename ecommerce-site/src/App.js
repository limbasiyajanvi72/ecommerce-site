import React from "react";
import MainPage from "./Pages/MainPage/MainPage";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Verify from "./Pages/Verify";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart/Cart";
import ROUTES from "../src/Constants/constant";
import { AddProduct } from "./Pages/AddProduct";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path={ROUTES.LOGIN} element={<Login />} />
				<Route path={ROUTES.REGISTER} element={<Register />} />
				<Route path={ROUTES.VERIFY} element={<Verify />} />
				{/* <Route path={ROUTES.EDIT} element={<Register />} /> */}
				<Route
					path={ROUTES.PRODUCTDETAILS}
					element={<ProductDetails />}
				/>
				<Route path={ROUTES.CART} element={<Cart />} />
				<Route path={ROUTES.ADDPRODUCTS} element={<AddProduct />} />
			</Routes>
		</BrowserRouter>
	);
}
export default App;
