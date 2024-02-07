import Box from "../Box";
import React, { useEffect, useState } from "react";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Typography, { Span } from "../Typography";
import { CartGetDetailResponse } from "@interfaces/cart";
import { ItemVoucher } from "@interfaces/promotion";
import { CostDelivery } from "@interfaces/delivery";

type CheckoutSummary2Props = {
	products: CartGetDetailResponse[];
	vouchers: ItemVoucher[];
	selectDelivery: CostDelivery;
};


const CheckoutSummary2: React.FC<CheckoutSummary2Props> = ({
	products,
	vouchers, selectDelivery
}) => {
	const [priceProduct, setPriceProduct] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);
	const [feeDelivery, setFeeDelivery] = useState(0);
	const [sale, setSale] = useState(0);

	useEffect(() => {
		setPriceProduct(calcTotalPrice());
		setTotalPrice(calcTotalPrice() + calcPriceDelivery() - saleProduct());
	}, [products]);

	useEffect(() => {
		setSale(saleProduct());
		setFeeDelivery(calcPriceDelivery());
		setTotalPrice(calcTotalPrice() + calcPriceDelivery() - saleProduct());
	}, [vouchers]);

	useEffect(() => {
		setFeeDelivery(calcPriceDelivery());
		setTotalPrice(calcTotalPrice() + calcPriceDelivery() - saleProduct());
	}, [selectDelivery]);

	const calcTotalPrice = () => {
		return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
	}

	const calcPriceDelivery = () => {
		if (selectDelivery === null) return 0;
		for (const voucher of vouchers) {
			if (voucher.voucher_type === 1) {
				if (voucher.discount_percent && voucher.discount_value) {
					const priceDelivery = selectDelivery.cost - (selectDelivery.cost * voucher.discount_percent / 100) - voucher.discount_value;
					const newPrice = priceDelivery < voucher.discount_value ? priceDelivery : selectDelivery.cost - voucher.discount_value;
					return newPrice > 0 ? newPrice : 0;
				} else {
					return selectDelivery.cost - voucher.discount_value > 0 ?
						selectDelivery.cost - voucher.discount_value : 0;
				}
			}
		}
		return selectDelivery.cost;
	}

	const saleProduct = () => {
		const totalPriceProduct = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
		for (const voucher of vouchers) {
			if (voucher.voucher_type === 2) {
				return totalPriceProduct - voucher.discount_value > 0 ?
					voucher.discount_value : totalPriceProduct;
			}
		}
		return 0;
	}

	return (
		<Box>
			<Typography color="secondary.900" fontWeight="700" mb="1.5rem">
				Đơn hàng của bạn
			</Typography>

			{products.map((item) => (
				<FlexBox
					justifyContent="space-between"
					alignItems="center"
					mb="1.5rem" rodu
					key={item.productName}
				>
					<Typography
						style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
						<Span fontWeight="700" fontSize="14px">
							{item.quantity}
						</Span>{" "}
						x {item.productName}
					</Typography>
					<Typography>{item.price.toLocaleString('vi-VN')}₫</Typography>
				</FlexBox>
			))}

			<Divider bg="gray.300" mb="1.5rem" />

			<FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
				<Typography color="text.hint">Tổng tiền sản phẩm:</Typography>
				<Typography fontWeight="700">{priceProduct.toLocaleString('vi-VN')}₫</Typography>
			</FlexBox>

			<FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
				<Typography color="text.hint">Phí ship:</Typography>
				<Typography fontWeight="700">{feeDelivery.toLocaleString('vi-VN')}₫</Typography>
			</FlexBox>

			<FlexBox justifyContent="space-between" alignItems="center" mb="1.5rem">
				<Typography color="text.hint">Giảm giá:</Typography>
				<Typography fontWeight="700">{sale.toLocaleString('vi-VN')}₫</Typography>
			</FlexBox>

			<Divider bg="gray.300" mb="0.5rem" />

			<FlexBox
				fontWeight="700"
				justifyContent="space-between"
				alignItems="center"
				mb="0.5rem"
			>
				<Typography>Tổng tiền:</Typography>
				<Typography fontWeight="700">{totalPrice.toLocaleString('vi-VN')}₫</Typography>
			</FlexBox>
		</Box>
	);
};

export default CheckoutSummary2;
