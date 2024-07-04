import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../Constants/constant";
import { SiWhatsapp } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { productSliceActions } from "../../../redux/Slice/productSlice";
import { filterSliceActions } from "../../../redux/Slice/filterSlice";
import { app } from "../../../utils/firebase"; // Import the initialized Firebase app
import {
	getDatabase,
	ref,
	get,
	set,
	update,
	onValue,
	orderByChild,
	push,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function ProductList({ updateCartCount }) {
	const navigate = useNavigate();
	const [countButton, setCountButton] = useState([]);
	const dispatch = useDispatch();
	const { productListData } = useSelector((state) => state.product);
	const [filterData, setFilterData] = useState();
	const [loading, setLoading] = useState(true);
	const {
		filterCompanyData,
		filterCategoryData,
		filterColorData,
		isPriceRangeSet,
		maxPrice,
		isColorCheck,
		isCompanyCheck,
		isCategoryCheck,
		isFreeDeliveryAvailable,
	} = useSelector((state) => state.filter);
	const { searchItems } = useSelector((state) => state.search);
	const [currentPage, setCurrentPage] = useState(1);
	const [updatedIndex, setUpdatedIndex] = useState({
		minIndex: 0,
		maxIndex: 9,
	});

	useEffect(() => {}, [currentPage]);

	const fetchData = async () => {
		const db = getDatabase(app);
		const dataRef = ref(db, "product");
		const snapshot = await get(dataRef);

		if (snapshot.exists()) {
			dispatch(
				productSliceActions.setProducts(Object.values(snapshot.val()))
			);
			setLoading(false);
		} else {
			alert("error");
			toast("Something went wrong!");
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		let companyList = [];
		Array.from(
			new Set(
				productListData &&
					productListData.map((product) => product.company)
			)
		).map((company, index) => {
			return companyList.push({ company: company, checked: false });
		});
		dispatch(filterSliceActions.setCompanyFilters(companyList));

		let catagories = [];
		productListData &&
			productListData.map((product) => {
				product.category &&
					product.category.map((category) => {
						catagories.push(category);
					});
			});
		let uniqueCategories = [...new Set(catagories)];
		let categoryList = uniqueCategories.map((category) => {
			return { category: category, checked: false };
		});
		dispatch(filterSliceActions.setCategoryFilters(categoryList));

		let colors = [];
		productListData &&
			productListData.map((product) => {
				product.colors &&
					product.colors.map((color) => {
						colors.push(color);
					});
			});
		let uniqueColors = [...new Set(colors)];
		let colorList = uniqueColors.map((color) => {
			return { color: color, checked: false };
		});

		dispatch(filterSliceActions.setColorFilters(colorList));

		let prices = [];
		let priceRange = [];
		productListData &&
			productListData.map((product) => prices.push(product.price));
		priceRange.push(Math.min(...prices));
		priceRange.push(Math.max(...prices));
		dispatch(filterSliceActions.setPriceRange(priceRange));
	}, [productListData, dispatch]);

	useEffect(() => {
		setFilterData(productListData.slice(0, 10));
	}, [productListData]);

	useEffect(() => {
		let searchData = [];
		productListData &&
			productListData.map((product) => {
				if (product.name && product.name.includes(searchItems)) {
					searchData.push(product);
				} else if (
					product.company &&
					product.company.includes(searchItems)
				) {
					searchData.push(product);
				}
			});
		setFilterData(searchData);
	}, [searchItems, productListData]);

	const applyFilter = useCallback(() => {
		let filterdata = [];
		if (isCategoryCheck) {
			let checkedCategories = filterCategoryData.filter(
				(item) => item.checked === true
			);

			let categoryNames = checkedCategories.map((item) => item.category);

			categoryNames.map((category) =>
				productListData.map((product) => {
					product.category.map((productCategory) => {
						if (productCategory === category) {
							filterdata.push(product);
						}
					});
				})
			);
			setFilterData(filterdata);
			dispatch(filterSliceActions.setIsCategoryChecked(false));
		} else if (isColorCheck) {
			let checkedColors = filterColorData.filter(
				(item) => item.checked === true
			);
			let colorNames = checkedColors.map((item) => item.color);

			colorNames.map((color) =>
				productListData.map((product) => {
					product.colors.map((productColor) => {
						if (productColor === color) {
							filterdata.push(product);
						}
					});
				})
			);
			setFilterData(filterdata);
			dispatch(filterSliceActions.setIsColorChecked(false));
		} else if (isPriceRangeSet) {
			productListData.forEach((product) => {
				if (product.price <= maxPrice) {
					filterdata.push(product);
					setFilterData(filterdata);
				}
			});
		} else if (isCompanyCheck) {
			let checkedCompanies = filterCompanyData.filter(
				(item) => item.checked === true
			);
			let companyNames = checkedCompanies.map((item) => item.company);
			companyNames.map((company) =>
				productListData.map((product) => {
					if (product.company === company) {
						filterdata.push(product);
					}
				})
			);
			setFilterData(filterdata);
			dispatch(filterSliceActions.setIsCompanyChecked(false));
		} else if (isFreeDeliveryAvailable) {
			productListData.map((product) => {
				if ("shipping" in product) {
					filterdata.push(product);
				}
			});
			setFilterData(filterdata);
		}
	}, [
		dispatch,
		isCompanyCheck,
		filterCompanyData,

		isCategoryCheck,
		filterCategoryData,

		isColorCheck,
		filterColorData,

		maxPrice,
		isPriceRangeSet,

		isFreeDeliveryAvailable,
		productListData,
	]);

	useEffect(() => {
		applyFilter();
	}, [applyFilter]);

	const handleAddCart = async (e, item, index) => {
		e.preventDefault();
		let loginStatus = localStorage.getItem("token");
		{
			!loginStatus &&
				toast("First login", {
					className: "toastify-style",
					toastId: "checkedLogin",
				});
		}
		// let cartLocalData = JSON.parse(localStorage.getItem("cart")) || [];

		// let isDuplicate = cartLocalData.some(
		// 	(cartItem) => cartItem.id === item.id
		// );

		// if (
		// 	isDuplicate &&
		// 	!toast.isActive("checkedLogin") &&
		// 	!toast.isActive("itemExist")
		// ) {
		// 	toast("Item already exists in the cart.", {
		// 		className: "toastify-style",
		// 		toastId: "itemExist",
		// 	});
		// 	return;
		// }

		// if (cartLocalData.length >= 5 && !toast.isActive("checkedLogin")) {
		// 	toast("You cannot add more than 5 items.", {
		// 		className: "toastify-style",
		// 		toastId: "more than 5 items",
		// 	});
		// 	return;
		// }
		// if (cartLocalData.length <= 5 && loginStatus) {
		// 	cartLocalData.push(item);
		// }

		// let cartWithQty = cartLocalData.map((cart, index) => ({
		// 	...cart,
		// 	productQuantity: 1,
		// }));

		// localStorage.setItem("cart", JSON.stringify(cartWithQty));
		// let cartButtonData = JSON.parse(localStorage.getItem("cart")) || [];
		// let currentIndex = index;
		// cartButtonData.forEach((data) => {
		// 	if (data.id === item.id) {
		// 		setCountButton((prevIndex) => [...prevIndex, currentIndex]);
		// 	}
		// });
		// if (countButton.includes(index)) {
		// 	navigate(ROUTES.CART);
		// }
		// updateCartCount(cartButtonData.length);
		const db = getDatabase(app);
		const auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				const userId = user.uid;
				const cartRef = ref(db, `carts/${userId}`);

				get(cartRef)
					.then((snapshot) => {
						if (snapshot.exists()) {
							addProductToCart(userId, item.id);
						} else {
							createCartAndAddProduct(userId, item.id);
						}
					})
					.catch((error) => {
						console.error("Error checking user's cart:", error);
					});
			} else {
				console.log("User is not signed in");
			}
		});

		function addProductToCart(userId, itemId) {
			const cartRef = ref(db, `carts/${userId}`);

			get(cartRef).then((snapshot) => {
				const cartData = snapshot.val();
				if (snapshot.exists()) {
					const cartData = snapshot.val();
					const numberOfItems = Object.keys(cartData).length;
					updateCartCount(numberOfItems);
				}

				if (cartData) {
					const itemExists = Object.values(cartData).some(
						(item) => item.productId === itemId
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
							productId: itemId,
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
						productId: itemId,
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

		function createCartAndAddProduct(userId, itemId) {
			set(ref(db, `carts/${userId}/0`), {
				productId: itemId,
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
	const showProductDetails = (item, id, e) => {
		e.preventDefault();
		navigate(ROUTES.PRODUCTDETAILS, {
			state: { product: item, index: id },
		});
	};
	const openWhatsApp = () => {
		const phoneNumber = "8141482240";
		const message = "Hello from Amazona!";
		const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
			message
		)}`;
		window.open(url, "_blank");
	};

	function toggleSidebar() {
		dispatch(filterSliceActions.setIsOpenFilter(true));
	}

	useEffect(() => {
		switch (currentPage) {
			case 1:
				setUpdatedIndex({ ...updatedIndex, minIndex: 0, maxIndex: 9 });
				break;
			case 2:
				setUpdatedIndex({
					...updatedIndex,
					minIndex: 10,
					maxIndex: 19,
				});
				break;
			case 3:
				setUpdatedIndex({
					...updatedIndex,
					minIndex: 20,
					maxIndex: 29,
				});
				break;
			case 4:
				setUpdatedIndex({
					...updatedIndex,
					minIndex: 30,
					maxIndex: 39,
				});
				break;

			default:
				return;
		}
	}, [currentPage]);
	// const setData = () => {
	// 	switch (currentPage) {
	// 		case 1:
	// 			setUpdatedIndex({ ...updatedIndex, minIndex: 0, maxIndex: 9 });
	// 			break;
	// 		case 2:
	// 			setUpdatedIndex({
	// 				...updatedIndex,
	// 				minIndex: 10,
	// 				maxIndex: 19,
	// 			});
	// 			break;
	// 		case 3:
	// 			setUpdatedIndex({
	// 				...updatedIndex,
	// 				minIndex: 20,
	// 				maxIndex: 29,
	// 			});
	// 			break;
	// 		case 4:
	// 			setUpdatedIndex({
	// 				...updatedIndex,
	// 				minIndex: 30,
	// 				maxIndex: 39,
	// 			});
	// 			break;

	// 		default:
	// 			return;
	// 	}
	// };

	const skeletonsArray = Array.from({ length: 6 }, (index) => index);

	return (
		<>
			{loading ? (
				<div className='flex flex-wrap gap-x-10 gap-y-28 justify-center items-center m-24'>
					{skeletonsArray.map((item, index) => (
						<div
							key={index}
							className='flex flex-col gap-3 animate-pulse'
						>
							<div className='bg-slate-400 w-96 h-64 '></div>
							<div className='bg-slate-400 w-48 h-4'></div>
							<div className='bg-slate-400 w-80 h-4'></div>
						</div>
					))}
				</div>
			) : (
				<div>
					<ToastContainer />
					<button
						className='bg-slate-600 text-white rounded p-1 ml-28 mt-14 sm:ml-28 md:ml-44'
						onClick={toggleSidebar}
					>
						Apply Filter
					</button>
					<div className='flex flex-wrap gap-x-10 gap-y-28 justify-center items-center my-24  flex-none'>
						{filterData &&
							filterData.map(
								(item, index) =>
									index >= updatedIndex.minIndex &&
									index <= updatedIndex.maxIndex && (
										<div
											key={item.id}
											className='relative w-96 group'
										>
											<img
												src={item.image}
												alt={item.name}
												className='h-72 min-w-[384px] object-cover rounded-3xl shadow-lg z-20 opacity-90 cursor-pointer transition-transform duration-300 transform group-hover:-translate-y-12 '
												onClick={(e) =>
													showProductDetails(
														item,
														index,
														e
													)
												}
											/>

											<button
												onClick={openWhatsApp}
												className='absolute top-5 right-5 z-10 bg-white rounded p-1 shadow h-6 w-6  text-slate-500 '
											>
												<SiWhatsapp />
											</button>

											<div className='mx-5 p-3 flex flex-col absolute bottom-12 left-0 right-0 z-10 capitalize'>
												<span className='font-bold text-white'>
													{item.name}
												</span>
												<div className='flex justify-between'>
													<span className='font-medium text-base text-white'>
														{item.company}
													</span>
													<button
														className='bg-slate-800 rounded-md text-white p-1 shadow-xl text-sm'
														onClick={(e) =>
															handleAddCart(
																e,
																item,
																index
															)
														}
													>
														{countButton.includes(
															index
														) ? (
															<div>
																Go to cart
															</div>
														) : (
															<div>
																Add to cart
															</div>
														)}
													</button>
												</div>
											</div>

											<div className='absolute -bottom-12 text-lg xl:text-lg bg-slate-100 mx-5 p-3 text-slate-500 capitalize z-30 rounded-3xl shadow-xl flex flex-col gap-1'>
												<div className=' flex justify-between '>
													<div className='flex flex-col gap-1'>
														<div className='text-sm '>
															{item.description
																.substring(
																	0,
																	60
																)
																.trim()}
															...
														</div>
													</div>
													<div>
														<div className='text-slate-800 text-base text-end'>
															₹{item.price}
														</div>
														<div className='flex text-slate-500 text-xs capitalize flex-nowrap '>
															<span>M.R.P.:</span>
															<span className='line-through'>
																₹
																{item.price +
																	1000}
															</span>
														</div>
													</div>
												</div>
												<div className='flex gap-[10px] h-auto flex-wrap'>
													{item.category &&
														item.category.map(
															(
																category,
																index
															) => {
																return (
																	index <
																		2 && (
																		<div
																			className='text-xs bg-gray-200 max-w-max rounded p-[2px] font-medium text-slate-600 '
																			key={
																				index
																			}
																		>
																			{
																				category
																			}
																		</div>
																	)
																);
															}
														)}
													<div
														className='text-xs font-medium cursor-pointer'
														onClick={(e) =>
															showProductDetails(
																item,
																index,
																e
															)
														}
													>
														show more...
													</div>
												</div>
											</div>

											<div className='product-wrapper transition-transform duration-300 transform group-hover:-translate-y-12 pointer-events-none'></div>
										</div>
									)
							)}
					</div>

					<div className='flex justify-center  my-28 py-2 px-4  '>
						<div className=' shadow-inner p-2  rounded-md flex gap-2 bg-gradient-to-l from-slate-100 via-white to-slate-100 mix-blend-multiply '>
							<button
								className='h-12 w-12 shadow-xl text-3xl rounded-md bg-slate-200 text-slate-500'
								value={1}
								onClick={() => {
									setCurrentPage(1);
								}}
							>
								1
							</button>
							<button
								className='h-12 w-12 shadow-xl text-3xl rounded-md bg-slate-200 text-slate-500'
								value={2}
								onClick={() => {
									setCurrentPage(2);
								}}
							>
								2
							</button>
							<button
								className='h-12 w-12 shadow-xl text-3xl rounded-md bg-slate-200 text-slate-500'
								value={3}
								onClick={() => {
									setCurrentPage(3);
								}}
							>
								3
							</button>
							<button
								className='h-12 w-12 shadow-xl text-3xl rounded-md bg-slate-200 text-slate-500'
								value={4}
								onClick={() => {
									setCurrentPage(4);
								}}
							>
								4
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
export default ProductList;
