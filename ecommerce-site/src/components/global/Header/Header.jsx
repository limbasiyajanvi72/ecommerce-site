import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Trolly from "../../../assets/images/trolley.png";
import ROUTES from "../../../Constants/constant";
import Profile from "../../../assets/images/user_3237472.png";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { searchSliceActions } from "../../../redux/Slice/searchSlice";
import { useSelector } from "react-redux";
import "../../../index.css";

function Header(props) {
	const [login, setLogin] = useState();
	const navigate = useNavigate();
	const [isVisible, setIsVisible] = useState(false);
	const dispatch = useDispatch();
	const { productListData } = useSelector((state) => state.product);
	const [productNames, setProductNames] = useState();
	const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
	const [suggestion, setSuggestion] = useState();
	const [searchValue, setSearchValue] = useState();
	const [selectedIndex, setSelectedIndex] = useState();

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	useEffect(() => {
		let loginStatus = localStorage.getItem("token");
		setLogin(loginStatus);
	}, []);

	function showCart() {
		navigate(ROUTES.CART);
	}

	function navigateToLayout() {
		navigate("/");
	}

	function handleLogout() {
		localStorage.removeItem("token");
		setLogin(false);
		navigate("/");
	}

	const handleSearch = (e) => {
		const productName = productListData.map((product) => product.name);
		setProductNames(productName);
		let search = e.target.value;
		setSearchValue(search);

		setIsSuggestionOpen(true);
		dispatch(searchSliceActions.setSearchItems(search));
		let suggestionList = [];

		if (isSuggestionOpen === true && search) {
			productNames.map((product) => {
				if (product.includes(search)) {
					if (suggestionList.length < 5) {
						suggestionList.push(product);
					}
					setSuggestion(suggestionList);
				}
			});
		}
		if (search.length === 0) {
			setIsSuggestionOpen(false);
		}
	};

	const showProducts = (suggest) => {
		setSearchValue(suggest);
		console.log("search:", searchValue);
		productListData.map((product) => {
			if (product.name === suggest) {
				let detailProduct = product;
				let detailIndex = product.id;
				navigate(ROUTES.PRODUCTDETAILS, {
					state: { product: detailProduct, index: detailIndex },
				});
			}
		});
	};

	const handleKeyEvent = (e) => {
		if (e.key === "ArrowDown") {
			setSelectedIndex(0);
		}
	};

	const handleDownKey = (e, index) => {
		console.log(index);
		if (e.key === "ArrowDown") {
			console.log("down key");
			setSelectedIndex(index + 1);
		}
	};

	return (
		<nav className='bg-gradient-to-br from-slate-900 via-slate-700 to-indigo-800 fixed top-0 left-0 right-0 z-40 pb-[2px] shadow-color '>
			<div className='bg-slate-950 flex justify-between items-center  text-slate-300  px-6 min-[370px]:px-2  max-[640px]:px-2  shadow-color '>
				<div
					className='flex underline-logo cursor-pointer pt-2 logo-style '
					onClick={navigateToLayout}
				>
					<div className='text-4xl font-semibold pb-4'>A</div>

					<div className='text-xl font-semibold pt-3 sm:block md:block lg:block min-[370px]:hidden  max-[640px]:hidden'>
						MAZONA
					</div>
				</div>
				<div className='relative  '>
					<div className='absolute inset-y-0 left-0 flex items-center pl-2  '>
						<IoSearch className='text-gray-400 	' />
					</div>

					<input
						type='text'
						placeholder='Search'
						value={searchValue}
						className='bg-white border-slate-500 rounded-3xl pr-96 pl-8 py-1 border focus:outline-0 lg:pr-96 md:pr-64 sm:pr-32 min-[370px]:pr-3  max-[640px]:pr-3'
						onChange={(e) => handleSearch(e)}
						onKeyDown={(e) => {
							handleKeyEvent(e);
						}}
					/>
					{isSuggestionOpen && (
						<div className='absolute top-[33px] z-80 bg-slate-100 text-slate-900 text-base w-[598px]'>
							{suggestion &&
								suggestion.map((suggest, index) => (
									<div
										key={index}
										onClick={() => showProducts(suggest)}
										className={`cursor-default hover:bg-slate-300 pl-3 ${
											selectedIndex === index &&
											"bg-slate-300 "
										}`}
										onKeyDown={(e) =>
											handleDownKey(e, index)
										}
									>
										{suggest}
									</div>
								))}
						</div>
					)}
				</div>

				<div className='flex items-center justify-between gap-4'>
					{login && (
						<div className='cursor-pointer'>
							<span className='count'>{props.cartCount}</span>
							<img
								src={Trolly}
								alt='trolly'
								className='h-9 min-[370px]:w-6  max-[640px]:w-6 min-[370px]:h-6  max-[640px]:h-6  cart'
								onClick={showCart}
							/>
						</div>
					)}

					<div className='relative'>
						<div
							onClick={toggleVisibility}
							className='h-9 w-9 min-[370px]:w-6  max-[640px]:w-6 min-[370px]:h-6  max-[640px]:h-6'
						>
							<img src={Profile} alt='profile-icon' />
						</div>
						{isVisible ? (
							<div>
								<ul
									className='absolute drop-shadow-xl bg-white justify-center z-50'
									style={{ right: "60%", top: "140%" }}
								>
									{login ? (
										<div className='w-[130px] flex flex-col items-start gap-1 p-2 '>
											<button
												onClick={handleLogout}
												className='text-left cursor-pointer text-slate-800 text-base p-1 w-[110px] hover:bg-slate-600 hover:text-white border-1 rounded-md border-[#fff]'
											>
												Logout
											</button>
											<Link
												to={ROUTES.ADDPRODUCTS}
												className='text-left cursor-pointer text-slate-800 text-base p-1 flex w-[110px]  hover:bg-slate-600 hover:text-white border-1 rounded-md border-[#fff]'
											>
												Add product
											</Link>
										</div>
									) : (
										<div className='flex flex-col items-start gap-1 p-2 w-[80px]'>
											<div>
												<Link
													to={ROUTES.REGISTER}
													className='text-left cursor-pointer text-slate-800 text-base p-1 flex w-[65px]  hover:bg-slate-600 hover:text-white border-1 rounded-md border-[#fff]'
												>
													Register
												</Link>
											</div>
											<div>
												<Link
													to={ROUTES.LOGIN}
													className=' text-left cursor-pointer text-slate-800 text-base p-1 flex w-[65px]  hover:bg-slate-600 hover:text-white border-1 rounded-md border-[#fff]'
												>
													Login
												</Link>
											</div>
										</div>
									)}
								</ul>
								<div
									className='bg-transparent fixed inset-0 z-60'
									onClick={toggleVisibility}
								></div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Header;
