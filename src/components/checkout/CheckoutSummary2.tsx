import Box from "../Box";
import React from "react";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Typography, { Span } from "../Typography";

const CheckoutSummary2: React.FC = ({ products }) => {

	const calcTotalPrice = () => {
		console.log(products);
		return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
	}
	return (
		<Box>
			<Typography color="secondary.900" fontWeight="700" mb="1.5rem">
				Your order
			</Typography>

			{products.map((item) => (
				<FlexBox
					justifyContent="space-between"
					alignItems="center"
					mb="1.5rem" rodu
					key={item.pctName}
				>
					<Typography style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
						<Span fontWeight="700" fontSize="14px">
							{item.quantity}
						</Span>{" "}
						x {item.productName}
					</Typography>
					<Typography>₫{item.price.toLocaleString('vi-VN')}</Typography>
				</FlexBox>
			))}

			<Divider bg="gray.300" mb="1.5rem" />

			<FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
				<Typography color="text.hint">Tổng tiền sản phẩm:</Typography>
				<Typography fontWeight="700">₫{calcTotalPrice().toLocaleString('vi-VN')}</Typography>
			</FlexBox>

			<FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
				<Typography color="text.hint">Phí ship:</Typography>
				<Typography fontWeight="700">-</Typography>
			</FlexBox>

			<FlexBox justifyContent="space-between" alignItems="center" mb="1.5rem">
				<Typography color="text.hint">Giảm giá:</Typography>
				<Typography fontWeight="700">-</Typography>
			</FlexBox>

			<Divider bg="gray.300" mb="0.5rem" />

			<FlexBox
				fontWeight="700"
				justifyContent="space-between"
				alignItems="center"
				mb="0.5rem"
			>
				<Typography>Tổng tiền:</Typography>
				<Typography fontWeight="700">₫{(2610).toLocaleString('vi-VN')}</Typography>
			</FlexBox>
		</Box>
	);
};

export default CheckoutSummary2;
