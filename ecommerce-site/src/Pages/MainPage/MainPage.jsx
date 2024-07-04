import { useState, useEffect } from "react";
import Header from "../../components/global/Header/Header";
import Footer from "../../components/global/Footer/Footer";
import Carousel from "../../components/MainPage/Carousel/Carousel";
import "react-toastify/dist/ReactToastify.css";
import ProductCategory from "../../components/MainPage/ProductCategory/ProductCategory";
import ProductList from "../../components/MainPage/ProductList/ProductList";
import SideBar from "../../components/MainPage/SideBar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";
import { app, auth } from "../../utils/firebase";

const Layout = () => {
	const [count, setCount] = useState(0);
	const dispatch = useDispatch();

	const { isOpenFilter } = useSelector((state) => state.filter);

	const updateCartCount = (newCount) => {
		setCount(newCount);
	};

	const getCountFromDB = () => {
		const db = getDatabase();
		const auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				const cartRef = ref(db, `carts/${user.uid}`);
				get(cartRef)
					.then((snapshot) => {
						if (snapshot.exists()) {
							const cartData = snapshot.val();
							const numberOfItems = Object.keys(cartData).length;
							setCount(numberOfItems);
						} else {
							setCount(0);
						}
					})
					.catch((error) => {
						console.error("Error fetching cart:", error);
					});
			} else {
				console.log("User is not logged in.");
			}
		});
	};

	useEffect(() => {
		getCountFromDB(); // Fetch initial count from database on component mount
	}, []);

	return (
		<>
			<div className='overflow-x-hidden bg-gradient-to-tr from-slate-300 via-slate-200 to-slate-100 flex flex-col gap-3'>
				<Header cartCount={count} />{" "}
				{/* Pass count as cartCount prop */}
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
