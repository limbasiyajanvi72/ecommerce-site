import React, { useState } from "react";
import {
	getDatabase,
	ref,
	set,
	get,
	child,
	orderByKey,
	limitToLast,
} from "firebase/database";
import { app } from "../utils/firebase";

export const AddProduct = () => {
	const [editProductData, setEditProductData] = useState({
		company: "",
		description: "",
		discount: "",
		id: "",
		image: "",
		name: "",
		price: "",
		shipping: "",
		stock: "",
		category: [],
		color: [],
	});

	const onChangeHandler = (event) => {
		setEditProductData({
			...editProductData,
			[event.target.name]: event.target.value,
		});
	};

	const writeUserData = async () => {
		const db = getDatabase(app);
		const productRef = ref(db, "product");
		const productSnapshot = await get(productRef);
		const keysArray = Object.keys(productSnapshot.val());
		const newIndex = keysArray.length + 0;

		const newDocRef = ref(db, `product/${newIndex}`);

		set(newDocRef, {
			company: editProductData.company,
			description: editProductData.description,
			discount: editProductData.discount,
			id: editProductData.id,
			image: editProductData.image,
			name: editProductData.name,
			price: editProductData.price,
			shipping: editProductData.shipping,
			stock: editProductData.stock,
			category: editProductData.category,
			color: editProductData.color,
		})
			.then(() => {
				alert("data saved successfully");
			})
			.catch((error) => {
				alert("error", error.message);
			});
	};

	const onchangeCategory = (event) => {
		let value = event.target.value;
		let categoryList = [];
		if (value && value.includes(",")) {
			let segment = value.split(",");
			segment = segment.filter((seg) => seg.trim() !== "");
			categoryList.push(...segment);
			setEditProductData((prevData) => ({
				...prevData,
				category: categoryList,
			}));
		}
		if (value.includes(",") === false) {
			categoryList.push(value);
			console.log("colorlist:", categoryList);
			setEditProductData((prevData) => ({
				...prevData,
				category: categoryList,
			}));
		}
	};
	const onchangeColor = (event) => {
		let valueColor = event.target.value;
		let colorList = [];
		if (valueColor && valueColor.includes(",")) {
			let segment = valueColor.split(",");
			segment = segment.filter((seg) => seg.trim() !== "");
			colorList.push(...segment);
			setEditProductData((prevData) => ({
				...prevData,
				color: colorList,
			}));
		}

		if (valueColor.includes(",") === false) {
			colorList.push(valueColor);
			console.log("colorlist:", colorList);
			setEditProductData((prevData) => ({
				...prevData,
				color: colorList,
			}));
		}
	};
	return (
		<div>
			<h2>Add Products</h2>
			<div className='flex gap-1'>
				<label>Company</label>
				<input
					type='text'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.company}
					name='company'
				/>
			</div>

			<div className='flex gap-1'>
				<label>Description:</label>
				<input
					type='text'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.description}
					name='description'
				/>
			</div>
			<div className='flex gap-1'>
				<label>Id:</label>
				<input
					type='text'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.id}
					name='id'
				/>
			</div>

			<div className='flex gap-1'>
				<label>Discount:</label>
				<input
					type='number'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.discount}
					name='discount'
				/>
			</div>
			<div className='flex gap-1'>
				<label>Image Path:</label>
				<input
					type='url'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.image}
					name='image'
				/>
			</div>
			<div className='flex gap-1'>
				<label>Name:</label>
				<input
					type='text'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.name}
					name='name'
				/>
			</div>
			<div className='flex gap-1'>
				<label>Price:</label>
				<input
					type='number'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.price}
					name='price'
				/>
			</div>
			<div className='flex gap-1'>
				<label>Shipping:</label>
				<input
					type='text'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.shipping}
					name='shipping'
				/>
			</div>
			<div className='flex gap-1'>
				<label>Stock:</label>
				<input
					type='number'
					className='border-slate-400 border'
					onChange={(event) => onChangeHandler(event)}
					value={editProductData.stock}
					name='stock'
				/>
			</div>
			<div className='flex gap-1'>
				<label>Category:</label>
				<input
					type='text'
					className='border-slate-400 border'
					onChange={(event) => onchangeCategory(event)}
					name='category'
				/>
			</div>

			<div className='flex gap-1'>
				<label>Color:</label>

				<input
					type='text'
					className='border-slate-400 border'
					onChange={(event) => onchangeColor(event)}
					name='color'
				/>
			</div>

			<input
				type='submit'
				value='submit'
				className='border-slate-400 border'
				onClick={writeUserData}
			/>
		</div>
	);
};
