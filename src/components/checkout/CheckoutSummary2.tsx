import Box from "../Box";
import React, { useEffect, useState } from "react";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Typography, { Span } from "../Typography";
import { CartGetDetailResponse } from "@interfaces/cart";
import { ItemVoucher } from "@interfaces/promotion";
import { CostDelivery } from "@interfaces/delivery";
import { VoucherType } from "@/utils/constants";

type CheckoutSummary2Props = {
	products: CartGetDetailResponse[];
	vouchers: ItemVoucher[];
	listDeliveries: CostDelivery[];
};


const CheckoutSummary2: React.FC<CheckoutSummary2Props> = ({
	products,
	vouchers,
	listDeliveries
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
		if (listDeliveries.length === 0) return;

		if (listDeliveries.some((item) => item.cost === 0)) {
			return;
		}

		setFeeDelivery(calcPriceDelivery());
		setTotalPrice(calcTotalPrice() + calcPriceDelivery() - saleProduct());
	}, [listDeliveries]);

	const calcTotalPrice = () => {
		return products.reduce((acc, item) => acc + item.price * item.quantity, 0);
	}

	const calcPriceDelivery = () => {
		const voucherDelivery = vouchers.filter(item => item.voucher_type === VoucherType.DELIVERY);
		if (voucherDelivery.length === 0) {
			return listDeliveries.reduce((acc, item) => acc + item.cost, 0);
		}

		return listDeliveries.reduce((acc, item) => acc + item.cost, 0) -
			voucherDelivery[0].real_discount.totalPrice;
	}

	const saleProduct = () => {
		const voucherProd = vouchers.filter(item => item.voucher_type === VoucherType.PRODUCT);
		if (voucherProd.length === 0) return 0;
		return voucherProd[0].real_discount.totalPrice;
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


				<Typography fontWeight="700">{listDeliveries.reduce((acc, item) => acc + item.cost, 0).toLocaleString('vi-VN')}₫</Typography>
			</FlexBox>

			<FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
				<Typography color="text.hint">Giảm giá vận chuyển:</Typography>
				<Typography fontWeight="700">{(listDeliveries.reduce((acc, item) => acc + item.cost, 0) -
					feeDelivery).toLocaleString('vi-VN')}₫</Typography>
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
