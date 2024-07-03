import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CartButton({ index, onRemoveItem, productQuantity, maxCartCount }) {
	const [productCount, setProductCount] = useState(productQuantity);
	let maxLimit;
	if (maxCartCount) {
		maxLimit = maxCartCount;
	} else {
		maxLimit = 10;
	}

	const addItem = (e, index) => {
		e.preventDefault();
		if (productCount < maxLimit) {
			setProductCount(productCount + 1);
		} else {
			if (!toast.isActive("please-register-toast")) {
				toast(`cannot add more then ${maxLimit} items `, {
					className: "toastify-style",
					toastId: "item-limit",
				});
			}
		}

		let cartDataWithQty = JSON.parse(localStorage.getItem("cart"));
		cartDataWithQty[index].productQuantity = parseInt(productCount + 1);
		localStorage.setItem("cart", JSON.stringify(cartDataWithQty));
	};

	const removeItem = (e, index) => {
		e.preventDefault();
		let cartData = JSON.parse(localStorage.getItem("cart"));
		if (productCount >= 0) {
			if (productCount === 1) {
				cartData.splice(index, 1);
				localStorage.setItem("cart", JSON.stringify(cartData));
				onRemoveItem(index);
			} else {
				setProductCount(productCount - 1);
				cartData[index].productQuantity = parseInt(productCount - 1);
				localStorage.setItem("cart", JSON.stringify(cartData));
			}
		}
	};

	return (
		<div>
			<ToastContainer />
			<div>
				<button
					className='border-2 border-slate-500 bg-slate-500 text-white w-4'
					onClick={(e) => addItem(e, index)}
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
					onClick={(e) => removeItem(e, index)}
				>
					-
				</button>
			</div>
		</div>
	);
}
export default CartButton;
