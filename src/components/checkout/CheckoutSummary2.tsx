import Box from "../Box";
import React, { useEffect, useState } from "react";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Typography, { Span } from "../Typography";
import { CartGetDetailResponse } from "@interfaces/cart";
import { ItemVoucher } from "@interfaces/promotion";
import { CostDelivery } from "@interfaces/delivery";
import { DiscountType } from "@/utils/constants";

type CheckoutSummary2Props = {
	products: CartGetDetailResponse[];
	vouchers: ItemVoucher[];
	listDelivery: CostDelivery[];
};


const CheckoutSummary2: React.FC<CheckoutSummary2Props> = ({
	products,
	vouchers, listDelivery
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
		if (listDelivery.length === 0) return;

		if (listDelivery.some((item) => item.cost === 0)) {
			return;
		}

		setFeeDelivery(calcPriceDelivery());
		setTotalPrice(calcTotalPrice() + calcPriceDelivery() - saleProduct());
	}, [listDelivery]);

	const calcTotalPrice = () => {
		return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
	}

	const calcPriceDelivery = () => {

		if (listDelivery.length === 0) return 0;

		if (listDelivery.some((item) => item.cost === 0)) {
			return 0;
		}

		for (const voucher of vouchers) {
			if (voucher.voucher_type === 1) {

				if (voucher.voucher_require.min_require > calcTotalPrice()) {
					return listDelivery.reduce((acc, item) => acc + item.cost, 0);
				}
				// TODO: confirm with api voucher discount delivery have 2 type ?
				if (voucher.discount_data.discount_type === DiscountType.FIXED_DISCOUNT) {
					return listDelivery.reduce((acc, item) => {
						if (item.cost - voucher.discount_data.discount_value < 0) {
							return acc + 0;
						}
						return acc + item.cost - voucher.discount_data.discount_value;
					}, 0);
				} else {
					return listDelivery.reduce((acc, item) => {
						const valAfter = acc + item.cost * (1 - voucher.discount_data.discount_percent);
						return acc + item.cost - valAfter > voucher.discount_data.maximum_value ? item.cost - voucher.discount_data.maximum_value : valAfter;
					}, 0);
				}
			}
		}

		return listDelivery.reduce((acc, item) => acc + item.cost, 0);
	}

	const saleProduct = () => {
		const totalPriceProduct = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
		for (const voucher of vouchers) {
			if (voucher.voucher_type === 2) {

				if (voucher.voucher_require.min_require > calcTotalPrice()) {
					return totalPriceProduct;
				}

				if (voucher.discount_data.discount_type === DiscountType.FIXED_DISCOUNT) {
					if (totalPriceProduct - voucher.discount_data.discount_value < 0) {
						return 0;
					}
					return totalPriceProduct - voucher.discount_data.discount_value;
				} else {
					const valAfter = totalPriceProduct * (1 - voucher.discount_data.discount_percent);
					return totalPriceProduct - valAfter > voucher.discount_data.maximum_value
						? totalPriceProduct - voucher.discount_data.maximum_value : valAfter;
				}
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


				<Typography fontWeight="700">{listDelivery.reduce((acc, item) => acc + item.cost, 0).toLocaleString('vi-VN')}₫</Typography>
			</FlexBox>

			<FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
				<Typography color="text.hint">Giảm giá vận chuyển:</Typography>
				<Typography fontWeight="700">{(listDelivery.reduce((acc, item) => acc + item.cost, 0) - feeDelivery).toLocaleString('vi-VN')}₫</Typography>
			</FlexBox>

			<FlexBox justifyContent="space-between" alignItems="center" mb="1.5rem">
				<Typography color="text.hint">Giảm giá sản phẩm:</Typography>
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
