import React, { useEffect, useState } from "react";
import Header from "../components/global/Header/Header";
import Footer from "../components/global/Footer/Footer";
import { useLocation } from "react-router-dom";
import Trolly from "../../src/assets/images/trolley.png";
import { useParams } from "react-router-dom";

function ProductDetails() {
	const location = useLocation();
	const data = location.state.product;
	const index = location.state.index;
	const [count, setCount] = useState(0);
	useEffect(() => {
		updateCart();
	}, []);

	const addToCart = (e) => {
		e.preventDefault();
		let loginStatus = JSON.parse(localStorage.getItem("loginstatus"));
		if (!loginStatus) {
			alert("First login");
		} else {
			let cartLocalData = JSON.parse(localStorage.getItem("cart")) || [];

			let isDuplicate = cartLocalData.some(
				(cartItem) => cartItem.id === data.id
			);

			if (isDuplicate) {
				alert("Item already exists in the cart.");
				return;
			}

			if (cartLocalData.length >= 5) {
				alert("You cannot add more than 5 items.");
				return;
			}
			cartLocalData.push(data);
			let cartWithQty = cartLocalData.map((cart, index) => ({
				...cart,
				productQuantity: 1,
			}));

			localStorage.setItem("cart", JSON.stringify(cartWithQty));
		}
		updateCart();
	};

	function updateCart() {
		let cartLocalData = JSON.parse(localStorage.getItem("cart")) || [];
		let countlocal = Object.keys(cartLocalData).length;
		setCount(countlocal);
	}

	return (
		<>
			<div>
				<Header cartCount={count} />
				<section>
					<div>
						<div className='flex py-12 justify-center mt-20'>
							<div>
								<img
									className='h-[410px] w-[410px] mr-12 object-cover'
									src={data.image}
									alt={data.name}
								/>
							</div>
							<div>
								<div className='capitalize text-4xl font-semibold'>
									{data.name}
								</div>
								<div className='w-96 text-justify block'>
									<div className='text-xl font-medium '>
										About:
									</div>
									<span className='font-normal'>
										{data.description.substring(0, 200)}
									</span>
									<hr className='my-3 border-1' />
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
										<div className='text-slate-700 text-sm	'>
											{data.shipping && (
												<div className=' font-medium '>
													Free Delivery
												</div>
											)}
										</div>
										<div className='text-slate-700 text-sm flex 	gap-1'>
											<span className='font-medium'>
												Category:
											</span>
											<div className='flex gap-1 flex-wrap capitalize'>
												{data.category.map(
													(category, index) => (
														<span key={index}>
															{category}
														</span>
													)
												)}
											</div>
										</div>
									</div>
									<hr className='my-3 border-1' />
									<div className='flex justify-between mt-1'>
										<button className='  h-12 w-48 border rounded-md border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600'>
											Buy Now
										</button>
										<button
											className='flex h-12 border border-1 rounded-md border-slate-500 w-40 hover:border-black'
											onClick={(e) => addToCart(e)}
										>
											<img
												src={Trolly}
												alt='trolly'
												className='h-7 w-7 m-2'
											/>
											<span className='m-2 pt-1 font-semibold text-slate-700 '>
												Add to Cart
											</span>
										</button>
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
