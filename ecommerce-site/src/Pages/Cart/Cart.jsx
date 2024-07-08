import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/global/Header/Header";
import Footer from "../../components/global/Footer/Footer";
import CartButton from "../../components/CartButton/CartButton";
import { useSelector } from "react-redux";
import { get, getDatabase, ref, set } from "firebase/database";
import { app, data } from "../../utils/firebase";
import { ToastContainer, toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Cart() {
	const [cartData, setCartData] = useState();
	const [count, setCount] = useState(0);
	const [loginStatus, setLoginStatus] = useState(false);
	const { searchItems } = useSelector((state) => state.search);
	const [productData, setProductData] = useState();
	const [cartItem, setCartItem] = useState();
	const [productBuy, setProductBuy] = useState();

	useEffect(() => {
		let token = localStorage.getItem("token");
		setLoginStatus(token);
		{
			!token &&
				toast("First login", {
					className: "toastify-style",
					toastId: "checkedLogin",
				});
		}
		const db = getDatabase(app);
		const auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				const userId = user.uid;
				const cartRef = ref(db, `carts/${userId}`);
				get(cartRef).then((snapshot) => {
					if (snapshot.exists()) {
						let data = snapshot.val();
						setCount(data.length);
						setCartData(data);
					} else {
						console.log("values are not there");
					}
				});
			}
		});

		const dataRef = ref(db, "product");
		get(dataRef).then((snapshot) => {
			if (snapshot.exists()) {
				setProductData(snapshot.val());
			}
		});
	}, []);

	useEffect(() => {
		if (cartData && productData) {
			const matchedItems = cartData.map((cartItemId) => {
				let products = productData.filter(
					(product) => product.id === cartItemId.productId
				);
				return { ...products[0], quantity: cartItemId.qty };
			});

			setCartItem(matchedItems);
		}
	}, [productData, cartData]);

	const filterCart = useCallback(() => {
		if (!cartItem) return;
		let filteredData = cartItem.filter((cart) =>
			cart.name.includes(searchItems)
		);
		setCartItem(filteredData);
	}, [searchItems]);

	const handleRemoveItem = (id) => {
		console.log("cartitems:::::", cartItem);
		let newcart = cartItem.filter((cart) => cart.id != id);
		setCount(newcart.length);
		setCartItem(newcart);
	};

	useEffect(() => {
		filterCart();
	}, [filterCart]);

	const buyNow = (e, price, id) => {
		var options = {
			key: "rzp_test_DOm6ar0I9tgeVk",
			key_secret: "QBkJ4Hn1dQUO4eVfhn55igmO",
			amount: parseInt(price * 100),
			currency: "INR",
			name: "Amazona",
			description: "for testing purpose",
			handler: function (response) {
				console.log(response);
				toast("Payment Successful", { className: "toastify-style" });
				setProductBuy(id);
			},

			theme: {
				color: "#0f172a",
			},
			modal: {
				backdropclose: false,
				ondismiss: function () {
					console.log("Payment modal closed");
				},
			},
		};

		var pay = new window.Razorpay(options);
		pay.open();
		console.log("product buy", id);
		let cartAfterPurchase = cartItem.filter((cart) => cart.id != id);
		setCartItem(cartAfterPurchase);

		const db = getDatabase(app);
		const auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			const userId = user.uid;
			const cartRef = ref(db, `carts/${userId}`);
			get(cartRef).then((snapshot) => {
				const cart = snapshot.val();
				let newcart = cart.filter((cart) => cart.productId != id);

				setCount(newcart.length);
				set(cartRef, newcart)
					.then(() => console.log("product remove from cart"))
					.catch((err) => console.log(err));
			});
		});
	};

	return (
		<>
			{!cartItem && (
				<div class='loader-container'>
					<div class='loader'></div>
				</div>
			)}
			<ToastContainer />

			{loginStatus && (
				<div>
					<Header cartCount={count} />
					<div className=' items-center flex flex-col   bg-slate-950'>
						{cartItem &&
							cartItem.map((data, index) => (
								<div className={index === 0 ? "pt-24" : ""}>
									<div
										key={index}
										className='  rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-800 p-[2px] m-3 '
									>
										<div className='block md:flex rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 p-2'>
											<div>
												<img
													src={data.image}
													alt={data.name}
													className='h-64 w-80 object-cover sm:mx-0 md:mx-0 lg:mx-0 sm:w-80 md:w-80 lg:w-80 rounded-3xl'
												/>
											</div>
											<div className='capitalize pl-2 lg:pl-5 text-slate-400 flex flex-col justify-between py-1 flex-nowrap w-80'>
												<div className='flex justify-between lg:flex lg:flex-col'>
													<div className='text-lg md:text-lg'>
														{data.name}
													</div>
													<div className='text-sm'>
														{data.company}
													</div>
												</div>
												<div className='flex justify-between md:flex md:flex-col'>
													<div className='text-base pr-1'>
														₹{data.price}
													</div>
													<div className='flex text-slate-400 text-left capitalize'>
														<div className='text-xs pt-1'>
															<span>
																M.R.P.:₹
															</span>
															<span className='line-through'>
																{data.price +
																	1000}
															</span>
														</div>
													</div>
												</div>
												<div className='text-sm   md:text-base'>
													<span className='inline-block '>
														{data.category.map(
															(category) => (
																<span
																	className='text-sm mr-1 bg-slate-950 rounded px-[3px]'
																	key={
																		category.index
																	}
																>
																	{category}
																	{"  "}
																</span>
															)
														)}
													</span>
												</div>

												<div className='flex  justify-between md:flex md:flex-col'>
													<div className='mt-3 mb-1'>
														<CartButton
															index={index}
															id={data.id}
															onRemoveItem={
																handleRemoveItem
															}
															productQuantity={
																data.quantity
															}
															maxCartCount={
																data.stock
															}
														/>
													</div>

													<button
														className='mt-2 w-32 inline rounded p-2 text-center bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 text-white font-semibold  shadow-color'
														onClick={(e) =>
															buyNow(
																e,
																data.price,
																data.id
															)
														}
													>
														Buy Now
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
					<Footer />
				</div>
			)}
		</>
	);
}

export default Cart;
