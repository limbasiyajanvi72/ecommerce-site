import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../../Constants/constant";

function Register() {
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		password: "",
		email: "",
		dob: "",
		adress: [{ address: "" }],
	});
	const [validationErrors, setValidationErrors] = useState({});
	const navigate = useNavigate();
	const uselocation = useLocation();

	useEffect(() => {
		let index = JSON.parse(localStorage.getItem("index"));
		let data = JSON.parse(localStorage.getItem("user"));
		if (uselocation.pathname === ROUTES.EDIT) {
			setFormData(data[index]);
		}
	}, []);

	const onSubmit = () => {
		const errors = validateForm(formData);
		setValidationErrors(errors);
		if (Object.keys(errors).length > 0) {
			return;
		}
		let userData = JSON.parse(localStorage.getItem("user")) || [];
		let index = JSON.parse(localStorage.getItem("index"));
		// let data = JSON.parse(localStorage.getItem("user"));
		if (uselocation.pathname === ROUTES.EDIT) {
			navigate(ROUTES.LOGIN);
			userData[index] = formData;
			localStorage.setItem("user", JSON.stringify(userData));
		} else {
			if (!Array.isArray(userData)) {
				userData = [];
			}
			userData.push(formData);
			localStorage.setItem("user", JSON.stringify(userData));
			navigate(ROUTES.LOGIN);
		}
	};

	const validateForm = (values) => {
		const errors = {};
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!values.firstname.trim()) {
			errors.firstname = "Firstname is required";
		}
		if (!values.lastname.trim()) {
			errors.lastname = "Lastname is required";
		}
		if (!values.password.trim()) {
			errors.password = "Password is required";
		} else {
			if (values.password.length < 4 || values.password.length > 10) {
				errors.password =
					"Length should be greater than 4 and less than 10";
			}
		}
		if (!values.dob) {
			errors.dob = "Date is required";
		}

		if (!values.email.trim()) {
			errors.email = "Email is required";
		} else {
			if (!regex.test(values.email)) {
				errors.email = "enter valid email";
			}
		}
		const hasAddress = values.adress.some(
			(address) => address.address.trim() !== ""
		);
		if (!hasAddress) {
			errors.adress = "Enter at least one address";
		}

		return errors;
	};

	const addAdressField = () => {
		let prevAddressField = [...formData.adress];
		prevAddressField.push({ address: "" });
		setFormData({ ...formData, adress: [...prevAddressField] });
	};

	const removeAddressField = (index) => {
		const newAddressField = [...formData.adress];
		newAddressField.splice(index, 1);
		setFormData((prevFormData) => ({
			...prevFormData,
			adress: newAddressField,
		}));
	};

	const handleAddressChange = (index, e) => {
		const { value } = e.target;
		const updatedAddress = [...formData.adress];
		updatedAddress[index] = {
			...updatedAddress[index],
			address: value,
		};
		setFormData((prevFormData) => ({
			...prevFormData,
			adress: updatedAddress,
		}));
	};

	const onChangeHandler = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleEnterKey = (event) => {
		if (event.key === "Enter") {
			onSubmit();
		}
	};

	return (
		<div className='flex justify-center min-h-screen min-w-screen items-center text-black font-sans font-light bg-gray-950'>
			<div className='p-[1px] w-[340px] bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-800 rounded-lg'>
				<div
					className='shadow-2xl flex flex-col justify-center gap-4 px-12 py-6 text-start bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 rounded-lg text-slate-400'
					onKeyDown={handleEnterKey}
				>
					<div className='text-center text-slate-400 flex flex-col justify-center gap-2'>
						<h2 className='font-semibold text-4xl '>Register</h2>
						<p className='font-normal text-sm'>
							Lorem ipsum dolor sit, amet consectetur adipisicing
						</p>
					</div>
					<div className='flex flex-col items-start gap-[2px] '>
						<input
							type='text'
							className=' rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0'
							placeholder='Firstname'
							value={formData.firstname}
							onChange={onChangeHandler}
							name='firstname'
							autoComplete='off'
						/>
						{validationErrors.firstname && (
							<label
								style={{
									color: "rgb(148 163 184)",
									fontSize: "12px",
								}}
							>
								{validationErrors.firstname}
							</label>
						)}
					</div>

					<div className='flex flex-col items-start gap-[2px] '>
						<input
							type='text'
							className=' rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0'
							placeholder='Lastname'
							value={formData.lastname}
							onChange={onChangeHandler}
							name='lastname'
							autoComplete='off'
						/>
						{validationErrors.lastname && (
							<label
								style={{
									color: "rgb(148 163 184)",
									fontSize: "12px",
								}}
							>
								{validationErrors.lastname}
							</label>
						)}
					</div>

					<div className='flex flex-col items-start gap-[2px] '>
						<input
							type='password'
							className=' rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0'
							placeholder='Password'
							value={formData.password}
							onChange={onChangeHandler}
							name='password'
							autoComplete='off'
						/>
						{validationErrors.password && (
							<label
								style={{
									color: "rgb(148 163 184)",
									fontSize: "12px",
								}}
							>
								{validationErrors.password}
							</label>
						)}
					</div>

					<div className='flex flex-col items-start gap-[2px]'>
						<input
							type='date'
							className=' rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0'
							value={formData.dob}
							onChange={onChangeHandler}
							name='dob'
							autoComplete='off'
						/>

						{validationErrors.dob && (
							<label
								style={{
									color: "rgb(148 163 184)",
									fontSize: "12px",
								}}
							>
								{validationErrors.dob}
							</label>
						)}
					</div>

					<div className='flex flex-col items-start gap-[2px]'>
						<input
							type='email'
							className=' rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0'
							value={formData.email}
							placeholder='Email'
							onChange={onChangeHandler}
							name='email'
							autoComplete='off'
						/>
						{validationErrors.email && (
							<label
								style={{
									color: "rgb(148 163 184)",
									fontSize: "12px",
								}}
							>
								{validationErrors.email}
							</label>
						)}
					</div>
					<div className='flex flex-col gap-[2px]'>
						{formData.adress.map((value, index) => (
							<div key={index} className='flex gap-1'>
								<input
									type='text'
									className=' rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0 '
									placeholder='Address'
									value={value.address}
									name='address'
									autoComplete='off'
									onChange={(e) =>
										handleAddressChange(index, e)
									}
								/>

								{formData.adress.length > 1 && (
									<button
										className='rounded p-2 bg-slate-950 text-sm'
										onClick={() =>
											removeAddressField(index)
										}
									>
										-
									</button>
								)}
							</div>
						))}
						{validationErrors.adress && (
							<label
								style={{
									color: "rgb(148 163 184)",
									fontSize: "12px",
								}}
							>
								{validationErrors.adress}
							</label>
						)}
					</div>

					{formData.adress.length < 5 && (
						<button
							className='rounded p-1 text-center bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 text-white font-semibold  shadow-color'
							onClick={addAdressField}
						>
							Add Address
						</button>
					)}
					<button
						className='rounded p-1 text-center bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 text-white font-semibold  shadow-color'
						onClick={onSubmit}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}

export default Register;
