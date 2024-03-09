import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@components/avatar/Avatar";
import Box from "@components/Box";
import Button from "@components/buttons/Button";
import Card from "@components/Card";
import Divider from "@components/Divider";
import FlexBox from "@components/FlexBox";
import Grid from "@components/grid/Grid";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import VendorDashboardLayout from "@components/layout/VendorDashboardLayout";
import TableRow from "@components/TableRow";
import Typography, { H5, H6, Small } from "@components/Typography";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { useEffect, useState } from "react";
import { OrderItem, StoreOrderDetailResponse } from "@interfaces/order";
import {
	cancelOrderItem,
	getStoreOrderDetail,
	updateOrderItemStatusByStore
} from "@stores/slices/orders-slice";
import { Chip } from "@components/Chip";
import { Tooltip } from "@chakra-ui/react";
import { Action, Content, OrderStatus, Title } from "@/utils/constants";
import { vi } from "date-fns/locale";

const OrderDetails = () => {
	const { id } = useParams();
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [response, setResponse] = useState<StoreOrderDetailResponse>();

	useEffect(() => {
		dispatch(getStoreOrderDetail(id)).unwrap().then((res) => {
			if (res.data.error_code) {
				navigate("/401");
				return;
			}
			setResponse(res.data);
		});
	}, []);

	const handleRenderStaus = (): string => {
		switch (response.data.status) {
			case OrderStatus.ORDER_SYSTEM_PROCESS:
				return "Đang xử lý đơn hàng";
			case OrderStatus.ORDER_CREATED:
				return "Tạo đơn hàng thành công";
			case OrderStatus.ORDER_PREPARED:
				return "Đang chuẩn bị đơn hàng";
			case OrderStatus.ORDER_DELIVERY:
				return "Đang trên đường vận chu1yển";
			case OrderStatus.ORDER_SHIPPING_FINISH:
				return "Vận chuyển thành công";
			case OrderStatus.ORDER_COMPLETED:
				return "Đơn hàng đã hoàn thành";
			case OrderStatus.ORDER_REFUND:
				return "Đang hoàn tiền";
			case OrderStatus.ORDER_CANCEL_BY_USER:
				return "Đã hủy bởi khách hàng";
			case OrderStatus.ORDER_CANCEL_BY_ADMIN:
				return "Đã hủy bởi admin";
			case OrderStatus.ORDER_CANCEL_BY_STORE:
				return "Đã hủy bởi người bán";
			case OrderStatus.ORDER_CANCEL_BY_DELI:
				return "Đã hủy bởi người giao hàng";
			case OrderStatus.ORDER_CANCEL_USER_REJECT:
				return "Khách hàng từ chối nhận đơn hàng";
			case OrderStatus.ORDER_FAILED:
				return "Mua hàng thất bại";
		}
	}

	const getColor = (status) => {
		switch (status) {
			case OrderStatus.ORDER_SYSTEM_PROCESS:
			case OrderStatus.ORDER_PREPARED:
			case OrderStatus.ORDER_DELIVERY:
			case OrderStatus.ORDER_REFUND:
				return "secondary";
			case OrderStatus.ORDER_CREATED:
			case OrderStatus.ORDER_SHIPPING_FINISH:
			case OrderStatus.ORDER_COMPLETED:
				return "success";
			case OrderStatus.ORDER_CANCEL_BY_USER:
			case OrderStatus.ORDER_CANCEL_BY_ADMIN:
			case OrderStatus.ORDER_CANCEL_BY_STORE:
			case OrderStatus.ORDER_CANCEL_BY_DELI:
			case OrderStatus.ORDER_CANCEL_USER_REJECT:
			case OrderStatus.ORDER_FAILED:
				return "error";
			default:
				return "";
		}
	};

	const handleCancelOrder = () => {
		dispatch(cancelOrderItem({
			id: response.data.order_id,
			body: {
				item_id: response.data.order_items[0].item_id,
			}
		})).unwrap().then((res) => {
			if (res.data.error_code) {
				navigate("/401");
				return;
			}
			const newResponse = { ...response };
			newResponse.data.status = 7;
			setResponse(newResponse);
		});
	}

	const handleConfirmOrder = (item: OrderItem) => {
		dispatch(updateOrderItemStatusByStore({
			id: response.data.order_id,
			body: {
				item_id: item.item_id,
			}
		})).unwrap().then((res) => {
			if (res.data.error_code) {
				navigate("/401");
				return;
			}
			const newResponse = { ...response };
			newResponse.data.order_items = newResponse.data.order_items.map((i) => {
				if (i.item_id === item.item_id) {
					i.is_prepared = 1;
				}
				return i;
			});
			setResponse(newResponse);
		});

	}

	return (
		<div>
			<DashboardPageHeader
				title={Title.ORDER_DETAIL}
				iconName="bag_filled"
				button={
					<a href="/vendor/orders">
						<Button color="primary" bg="primary.light" px="2rem">
							{Action.BACK}
						</Button>
					</a>
				}
			/>

			<Card p="0px" mb="30px" overflow="hidden">
				<TableRow bg="gray.200" p="12px" boxShadow="none" borderRadius={0}>
					<FlexBox
						className="pre"
						flex="0 0 0 !important"
						m="6px"
						alignItems="center"
					>
						<Typography fontSize="14px" color="text.muted" mr="4px">
							{Title.ORDER_CODE}:
						</Typography>
						<Typography fontSize="14px" fontWeight={"bold"}>{id.toUpperCase()}</Typography>
					</FlexBox>
					{response && <FlexBox
						className="pre"
						flex="0 0 0 !important"
						m="6px"
						alignItems="center"
					>
						<Box m="6px">
							<Chip p="0.25rem 1rem" bg={`${getColor(response.data.status)}.light`}>
								<Small textAlign="center"
									color={`${getColor(response.data.status)}.main`}>{handleRenderStaus()}</Small>
							</Chip>
						</Box>
					</FlexBox>}
					<FlexBox className="pre" m="6px" justifyContent="flex-end">
						<Typography fontSize="14px" color="text.muted" mr="4px">
							{Content.DATE_PURCHASED}:
						</Typography>
						<Typography fontSize="14px">
							{format(new Date(), "dd MMM, yyyy", { locale: vi })}
						</Typography>
					</FlexBox>
				</TableRow>

				<Box py="0.5rem">
					{response && response.data.order_items.map((item) => (
						<FlexBox
							px="1rem"
							py="0.5rem"
							flexWrap="wrap"
							alignItems="center"
							key={item}
						>
							<FlexBox flex="2 2 260px" m="6px" alignItems="center">
								<Avatar src={item.image ? item.image : "/assets/images/products/imagetree.png"}
									size={64} />
								<Box ml="20px">
									<H6 my="0px">{item.product_name}</H6>
									<FlexBox alignItems="center" justifyContent="space-between">
										<Typography fontSize="14px" color="text.muted">
											{item.net_price > 0 &&
												<del>{item.price.toLocaleString('vi-VN')}₫</del>} {(item.net_price > 0 ? item.net_price : item.price).toLocaleString('vi-VN')}₫
											x {item.quantity}
										</Typography>
										<Typography fontSize="14px" color="text.muted">
											{((item.net_price > 0 ? item.net_price : item.price) * item.quantity).toLocaleString('vi-VN')}₫
										</Typography>
									</FlexBox>
								</Box>
							</FlexBox>

							{
								item.name_option && (
									<FlexBox flex="1 1 260px" m="6px" alignItems="center">
										<Typography fontSize="14px" color="text.muted">
											Thuộc tính: {item.name_option}
										</Typography>
									</FlexBox>)
							}

							{response.data.status !== 7 && item.is_prepared === 0 && (
								<FlexBox flex="0 0 0 !important" m="6px" alignItems="center">
									<Tooltip label="Confirm Order" fontSize="md">
										<Button bg="green" color="white"
											onClick={() => handleConfirmOrder(item)}
										>{Action.CONFIRM}</Button>
									</Tooltip>
								</FlexBox>
							)
							}
						</FlexBox>
					))}
				</Box>
			</Card>

			{response && <Grid container spacing={6}>
				<Grid item lg={6} md={6} xs={12}>
					<Card p="20px 30px" mb="1.5rem">
						<H5 mt="0px" mb="14px">
							{Content.ADDRESS_DELIVERY}
						</H5>
						<H6 my="0px">{response.data.delivery.shipping_name} | {response.data.delivery.shipping_phone}
						</H6>
						<H6 my="0px">{response.data.delivery.shipping_address}
						</H6>
					</Card>

				</Grid>
				{response &&
					(
						<Grid item lg={6} md={6} xs={12}>
							<Card p="20px 30px" mb="1.5rem">
								<H5 mt="0px" mb="14px">
									{Content.TOTAL}
								</H5>
								<FlexBox
									justifyContent="space-between"
									alignItems="center"
									mb="0.5rem"
								>
									<Typography fontSize="14px" color="text.hint">
										{Content.GOODS_MONEY}:
									</Typography>
									<H6 my="0px">{
										response.data.store_order_amount.toLocaleString('vi-VN')}₫
									</H6>
								</FlexBox>
								<FlexBox
									justifyContent="space-between"
									alignItems="center"
									mb="0.5rem"
								>
									<Typography fontSize="14px" color="text.hint">
										{Content.SHIPPING_FEE}:
									</Typography>
									<H6 my="0px">{
										response.data.delivery.cost.toLocaleString("vi-VN")}₫
									</H6>
								</FlexBox>

								<FlexBox
									justifyContent="space-between"
									alignItems="center"
									mb="0.5rem"
								>
									<Typography fontSize="14px" color="text.hint">
										{Content.COMMERCIAL_FLOOR_FEE}:
									</Typography>
									<H6 my="0px">{
										response.data.commission_detail.system_fee.toLocaleString("vi-VN")}₫
										({Math.ceil(response.data.commission_detail.system_fee / response.data.store_order_amount * 100)}%)
									</H6>
								</FlexBox>

								<FlexBox
									justifyContent="space-between"
									alignItems="center"
									mb="0.5rem"
								>
									<Typography fontSize="14px" color="text.hint">
										{Content.MONEY_RECEIVED_BY_THE_SHOP}:
									</Typography>
									<H6 my="0px">{
										response.data.commission_detail.amount_received.toLocaleString("vi-VN")}₫
									</H6>
								</FlexBox>

								<Divider mb="0.5rem" />

								<Typography
									fontSize="14px">{response.data.payment_method === 1 ? " Thanh toán khi nhận hàng" : response.data.payment_method === 2 ?
										" Thanh toán bằng paypal" : " Thanh toán bằng ví Latipe"}</Typography>
							</Card>

							{response && response.data.status === 1 &&
								<Button variant="contained" color="primary" ml="auto"
									onClick={handleCancelOrder}
								>
									{Action.CANCEL_ORDER}
								</Button>
							}
						</Grid>
					)}

			</Grid>}
		</div>
	);
};

OrderDetails.layout = VendorDashboardLayout;

export default OrderDetails;
