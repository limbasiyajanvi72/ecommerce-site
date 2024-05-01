import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

function InputField() {
	const [allValues, setAllValues] = useState([]);

	const onChangeHandle = (e) => {
		let value = e.target.value;
		let inputs = [];

		if (value && value.includes(",")) {
			let segment = value.split(",");

			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			let isValid = emailPattern.test(segment[0]);
			if (isValid === true) {
				inputs.push(segment[0]);
				setAllValues((prevValues) => [...prevValues, ...inputs]);
			} else {
				alert("enter valid email address");
			}
			e.target.value = "";
		}
	};

	const removeItem = (indexToRemove) => {
		const filteredValues = allValues.filter(
			(_, index) => index !== indexToRemove
		);
		setAllValues(filteredValues);
	};

	return (
		<>
			<div className='w-[500px] border h-12 flex flex-wrap flex-row gap-1 bg-white'>
				{allValues.map((item, index) => (
					<div
						key={index}
						className='bg-slate-300 h-6 relative rounded-xl'
					>
						<span className='pr-7'>{item}</span>

						<button
							className='absolute top-1 right-1 '
							onClick={() => removeItem(index)}
						>
							<FaTimes />
						</button>
					</div>
				))}
				<input
					type='text'
					placeholder='enter recipients here'
					className='h-5 focus:outline-0'
					onChange={(e) => onChangeHandle(e)}
				/>
			</div>
		</>
	);
}

export default InputField;
