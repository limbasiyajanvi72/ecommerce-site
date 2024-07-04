import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/global/Header/Header";
import Footer from "../../components/global/Footer/Footer";
import CartButton from "../../components/CartButton/CartButton";
import { useSelector } from "react-redux";
import { get, getDatabase, ref } from "firebase/database";
import { app } from "../../utils/firebase";
import { ToastContainer, toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Cart() {
	const [cartData, setCartData] = useState();
	const [count, setCount] = useState(0);
	const [loginStatus, setLoginStatus] = useState(false);
	const { searchItems } = useSelector((state) => state.search);
	const [productData, setProductData] = useState();
	const [cartItem, setCartItem] = useState();

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
			const matchedItems = Object.keys(cartData).map((cartItemId) => {
				return {
					...productData[cartItemId],
					quantity: cartData[cartItemId].qty,
				};
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

	return (
		<>
			<ToastContainer />
			{loginStatus && (
				<div>
					<Header cartCount={count} />
					<div className=' items-center flex flex-col mt-24 '>
						{cartItem &&
							cartItem.map((data, index) => (
								<div
									key={index}
									className='flex border border-slate-300 p-3 m-3 lg:w-2/5 md:w-3/5 sm:w-4/5 min-[370px]:w-full min-[370px]:p-1 max-[640px]:w-4/5 max-[640px]:m-3'
								>
									<div>
										<img
											src={data.image}
											alt={data.name}
											className='h-64 w-80 border object-cover sm:mx-0 md:mx-0 lg:mx-0 sm:w-80 md:w-80 lg:w-80'
										/>
									</div>
									<div className='capitalize pl-5 text-slate-400 flex flex-col flex-nowrap w-72'>
										<div className='text-base font-semibold md:text-lg'>
											{data.name}
										</div>
										<div className='text-sm font-bold '>
											{data.company}
										</div>
										<div className='text-sm font-semibold  md:text-base'>
											<span className='inline-block'>
												Category:
											</span>
											<span className='inline-block'>
												{data.category.map(
													(category) => (
														<span>
															{category} |{" "}
														</span>
													)
												)}
											</span>
										</div>
										<div className='flex'>
											<div className='text-base pr-1'>
												₹{data.price}
											</div>
											<div className='flex text-slate-400 text-left capitalize'>
												<div className='text-xs pt-1'>
													<span>M.R.P.:₹</span>
													<span className='line-through'>
														{data.price + 1000}
													</span>
												</div>
											</div>
										</div>
										<CartButton
											index={index}
											id={data.id}
											onRemoveItem={handleRemoveItem}
											productQuantity={data.quantity}
											maxCartCount={data.stock}
										/>
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
