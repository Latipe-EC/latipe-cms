import React from "react";
import Button from "../buttons/Button";
import Typography from "../Typography";
import { StyledCarouselCard1 } from "./CarouselCardStyle";

export interface CarouselCard1Props {
}

const CarouselCard1: React.FC<CarouselCard1Props> = () => {
	return (
		<StyledCarouselCard1>
			<div>
				<h1 className="title">Khuyễn mãi 50% tháng đầu năm</h1>
				<Typography color="secondary.main" mb="1.35rem">
					Bạn có thể lưu các mã giảm giá, Voucher Xtra và mã miễn phí vận chuyển toàn quốc. Bên cạnh đó, Latipe cũng sẽ có những chiến dịch khuyến mãi lớn hằng năm như Sale 2.2, Sale 3.3, Sale 4.4,...
				</Typography>
				<Button
					className="button-link"
					variant="contained"
					color="primary"
					p="1rem 1.5rem"
				>
					Mua ngay
				</Button>
			</div>

			<div className="image-holder">
				<img
					src="/assets/images/products/apple-watch-0.png"
					alt="apple-watch-1"
				/>
			</div>
		</StyledCarouselCard1>
	);
};

export default CarouselCard1;
