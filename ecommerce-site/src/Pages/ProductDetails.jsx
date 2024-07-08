import React, { useEffect, useState } from "react";
import Header from "../components/global/Header/Header";
import Footer from "../components/global/Footer/Footer";
import { useLocation } from "react-router-dom";
import Trolly from "../../src/assets/images/trolley.png";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { app } from "../utils/firebase";

function ProductDetails() {
	const location = useLocation();
	const data = location.state.product;
	const index = location.state.index;
	const [count, setCount] = useState(0);

	useEffect(() => {
		let token = localStorage.getItem("token");
		if (token) {
			const db = getDatabase(app);
			const auth = getAuth();
			onAuthStateChanged(auth, (user) => {
				const userId = user.uid;
				const cartRef = ref(db, `carts/${userId}`);

				get(cartRef).then((snapshot) => {
					if (snapshot.exists()) {
						let updatedCount = snapshot.val().length;
						setCount(updatedCount);
					}
				});
			});
		}
	}, []);

	const addToCart = (e, product) => {
		e.preventDefault();
		const db = getDatabase(app);
		const auth = getAuth();
		let token = localStorage.getItem("token");
		if (token) {
			onAuthStateChanged(auth, (user) => {
				const userId = user.uid;
				const cartRef = ref(db, `carts/${userId}`);

				get(cartRef).then((snapshot) => {
					if (snapshot.exists()) {
						addProductToCart(userId, product);
					} else {
						createCartAndAddProduct(userId, product);
					}
				});
			});
		} else {
			if (!toast.isActive("login")) {
				toast("You are not logged in", {
					className: "toastify-style",
					toastId: "login",
				});
			}
		}

		function addProductToCart(userId, product) {
			const cartRef = ref(db, `carts/${userId}`);

			get(cartRef).then((snapshot) => {
				const cartData = snapshot.val();
				if (snapshot.exists()) {
					const cartData = snapshot.val();
					const numberOfItems = Object.keys(cartData).length;
					setCount(numberOfItems);
				}

				if (cartData) {
					const itemExists = Object.values(cartData).some(
						(item) => item.productId === product.id
					);

					if (itemExists) {
						toast("Item already exists in the cart.", {
							className: "toastify-style",
							toastId: "itemExist",
						});
					} else {
						// Add the new item to the cart
						const newItemIndex = Object.keys(cartData).length;
						const newItemRef = ref(
							db,
							`carts/${userId}/${newItemIndex}`
						);
						set(newItemRef, {
							productId: product.id,
							name: product.name,
							qty: 1,
						})
							.then(() => {
								toast("Item is added to cart successfully.", {
									className: "toastify-style",
									toastId: "success-add-cart",
								});
							})
							.catch((error) => {
								console.error(
									"Error adding item to cart:",
									error
								);
							});
					}
				} else {
					const newItemRef = ref(db, `carts/${userId}/0`);
					set(newItemRef, {
						productId: product.id,
						name: product.name,
						qty: 1,
					})
						.then(() => {
							toast("Item is added to cart successfully.", {
								className: "toastify-style",
								toastId: "success-add-cart",
							});
						})
						.catch((error) => {
							console.error("Error adding item to cart:", error);
						});
				}
			});
		}

		function createCartAndAddProduct(userId, item) {
			set(ref(db, `carts/${userId}/0`), {
				productId: item.id,
				name: item.name,
				qty: 1,
			})
				.then(() => {
					console.log("Cart created and item added successfully");
				})
				.catch((error) => {
					console.error(
						"Error creating cart and adding item:",
						error
					);
				});
		}
	};

	const buyNow = (e, id, price) => {
		e.preventDefault();

		let token = localStorage.getItem("token");

		if (token) {
			const db = getDatabase(app);
			const auth = getAuth();

			onAuthStateChanged(auth, (user) => {
				const userId = user.uid;
				const cartRef = ref(db, `carts/${userId}`);
				get(cartRef).then((snapshot) => {
					if (snapshot.exists()) {
						let data = snapshot.val();
						let product = data.filter(
							(product) => product.productId != id
						);
						setCount(product.length);

						var options = {
							key: "rzp_test_DOm6ar0I9tgeVk",
							key_secret: "QBkJ4Hn1dQUO4eVfhn55igmO",
							amount: parseInt(price * 100),
							currency: "INR",
							name: "Amazona",
							description: "for testing purpose",
							handler: function (response) {
								console.log(response);
								toast("Payment Successful", {
									className: "toastify-style",
									toastId: "success",
								});
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

						set(cartRef, product)
							.then(() => console.log("product remove from cart"))
							.catch((err) => console.log(err));
					}
				});
			});
		} else {
			if (!toast.isActive("login-check")) {
				toast("You are not logged in", {
					className: "toastify-style",
					toastId: "login-check",
				});
			}
		}

		const db = getDatabase(app);
		const auth = getAuth();
	};

	return (
		<>
			<ToastContainer />
			<div>
				<Header cartCount={count} />
				<section className='bg-slate-950'>
					<div>
						<div className='flex flex-col items-center gap-5 md:flex lg:flex-row lg:gap-12  lg:justify-center pt-24 py-12'>
							<div>
								<img
									className='w-[90%] m-auto lg:h-[410px] lg:w-[410px]  lg:object-cover rounded-3xl'
									src={data.image}
									alt={data.name}
								/>
							</div>
							<div className='flex flex-col justify-between gap-1 p-4'>
								<div className='capitalize text-4xl font-medium'>
									{data.name}
								</div>
								<div className=' lg:w-96 lg:text-justify block'>
									<span className='text-base'>
										{data.description.substring(0, 200)}
									</span>
								</div>
								<hr className='my-3 border-1' />
								<div>
									<div className='flex'>
										<span className='text-3xl'>
											₹{data.price}
										</span>
										<div className='text-lg pt-1 pl-3 text-slate-500'>
											<span>M.R.P.:₹</span>
											<span className='line-through'>
												{data.price + 1000}
											</span>
										</div>
									</div>
									<div>
										{index % 4 === 0 ? (
											<div className='rounded-lg  '>
												<div className='inline-flex items-center'>
													<span>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															viewBox='0 0 24 24'
															fill='currentColor'
															className='w-6 h-6 text-yellow-400 cursor-pointer'
														>
															<path
																fillRule='evenodd'
																d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
																clipRule='evenodd'
															></path>
														</svg>
													</span>
													<span>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															viewBox='0 0 24 24'
															fill='currentColor'
															className='w-6 h-6 text-yellow-400 cursor-pointer'
														>
															<path
																fillRule='evenodd'
																d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
																clipRule='evenodd'
															></path>
														</svg>
													</span>
													<span>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															viewBox='0 0 24 24'
															fill='currentColor'
															className='w-6 h-6 text-yellow-400 cursor-pointer'
														>
															<path
																fillRule='evenodd'
																d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
																clipRule='evenodd'
															></path>
														</svg>
													</span>
													<span>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															viewBox='0 0 24 24'
															fill='currentColor'
															className='w-6 h-6 text-yellow-400 cursor-pointer'
														>
															<path
																fillRule='evenodd'
																d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
																clipRule='evenodd'
															></path>
														</svg>
													</span>
													<span>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															fill='none'
															viewBox='0 0 24 24'
															strokeWidth='1.5'
															stroke='currentColor'
															className='w-6 h-6 cursor-pointer text-yellow-500'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
															></path>
														</svg>
													</span>
												</div>
											</div>
										) : (
											<div className='inline-flex items-center'>
												<span>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 24 24'
														fill='currentColor'
														className='w-6 h-6 text-yellow-400 cursor-pointer'
													>
														<path
															fillRule='evenodd'
															d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
															clipRule='evenodd'
														></path>
													</svg>
												</span>
												<span>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 24 24'
														fill='currentColor'
														className='w-6 h-6 text-yellow-400 cursor-pointer'
													>
														<path
															fillRule='evenodd'
															d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
															clipRule='evenodd'
														></path>
													</svg>
												</span>
												<span>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 24 24'
														fill='currentColor'
														className='w-6 h-6 text-yellow-400 cursor-pointer'
													>
														<path
															fillRule='evenodd'
															d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
															clipRule='evenodd'
														></path>
													</svg>
												</span>
												<span>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 24 24'
														fill='currentColor'
														className='w-6 h-6 text-yellow-400 cursor-pointer'
													>
														<path fillRule='evenodd'></path>
													</svg>
												</span>
												<span>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 24 24'
														fill='currentColor'
														className='w-6 h-6 text-yellow-400 cursor-pointer'
													>
														<path fillRule='evenodd'></path>
													</svg>
												</span>
											</div>
										)}
									</div>
									<div>
										{data.colors &&
											data.colors.map((color) => (
												<span
													key={color}
													style={{
														backgroundColor: color,
														color: color,
													}}
													className='h-6 w-6 p-1 m-1 border rounded-full inline-block'
												></span>
											))}
									</div>
									<div className='justify-start'>
										<div className='text-slate-400 text-sm	'>
											{data.shipping && (
												<div className=' font-medium p-1'>
													Free Delivery
												</div>
											)}
										</div>
										<div className='text-slate-400 text-sm flex 	gap-1'>
											<div className='flex gap-1 flex-wrap capitalize'>
												{data.category.map(
													(category, index) => (
														<span
															key={index}
															className='text-sm mr-1 bg-slate-800 rounded px-[3px]'
														>
															{category}
														</span>
													)
												)}
											</div>
										</div>
									</div>
									<hr className='my-3 border-1' />
									<div className='flex justify-between mt-1'>
										<button
											className='h-12  w-40 inline rounded p-2 text-center bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 text-white font-semibold  shadow-color'
											onClick={(e) =>
												buyNow(e, data.id, data.price)
											}
										>
											Buy Now
										</button>
										<div className='rounded bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-800 p-[2px] '>
											<button
												className='flex h-12 w-40  rounded bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 '
												onClick={(e) =>
													addToCart(e, data)
												}
											>
												<img
													src={Trolly}
													alt='trolly'
													className='h-7 w-7 m-2'
												/>
												<span className='m-2 pt-1 font-semibold text-slate-300 '>
													Add to Cart
												</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<Footer />
			</div>
		</>
	);
}

export default ProductDetails;
