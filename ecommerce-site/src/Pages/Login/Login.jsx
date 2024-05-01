import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../Constants/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
	const [formData, setFormData] = useState({
		password: "",
		email: "",
	});
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		let loggedUserdata = JSON.parse(localStorage.getItem("user"));
		let isLoggedIn = false;
		if (!loggedUserdata && !toast.isActive("please-register-toast")) {
			toast("Please Register", {
				className: "toastify-style",
				toastId: "please-register-toast",
			});
			return;
		}
		loggedUserdata.map((val) => {
			if (
				val.email === formData.email &&
				val.password === formData.password
			) {
				navigate(ROUTES.VERIFY);
				isLoggedIn = true;
				localStorage.setItem("loginstatus", JSON.stringify(isLoggedIn));
			}
			return true;
		});
		if (!isLoggedIn && !toast.isActive("invalid-credential-toast")) {
			toast("invalid credential", {
				className: "toastify-style",
				toastId: "invalid-credential-toast",
			});
		}
	};

	const onChangeHandler = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleEnterKey = (event) => {
		if (event.key === "Enter") {
			handleSubmit();
		}
	};
	return (
		<div className='flex justify-center min-h-screen min-w-screen items-center font-sans font-light bg-gray-950'>
			<ToastContainer />
			<div
				className='p-[1px] w-[320px] bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-800 rounded-lg'
				onKeyDown={handleEnterKey}
			>
				<div className='flex flex-col gap-9 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 p-10 rounded-lg'>
					<div className='text-center text-slate-400 flex flex-col justify-center gap-2'>
						<h2 className='font-semibold text-4xl '>Login</h2>
						<p className='font-normal text-sm'>
							Lorem ipsum dolor sit, amet consectetur adipisicing
						</p>
					</div>
					<div className='flex flex-col gap-4 justify-center text-slate-400'>
						<div className='flex flex-col items-start gap-1 '>
							<label className='text-[11px]  '>EMAIL</label>
							<input
								type='email'
								className=' rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0'
								placeholder='Your email'
								value={formData.email}
								onChange={onChangeHandler}
								name='email'
								autoComplete='off'
							/>
						</div>
						<div className='flex flex-col items-start gap-1'>
							<label className='text-[11px] '>PASSWORD</label>
							<input
								type='password'
								className='rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0'
								placeholder='Your Password'
								value={formData.password}
								onChange={onChangeHandler}
								name='password'
							/>
						</div>
					</div>
					<button
						className='rounded p-1 text-center bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 text-white font-semibold  shadow-color'
						onClick={handleSubmit}
					>
						CONTINUE
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
