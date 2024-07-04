import { getAuth, onAuthStateChanged } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { app } from "../../utils/firebase";

function CartButton({
	index,
	id,
	onRemoveItem,
	productQuantity,
	maxCartCount,
}) {
	const [productCount, setProductCount] = useState(productQuantity);
	let maxLimit;
	if (maxCartCount) {
		maxLimit = maxCartCount;
	} else {
		maxLimit = 10;
	}

	const addItem = (e, index, id) => {
		e.preventDefault();
		const db = getDatabase(app);
		const auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				const userId = user.uid;
				const cartRef = ref(db, `carts/${userId}`);
				get(cartRef).then((snapshot) => {
					if (snapshot.exists()) {
						let cart = snapshot.val();
						const selectedproduct = cart.filter(
							(item) => item.productId === id
						);

						console.log(selectedproduct);

						if (selectedproduct[0].qty < maxLimit) {
							selectedproduct[0].qty += 1;
							setProductCount(selectedproduct[0].qty);
						} else {
							toast(
								`More than ${maxLimit} items are not in stock`,
								{
									className: "toastify-style",
									toastId: "item-limit",
								}
							);
						}

						set(cartRef, cart)
							.then(() =>
								console.log("cart updated successfully")
							)
							.catch((err) => console.log("error:", err));
					}
				});
			}
		});
	};

	const removeItem = (e, index, id) => {
		e.preventDefault();
		const db = getDatabase(app);
		const auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				const userId = user.uid;
				const cartRef = ref(db, `carts/${userId}`);

				get(cartRef).then((snapshot) => {
					if (snapshot.exists()) {
						let cart = snapshot.val();
						let selectedproduct = cart.filter(
							(cart) => cart.productId === id
						);
						if (selectedproduct[0].qty > 1) {
							selectedproduct[0].qty -= 1;
							setProductCount(selectedproduct[0].qty);
							set(cartRef, cart)
								.then(() =>
									console.log("cart updated successfully")
								)
								.catch((err) => console.log("error:", err));
						} else {
							let newcart = cart.filter(
								(cart) => cart.productId != id
							);

							set(cartRef, newcart)
								.then(() => console.log("removed item"))
								.catch((err) => console.log(err));
							toast("Product is removed successfully", {
								className: "toastify-style",
								toastId: "item-removed",
							});
							onRemoveItem(id);
						}
					}
				});
			}
		});

		// let cartData = JSON.parse(localStorage.getItem("cart"));
		// if (productCount >= 0) {
		// 	if (productCount === 1) {
		// 		cartData.splice(index, 1);
		// 		localStorage.setItem("cart", JSON.stringify(cartData));
		// 		onRemoveItem(index);
		// 	} else {
		// 		setProductCount(productCount - 1);
		// 		cartData[index].productQuantity = parseInt(productCount - 1);
		// 		localStorage.setItem("cart", JSON.stringify(cartData));
		// 	}
		// }
	};

	return (
		<div>
			<ToastContainer />
			<div>
				<button
					className='border-2 border-slate-500 bg-slate-500 text-white w-4'
					onClick={(e) => addItem(e, index, id)}
				>
					+
				</button>
				<span>
					<input
						type='number'
						className='w-4 hover:border-0 focus:border-0 text-base font-medium text-center bg-white'
						value={productCount}
						style={{
							WebkitAppearance: "textfield",
							margin: 0,
							borderTop: "2px solid rgb(100 116 139)",
							borderBottom: "2px solid rgb(100 116 139)",
						}}
						onChange={(e) =>
							setProductCount(parseInt(e.target.value))
						}
					/>
				</span>
				<button
					className='border-2 border-slate-500 w-4  bg-slate-500 text-white'
					onClick={(e) => removeItem(e, index, id)}
				>
					-
				</button>
			</div>
		</div>
	);
}
export default CartButton;
