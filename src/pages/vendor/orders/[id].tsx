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
import {
	StoreOrderDetailResponse
} from "@interfaces/order";
import {
	getStoreOrderDetail,
	updateOrderItemStatusByStore
} from "@stores/slices/orders-slice";
import { Chip } from "@components/Chip";
import { Tooltip } from "@chakra-ui/react";
import { Action, Content, OrderStatus, Prepare, Title } from "@/utils/constants";
import { vi } from "date-fns/locale";
import { getColorStatusOrder, getStrStatusOrder } from "@/utils/utils";

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

	const handleCancelOrder = () => {
		dispatch(updateOrderItemStatusByStore({
			id: response.data.order_id,
			body: {
				message: Content.CANCEL_ORDER_SUCCESS,
				status: OrderStatus.ORDER_CANCEL_BY_STORE
			}
		})).unwrap().then((res) => {
			if (res.data.error_code) {
				navigate("/401");
				return;
			}
			const newResponse = { ...response };
			newResponse.data.status = OrderStatus.ORDER_CANCEL_BY_STORE;
			setResponse(newResponse);
		});
	}

	const handleConfirmOrder = (status: number) => {
		dispatch(updateOrderItemStatusByStore({
			id: response.data.order_id,
			body: {
				message: Content.CONFIRM_ORDER_SUCCESS,
				status,
			}
		})).unwrap().then((res) => {
			if (res.data.error_code) {
				navigate("/401");
				return;
			}
			const newResponse = { ...response };
			newResponse.data.status = status;
			newResponse.data.order_items = newResponse.data.order_items.map((i) => {
				i.is_prepared = Prepare.YES;
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
							<Chip p="0.25rem 1rem" bg={`${getColorStatusOrder(response.data.status)}.light`}>
								<Small textAlign="center"
									color={`${getColorStatusOrder(response.data.status)}.main`}>{getStrStatusOrder(response.data.status)}</Small>
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
									{/* TODO: remove comment */}
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
									{/* TODO: remove comment */}
									<H6 my="0px">{
										response.data.commission_detail.amount_received.toLocaleString("vi-VN")}₫
									</H6>
								</FlexBox>

								<Divider mb="0.5rem" />

								<Typography
									fontSize="14px">{response.data.payment_method === 1 ? " Thanh toán khi nhận hàng" : response.data.payment_method === 2 ?
										" Thanh toán bằng paypal" : " Thanh toán bằng ví Latipe"}</Typography>
							</Card>

							{response && response.data.status === OrderStatus.ORDER_CREATED && (
								<FlexBox justifyContent="flex-end" alignItems="center" gap="20px">
									<Button style={{ color: 'white', marginRight: '20px' }}
										variant="contained"
										color="error" // Changed to 'error' for a red theme color
										onClick={handleCancelOrder}
										aria-label="Cancel Order"
									>
										{Action.CANCEL_ORDER}
									</Button>
									<Tooltip label="Confirm Order" fontSize="md">
										<Button style={{ color: 'white' }}
											variant="contained"
											color="success"
											onClick={() => handleConfirmOrder(OrderStatus.ORDER_PREPARED)}
											aria-label="Confirm Order"
										>
											{Action.CONFIRM}
										</Button>
									</Tooltip>
								</FlexBox>
							)}
						</Grid>
					)}

			</Grid>}
		</div>
	);
};

OrderDetails.layout = VendorDashboardLayout;

export default OrderDetails;
