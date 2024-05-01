import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/global/Header/Header";
import Footer from "../../components/global/Footer/Footer";
import CartButton from "../../components/CartButton/CartButton";
import { useSelector } from "react-redux";

function Cart() {
	const [cartData, setCartData] = useState();
	const [count, setCount] = useState(0);
	const [loginStatus, setLoginStatus] = useState(false);
	const { searchItems } = useSelector((state) => state.search);

	useEffect(() => {
		let data = JSON.parse(localStorage.getItem("cart"));
		setCartData(data);

		let cartLocalData = JSON.parse(localStorage.getItem("cart")) || [];
		let countlocal = Object.keys(cartLocalData).length;
		setCount(countlocal);

		let quantity = [];
		cartLocalData.map((cart) => {
			let qty = cart.productQuantity;
			quantity.push(qty);
		});

		let loginstatus = JSON.parse(localStorage.getItem("loginstatus"));
		setLoginStatus(loginstatus);
	}, []);

	const filterCart = useCallback(() => {
		if (!cartData) return;
		let filteredData = cartData.filter((cart) =>
			cart.name.includes(searchItems)
		);
		setCartData(filteredData);
	}, [searchItems, cartData]);

	const handleRemoveItem = (index) => {
		const updatedCartData = [...cartData];
		updatedCartData.splice(index, 1);
		setCartData(updatedCartData);
		localStorage.setItem("cart", JSON.stringify(updatedCartData));
		setCount(updatedCartData.length);
	};

	useEffect(() => {
		filterCart();
	}, [filterCart]);

	return (
		<>
			{loginStatus && (
				<div>
					<Header cartCount={count} />
					<div className=' items-center flex flex-col mt-24'>
						{cartData &&
							cartData.map((data, index) => (
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
									<div className='capitalize pl-5 text-slate-700 flex flex-col flex-nowrap w-72'>
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
												{data.category}
											</span>
										</div>
										<div className='flex'>
											<div className='text-base pr-1'>
												₹{data.price}
											</div>
											<div className='flex text-slate-500 text-left capitalize'>
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
											onRemoveItem={handleRemoveItem}
											productQuantity={
												data.productQuantity
											}
											maxCartCount={data.max_cart_count}
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
