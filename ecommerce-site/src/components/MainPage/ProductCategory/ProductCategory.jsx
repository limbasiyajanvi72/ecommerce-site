import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../index.css";

function ProductCategory() {
	const [apiData, setApiData] = useState();
	let iconData = [
		{
			title: "Groceries",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/29327f40e9c4d26b.png?q=100",
			alt: "Groceries Icon",
		},
		{
			title: "Mobiles",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/22fddf3c7da4c4f4.png?q=100",
			alt: "Mobiles Icon",
		},
		{
			title: "Fashion",
			imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/64/64/image/0d75b34f7d8fbcb3.png?q=100",
			alt: "Fashion Icon",
		},
		{
			title: "Electronics",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/69c6589653afdb9a.png?q=100",
			alt: "Electronics Icon",
		},
		{
			title: "Home & furniture",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/ab7e2b022a4587dd.jpg?q=100",
			alt: "Home & Furniture Icon",
		},
		{
			title: "Appliances",
			imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/64/64/image/0139228b2f7eb413.jpg?q=100",
			alt: "Appliances Icon",
		},
		{
			title: "Travel",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/71050627a56b4693.png?q=100",
			alt: "Travel Icon",
		},
		{
			title: "Beauty & Toys",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/dff3f7adcf3a90c6.png?q=100",
			alt: "Beauty, Toys & More Icon",
		},
		{
			title: "Two wheelers",
			imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/64/64/image/05d708653beff580.png?q=100",
			alt: "Two Wheelers Icon",
		},
		{
			title: "Groceries",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/29327f40e9c4d26b.png?q=100",
			alt: "Groceries Icon",
		},
		{
			title: "Mobiles",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/22fddf3c7da4c4f4.png?q=100",
			alt: "Mobiles Icon",
		},
		{
			title: "Fashion",
			imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/64/64/image/0d75b34f7d8fbcb3.png?q=100",
			alt: "Fashion Icon",
		},
		{
			title: "Electronics",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/69c6589653afdb9a.png?q=100",
			alt: "Electronics Icon",
		},
		{
			title: "Home & furniture",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/ab7e2b022a4587dd.jpg?q=100",
			alt: "Home & Furniture Icon",
		},
		{
			title: "Appliances",
			imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/64/64/image/0139228b2f7eb413.jpg?q=100",
			alt: "Appliances Icon",
		},
		{
			title: "Travel",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/71050627a56b4693.png?q=100",
			alt: "Travel Icon",
		},
		{
			title: "Beauty, Toys ",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/dff3f7adcf3a90c6.png?q=100",
			alt: "Beauty, Toys & More Icon",
		},
		{
			title: "Two wheelers",
			imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/64/64/image/05d708653beff580.png?q=100",
			alt: "Two Wheelers Icon",
		},
		{
			title: "Groceries",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/29327f40e9c4d26b.png?q=100",
			alt: "Groceries Icon",
		},
		{
			title: "Mobiles",
			imgSrc: "https://rukminim2.flixcart.com/flap/64/64/image/22fddf3c7da4c4f4.png?q=100",
			alt: "Mobiles Icon",
		},
	];

	useEffect(() => {
		const apiCategory = "https://dummyjson.com/carts";

		axios
			.get(apiCategory)
			.then((response) => {
				const newData = response.data.carts.map((cart, index) => ({
					...cart,
					iconData: iconData[index % iconData.length],
				}));
				setApiData(newData);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	return (
		<section className=' mx-5 mt-20 min-[370px]:mx-1  max-[640px]:mx-1 '>
			<div className='flex overflow-x-scroll  gap-12  pro-category-style bg-white shadow-lg '>
				{apiData &&
					apiData.map((item, index) => (
						<div
							key={index}
							className='flex flex-col justify-center items-center'
						>
							<div className=' flex justify-center h-[64px] w-[90px] '>
								<img
									className='hover:border-1 h-[64px] w-[64px]'
									src={item.iconData.imgSrc}
									alt={item.iconData.alt}
								/>
							</div>
							<span className='font-normal text-center text-slate-700'>
								{item.iconData.title}
							</span>
						</div>
					))}
			</div>
		</section>
	);
}

export default ProductCategory;
