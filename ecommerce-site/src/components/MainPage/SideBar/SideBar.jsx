import React from "react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { filterSliceActions } from "../../../redux/Slice/filterSlice";

function SideBar() {
	const {
		filterCompanyData,
		filterCategoryData,
		filterColorData,
		filterPriceRange,
		isFreeDeliveryAvailable,
	} = useSelector((state) => state.filter);

	const [range, setRange] = useState(3000);
	const dispatch = useDispatch();

	const closeSidebar = () => {
		dispatch(filterSliceActions.setIsOpenFilter(false));
		document.body.classList.remove("overflow-hidden");
	};

	const updateRangeLabels = (e) => {
		const price = e.target.value;
		setRange(price);
		let status = true;
		dispatch(filterSliceActions.setIsPriceRangeSet(status));
		dispatch(filterSliceActions.setMaxPrice(price));
	};

	const onChangeCompany = (e) => {
		let company = e.target.value;
		let isCompanyChecked = e.target.checked;
		dispatch(filterSliceActions.setIsCompanyChecked(isCompanyChecked));
		let updatedFilterCompanyData = filterCompanyData.map((item) => {
			if (item.company === company) {
				return { ...item, checked: true };
			}
			return item;
		});

		dispatch(
			filterSliceActions.setCompanyFilters(updatedFilterCompanyData)
		);
	};

	const onChangeColor = (e) => {
		let color = e.target.value;
		let isColorChecked = e.target.checked;
		dispatch(filterSliceActions.setIsColorChecked(isColorChecked));
		let updatedFilterColorData = filterColorData.map((item) => {
			if (item.color === color) {
				return { ...item, checked: isColorChecked };
			}
			return item;
		});

		dispatch(filterSliceActions.setColorFilters(updatedFilterColorData));
	};

	const onChangeCategory = (e) => {
		let category = e.target.value;
		let isCategoryChecked = e.target.checked;
		dispatch(filterSliceActions.setIsCategoryChecked(isCategoryChecked));

		let updatedFilterCategoryData = filterCategoryData.map((item) => {
			if (item.category === category) {
				return { ...item, checked: true };
			}
			return item;
		});

		dispatch(
			filterSliceActions.setCategoryFilters(updatedFilterCategoryData)
		);
	};

	const isFreeDelievry = (e) => {
		let isFreeDeliveryAvailable = e.target.checked;
		dispatch(
			filterSliceActions.setIsfreeDeliveryAvaialable(
				isFreeDeliveryAvailable
			)
		);
	};

	return (
		<div>
			<div className='flex   text-slate-500 '>
				<div className='z-[100] list-none overflow-y-scroll pro-category-style fixed bg-white min-h-screen w-[300px] overflow-hidden text-[18px] transition-transform ease-in-out duration-200 inset-0 opacity-100'>
					<button
						className='absolute right-3 top-3'
						onClick={closeSidebar}
					>
						<IoClose />
					</button>
					<div className='pl-5 pt-5 flex flex-col gap-3'>
						<h2 className='font-semibold text-2xl'>Filter</h2>
						<ul className='flex flex-col accent-slate-500 gap-4 '>
							<div className='flex flex-col gap-2'>
								<li className='font-medium'>Price</li>
								<div className='flex flex-col gap-[1px] text-base capitalize pr-8'>
									<label className='text-sm'>{range}</label>
									<input
										type='range'
										min={filterPriceRange[0]}
										max={filterPriceRange[1]}
										step='1000'
										value={range}
										onChange={(e) => updateRangeLabels(e)}
									/>
									<div className='flex justify-between'>
										<label>120</label>
										<label>40000+</label>
									</div>
								</div>
							</div>

							<div className='flex flex-col gap-2'>
								<label className='font-medium'>Color</label>
								<div className='text-sm grid grid-cols-4 gap-2'>
									{filterColorData.map((item, index) => (
										<div key={index} className=' flex'>
											<input
												type='checkbox'
												value={item.color}
												onChange={(e) =>
													onChangeColor(e, index)
												}
												defaultChecked={item.checked}
												id={index}
												className='hidden'
											/>
											<label
												key={index}
												htmlFor={index}
												className={`h-8 w-8 outline-none  m-[5px] ${
													item.checked
														? "outline-slate-400"
														: ""
												} `}
												onClick={(e) => {
													onChangeColor(e, index);
												}}
												style={{
													backgroundColor: item.color,
												}}
											></label>
										</div>
									))}
								</div>
							</div>
							<div className='flex flex-col gap-2'>
								<li className='font-medium'> Company</li>
								<div className='flex flex-col gap-[1px] text-base'>
									{filterCompanyData.map((item, index) => (
										<div
											className='flex gap-[2px] capitalize'
											key={index}
										>
											<input
												type='checkbox'
												value={item.company}
												onChange={(e) =>
													onChangeCompany(e)
												}
												defaultChecked={item.checked}
											/>
											<li key={index}>{item.company}</li>
										</div>
									))}
								</div>
							</div>

							<div className='flex flex-col gap-2'>
								<li className='font-medium'>Category</li>
								<div className='flex flex-col gap-[1px] text-base capitalize'>
									{filterCategoryData.map((item, index) => (
										<div
											key={index}
											className='flex gap-[2px]'
										>
											<input
												type='checkbox'
												value={item.category}
												onChange={(e) =>
													onChangeCategory(e)
												}
												defaultChecked={item.checked}
											/>
											<li>{item.category}</li>
										</div>
									))}
								</div>
							</div>

							<div className='flex flex-col gap-2'>
								<li className='font-medium'>Free Delivery</li>
								<div className='flex gap-[2px]'>
									<input
										type='checkbox'
										onChange={(e) => isFreeDelievry(e)}
										checked={isFreeDeliveryAvailable}
									/>
									<li>Available</li>
								</div>
							</div>
						</ul>
					</div>
				</div>
				<div
					className='z-50 min-w-full min-h-screen fixed inset-0 overflow-hidden bg-black opacity-80'
					onClick={closeSidebar}
				></div>
			</div>
		</div>
	);
}
export default SideBar;
