import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@components/avatar/Avatar";
import Box from "@components/Box";
import Card from "@components/Card";
import Divider from "@components/Divider";
import FlexBox from "@components/FlexBox";
import Grid from "@components/grid/Grid";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import TableRow from "@components/TableRow";
import Typography, { H5, H6, Small } from "@components/Typography";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { useEffect, useState } from "react";
import { AdminOrderDetailResponse } from "@interfaces/order";
import { getDeliveryOrderDetail, updateStatusOrderByDelivery } from "@stores/slices/orders-slice";
import { Chip } from "@components/Chip";
import { Button, Flex } from "@chakra-ui/react";
import { vi } from "date-fns/locale";
import { getColorStatusOrder, getStrStatusOrder } from "@/utils/utils";
import { OrderStatus } from "@/utils/constants";

const OrderDetailDelivery = () => {

	const { id } = useParams();
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [response, setResponse] = useState<AdminOrderDetailResponse>(null);

	useEffect(() => {
		dispatch(getDeliveryOrderDetail(id)).unwrap().then((res) => {
			if (res.data.error_code) {
				navigate("/401");
				return;
			}
			setResponse(res.data);
			console.log("12312 " + res.data.data.order.status);

		});
	}, []);

	const handleUpdateStatus = (status: number) => {
		dispatch(updateStatusOrderByDelivery({
			id: response.data.order.order_id,
			status: status
		})).unwrap().then((res) => {
			if (res.data.error_code) {
				navigate("/401");
				return;
			}
			const newResponse = { ...response };
			newResponse.data.order.status = status;
			setResponse(newResponse);
		});
	};
	return (
		<Box
			px={4}
			py={4}
		>
			<DashboardPageHeader
				title="Chi tiết đơn hàng"
				iconName="bag_filled"
			/>
			<Box display="flex" justifyContent="flex-end">
				<Button color="primary" bg="primary.light" px="2rem" onClick={() => navigate(-1)}>
					Quay lại
				</Button>
			</Box>

			<Card p="0px" mb="30px" overflow="hidden">
				<TableRow bg="gray.200" p="12px" boxShadow="none" borderRadius={0}>
					<FlexBox
						className="pre"
						flex="0 0 0 !important"
						m="6px"
						alignItems="center"
					>
						<Typography fontSize="14px" color="text.muted" mr="4px">
							Mã đơn hàng:
						</Typography>
						<Typography fontSize="14px" fontWeight={"bold"}>{id.toUpperCase()}</Typography>
					</FlexBox>
					{response && response.data &&
						<FlexBox
							className="pre"
							flex="0 0 0 !important"
							m="6px"
							alignItems="center"
						>
							<Box m="6px">
								<Chip p="0.25rem 1rem" bg={`${getColorStatusOrder(response.data.order.status)}.light`}>
									<Small textAlign="center"
										color={`${getColorStatusOrder(response.data.order.status)}.main`}>{getStrStatusOrder(response.data.order.status)}</Small>
								</Chip>
							</Box>
						</FlexBox>}
					<FlexBox className="pre" m="6px" justifyContent="flex-end">
						<Typography fontSize="14px" color="text.muted" mr="4px">
							Đặt hàng lúc:
						</Typography>
						<Typography fontSize="14px">
							{format(new Date(), "dd MMM, yyyy", { locale: vi })}
						</Typography>
					</FlexBox>
				</TableRow>

				<Box py="0.5rem">
					{response && response.data && response.data.order.order_items.map((item) => (
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
											{(item.price * item.quantity).toLocaleString('vi-VN')}₫
										</Typography>
									</FlexBox>
								</Box>
							</FlexBox>

							{
								item.name_option && (<FlexBox flex="1 1 260px" m="6px" alignItems="center">
									<Typography fontSize="14px" color="text.muted">
										Thuộc tính: {item.name_option}
									</Typography>
								</FlexBox>)
							}

							{/* {response.data.order.status === 1 && item.is_prepared === 1 && (
								<FlexBox flex="0 0 0 !important" m="6px" alignItems="center">
									<Typography fontSize="14px" color="text.muted">
										Thuộc tính: {item.name_option}
									</Typography>
								</FlexBox>
							)} */}

						</FlexBox>
					))}
				</Box>
			</Card>

			{response && response.data &&
				<Grid container spacing={6}>
					<Grid item lg={6} md={6} xs={12} style={{ display: 'flex' }}>
						<Card p="20px 30px" mb="1.5rem" style={{ flexGrow: 1 }}>
							<H5 mt="0px" mb="14px">
								Địa chỉ giao hàng
							</H5>
							<H6 my="0px">{response.data.order.delivery.shipping_name} | {response.data.order.delivery.shipping_phone}
							</H6>
							<H6 my="0px">{response.data.order.delivery.shipping_address}
							</H6>
						</Card>
					</Grid>
					<Grid item lg={6} md={6} xs={12} style={{ display: 'flex' }}>
						<Card p="20px 30px" mb="1.5rem" style={{ flexGrow: 1 }}>
							{response.data.order.order_status.map((item) => (
								<H6 my="0px">{format(new Date(item.created_at), "HH:mm dd-MM-yyyy")} | {item.message}
								</H6>
							))}
						</Card>
					</Grid>
					{response &&
						<Grid item xl={12} lg={12} md={12} xs={12}>
							<Card p="20px 30px" mb="1.5rem">
								<H5 mt="0px" mb="14px">
									Tổng cộng
								</H5>
								<FlexBox
									justifyContent="space-between"
									alignItems="center"
									mb="0.5rem"
								>
									<Typography fontSize="14px" color="text.hint">
										Tiền hàng:
									</Typography>
									<H6 my="0px">{
										response.data.order.amount.toLocaleString('vi-VN')}₫
									</H6>
								</FlexBox>
								<FlexBox
									justifyContent="space-between"
									alignItems="center"
									mb="0.5rem"
								>
									<Typography fontSize="14px" color="text.hint">
										Phí ship:
									</Typography>
									<H6 my="0px">{
										response.data.order.delivery.cost.toLocaleString("vi-VN")}₫
									</H6>
								</FlexBox>
								<Divider mb="0.5rem" />

								<Typography
									fontSize="14px">{response.data.order.payment_method === 1 ? " Thanh toán khi nhận hàng" : response.data.order.payment_method === 2 ?
										" Thanh toán bằng paypal" : " Thanh toán bằng ví Latipe"}</Typography>
							</Card>

						</Grid>
					}

				</Grid>
			}
			{response && (response.data.order.status === OrderStatus.ORDER_PREPARED) &&
				<Flex direction="row" justifyContent="space-between">
					<Button
						bg="red"
						color="white"
						onClick={() => handleUpdateStatus(OrderStatus.ORDER_CANCEL_BY_DELI)}
						p={4}
						borderRadius="md"
						_hover={{ bg: "red.400" }}
						mr={2}
					>
						Không tiếp nhận đơn hàng
					</Button>
					<Button
						bg="green"
						color="white"
						onClick={() => handleUpdateStatus(OrderStatus.ORDER_DELIVERY)}
						p={4}
						borderRadius="md"
						ml={2}
						_hover={{ bg: "green.400" }}
					// _hover={{ filter: "blur(2px)" }}
					>
						Đã tiếp nhận đơn hàng
					</Button>
				</Flex>
			}

			{response && (response.data.order.status === OrderStatus.ORDER_DELIVERY) &&
				<Flex direction="row" justifyContent="space-between">
					<Button
						bg="red"
						color="white"
						onClick={() => handleUpdateStatus(OrderStatus.ORDER_CANCEL_USER_REJECT)}
						p={4}
						borderRadius="md"
						_hover={{ bg: "red.400" }}
						mr={2}
					>
						Người mua không nhận hàng
					</Button>
					<Button
						bg="green"
						color="white"
						onClick={() => handleUpdateStatus(OrderStatus.ORDER_SHIPPING_FINISH)}
						p={4}
						borderRadius="md"
						ml={2}
						_hover={{ bg: "green.400" }}
					// _hover={{ filter: "blur(2px)" }}
					>
						Giao hàng thành công
					</Button>
				</Flex>
			}
		</Box>

	);
}

export default OrderDetailDelivery;
