import { useRef } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import Slider from "react-slick";
import Carousel1 from "../../../assets/images/Carousel1.jpg";
import carousel2 from "../../../assets/images/Carousel2.jpg";
import carousel3 from "../../../assets/images/Carousel3.jpg";
import "../../../../src/index.css";

function Carousel() {
	const sliderRef = useRef(null);
	var settings = {
		dots: true,
		infinite: true,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
	};

	const handlePrev = () => {
		if (sliderRef.current) {
			sliderRef.current.slickPrev();
		}
	};
	const handleNext = () => {
		if (sliderRef.current) {
			sliderRef.current.slickNext();
		}
	};

	return (
		<section className='mb-2 relative '>
			<Slider
				{...settings}
				ref={sliderRef}
				className='mt-8  lg:w-full sm:w-full md:w-full lg:object-contain md:object-contain sm:object-contain '
			>
				<div>
					<img
						className='h-96 w-full sm:h-64 sm:w-full  md:h-96 lg:h-96 min-[370px]:h-60 max-[600px]:h-60 object-cover opacity-75'
						src={Carousel1}
						alt='living-room'
					/>
				</div>
				<div>
					<img
						src={carousel2}
						className='h-96 w-full sm:h-64 sm:w-full  md:h-96 lg:h-96 min-[370px]:h-60 max-[600px]:h-60 object-cover opacity-75'
						alt='img-shoes'
					/>
				</div>
				<div>
					<img
						src={carousel3}
						className='h-96 w-full sm:h-64 sm:w-full  md:h-96 lg:h-96 min-[370px]:h-60 max-[600px]:h-60 object-cover  opacity-75'
						alt='img-ballooons'
					/>
				</div>
			</Slider>

			<div className='bg-white rounded-sm absolute top-[133px] left-[0px] md:absolute md:top-[180px] md:left-[0px] shadow-md'>
				<button onClick={handlePrev}>
					<SlArrowLeft className='mb-6 mt-7 m mx-2 text-slate-400 hover:text-slate-500 drop-shadow-lg ' />
				</button>
			</div>

			<div className='bg-white rounded-sm absolute top-[133px] right-[0px] md:absolute md:top-[180px] md:right-[0px] shadow-md'>
				<button onClick={handleNext}>
					<SlArrowRight className='mb-6 mt-7 m mx-2 text-slate-400 hover:text-slate-500  drop-shadow-lg  ' />
				</button>
			</div>
		</section>
	);
}

export default Carousel;
