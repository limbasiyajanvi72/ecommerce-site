import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Verify() {
	const [userOTP, setUserOTP] = useState("");
	const navigate = useNavigate();
	const [counter, setCounter] = useState(30);

	useEffect(() => {
		generateOTP();
	}, []);

	const generateOTP = () => {
		const randomNumberInRange = (min, max) => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};
		localStorage.setItem(
			"OTP",
			JSON.stringify(randomNumberInRange(1000, 9999))
		);
		let storedOTP = JSON.parse(localStorage.getItem("OTP"));
		if (!toast.isActive("OTP")) {
			toast(`OTP is: ${storedOTP}`, {
				className: "toastify-style",
				toastId: "OTP",
			});
		}
		setCounter(30); // Trigger useEffect when generateOTP is called
		if (counter > 0) {
			const interval = setInterval(() => {
				setCounter((prevCounter) => {
					return prevCounter > 0 ? prevCounter - 1 : prevCounter;
				});
			}, 1000);

			return () => clearInterval(interval);
		}
	};

	function handleVerify(e) {
		e.preventDefault();

		let storedOTP = JSON.parse(localStorage.getItem("OTP"));
		if (parseInt(storedOTP, 10) === parseInt(userOTP, 10)) {
			let status = true;
			localStorage.setItem("verifystatus", JSON.stringify(status));

			let token = localStorage.getItem("token");
			let verify = JSON.parse(localStorage.getItem("verifystatus"));
			{
				token && verify && navigate("/");
			}
		} else {
			if (!toast.isActive("unsuccessful"))
				toast("Unsuccessful", {
					className: "toastify-style",
					toastId: "unsuccessful",
				});
		}
	}

	function onChangeHandler(e) {
		setUserOTP(e.target.value);
	}
	const handleEnterKey = (event) => {
		if (event.key === "Enter") {
			handleVerify(event);
		}
	};

	return (
		<div
			className='flex justify-center min-h-screen min-w-screen items-center text-black font-sans font-light bg-gray-950'
			onKeyDown={handleEnterKey}
		>
			<ToastContainer autoClose={30000} />
			<div className='p-[1px] w-[320px] bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-800 rounded-lg'>
				<div className='flex flex-col justify-center gap-9 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 p-10 rounded-lg text-center text-slate-400'>
					<h2 className='font-semibold text-4xl '>Verification</h2>

					<div className='flex flex-col gap-1'>
						<div className='p-[2px] bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-800 rounded-lg '>
							<input
								type='text'
								placeholder='Enter OTP'
								name='otp'
								value={userOTP}
								onChange={onChangeHandler}
								className=' rounded p-2 bg-slate-950 text-sm placeholder:text-slate-500 w-full focus:outline-0 '
								maxLength='4'
								pattern='^[0-9]{4}$'
								autoFocus
								required
							/>
						</div>
						<div className='text-start'>
							{counter} seconds remaining
						</div>
					</div>

					<div>
						Don't get OTP?{" "}
						<button type='button' onClick={generateOTP}>
							<span className='text-indigo-600 font-medium'>
								Resend
							</span>
						</button>
					</div>
					<button
						type='submit'
						onClick={handleVerify}
						className='rounded p-1 text-center bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600 text-white font-semibold  shadow-color'
					>
						Verify
					</button>
				</div>
			</div>
		</div>
	);
}

export default Verify;
