import React from "react";
import Button from "../buttons/Button";
import Typography from "../Typography";
import { StyledCarouselCard1 } from "./CarouselCardStyle";

export interface CarouselCardTextImageProps {
}

const CarouselCardTextImage: React.FC<CarouselCardTextImageProps> = () => {
	return (
		<StyledCarouselCard1>
			<div>
				<h1 className="title">Khuyến mãi đơn hàng đầu tiên</h1>
				<Typography mr="2.35rem" mb="1rem" className="text_carousel_card">
					Tạo ngay tài khoản để tận hưởng siêu khuyến mãi giảm ngay 20% cho đơn hàng đầu tiên !
				</Typography>
				<Typography mr="2.35rem" className="text_carousel_card">
					Ngoài ra nhiều khuyến mãi hấp dẫn lên đến 49% cho các sản phẩm khác. Với hơi 1000 nhóm sản phẩm khác nhau cho bạn tha hồ chọn lựa phù hợp.
				</Typography>
				<Button
					mt="2.35rem"
					className="button-link"
					variant="contained"
					color="primary"
					p="1rem 1.5rem"
				>
					Tạo tài khoản
				</Button>
			</div>

			<div className="image-holder">
				<img
					src="/assets/images/hero-banner.png"
					alt="carousel-card-1"
				/>
			</div>
		</StyledCarouselCard1>
	);
};

export default CarouselCardTextImage;
