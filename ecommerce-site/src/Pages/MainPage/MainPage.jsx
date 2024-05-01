import { useState } from "react";
import { useEffect } from "react";
import Header from "../../components/global/Header/Header";
import Footer from "../../components/global/Footer/Footer";
import Carousel from "../../components/MainPage/Carousel/Carousel";
import "react-toastify/dist/ReactToastify.css";
import ProductCategory from "../../components/MainPage/ProductCategory/ProductCategory";
import ProductList from "../../components/MainPage/ProductList/ProductList";
import SideBar from "../../components/MainPage/SideBar/SideBar";
import { useSelector } from "react-redux";

const Layout = () => {
	const [count, setCount] = useState();
	const { isOpenFilter } = useSelector((state) => state.filter);
	useEffect(() => {
		updateCart();
	}, []);

	function updateCart() {
		let cartLocalData = JSON.parse(localStorage.getItem("cart")) || [];
		let countlocal = Object.keys(cartLocalData).length;
		setCount(countlocal);
	}
	const updateCartCount = (newCount) => {
		setCount(newCount);
	};

	return (
		<>
			<div className='overflow-x-hidden bg-gradient-to-tr from-slate-300 via-slate-200 to-slate-100 flex flex-col gap-3'>
				<Header cartCount={count} />
				<ProductCategory />
				<Carousel />
				<ProductList updateCartCount={updateCartCount} />
				<Footer />
				{isOpenFilter ? <SideBar /> : null}
			</div>
		</>
	);
};

export default Layout;
