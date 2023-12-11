import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../../../components/avatar/Avatar";
import Box from "../../../components/Box";
import Button from "../../../components/buttons/Button";
import Card from "../../../components/Card";
import Divider from "../../../components/Divider";
import FlexBox from "../../../components/FlexBox";
import Grid from "../../../components/grid/Grid";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import TableRow from "../../../components/TableRow";
import Typography, { H5, H6, Small } from "../../../components/Typography";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "store/store";
import { useEffect, useState } from "react";
import { AdminOrderDetailResponse } from "api/interface/order";
import { getAdminOrderDetail } from "../../../store/slices/orders-slice";
import { Chip } from "../../../components/Chip";

const OrderDetailAdmin = () => {

	const { id } = useParams();
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [response, setResponse] = useState<AdminOrderDetailResponse>();

	useEffect(() => {
		dispatch(getAdminOrderDetail(id)).unwrap().then((res) => {
			if (res.data.error_code) {
				navigate("/401");
				return;
			}
			setResponse(res.data);
		});
	}, []);

	const handleRenderStaus = (): string => {
		switch (response.data.order.status) {
			case 0:
				return "Đang xử lý";
			case 1:
				return "Tạo đơn hàng thành công";
			case 2:
				return "Đã giao cho ĐVVC";
			case 3:
				return "Đang trên đường vận chuyển";
			case 4:
				return "Vận chuyển thành công";
			case 5:
				return "Đơn hàng đã hoàn thành";
			case 6:
				return "Đang hoàn tiền";
			case 7:
				return "Đã hủy";
			default:
				return "Mua hàng thất bại";
		}
	}

	const getColor = (status) => {
		switch (status) {
			case 0:
			case 1:
				return "secondary";
			case 2:
			case 3:
				return "secondary";
			case 4:
			case 5:
			case 6:
				return "success";
			case 7:
			case -1:
				return "error";
			default:
				return "";
		}
	};

	return (
		<div>
			<DashboardPageHeader
				title="Chi tiết đơn hàng"
				iconName="bag_filled"
			/>
			<Box display="flex" justifyContent="flex-end">
				<Button color="primary" bg="primary.light" px="2rem" onClick={() => navigate(-1)} >
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
							Order ID:
						</Typography>
						<Typography fontSize="14px" fontWeight={"bold"}>{id.toUpperCase()}</Typography>
					</FlexBox>
					{response &&
						<FlexBox
							className="pre"
							flex="0 0 0 !important"
							m="6px"
							alignItems="center"
						>
							<Box m="6px">
								<Chip p="0.25rem 1rem" bg={`${getColor(response.data.order.status)}.light`}>
									<Small textAlign="center" color={`${getColor(response.data.order.status)}.main`}>{handleRenderStaus()}</Small>
								</Chip>
							</Box>
						</FlexBox>}
					<FlexBox className="pre" m="6px" justifyContent="flex-end" >
						<Typography fontSize="14px" color="text.muted" mr="4px">
							Đặt hàng lúc:
						</Typography>
						<Typography fontSize="14px">
							{format(new Date(), "dd MMM, yyyy")}
						</Typography>
					</FlexBox>
				</TableRow>

				<Box py="0.5rem">
					{response && response.data.order.order_items.map((item) => (
						<FlexBox
							px="1rem"
							py="0.5rem"
							flexWrap="wrap"
							alignItems="center"
							key={item}
						>
							<FlexBox flex="2 2 260px" m="6px" alignItems="center"  >
								<Avatar src={item.image ? item.image : "/assets/images/products/imagetree.png"} size={64} />
								<Box ml="20px">
									<H6 my="0px">{item.product_name}</H6>
									<FlexBox alignItems="center" justifyContent="space-between">
										<Typography fontSize="14px" color="text.muted">
											{item.net_price > 0 && <del>{item.price.toLocaleString('vi-VN')}₫</del>} {(item.net_price > 0 ? item.net_price : item.price).toLocaleString('vi-VN')}₫ x {item.quantity}
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

							{response.data.order.status === 1 && item.is_prepared === 1 && (
								<FlexBox flex="0 0 0 !important" m="6px" alignItems="center">
									<Typography fontSize="14px" color="text.muted">
										Thuộc tính: {item.name_option}
									</Typography>
								</FlexBox>
							)}

						</FlexBox>
					))}
				</Box>
			</Card>

			{response && <Grid container spacing={6}>
				<Grid container alignItems="stretch" style={{ width: '100%' }}>
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
				</Grid>
				{response &&
					(
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

								{/* <FlexBox
									justifyContent="space-between"
									alignItems="center"
									mb="0.5rem"
								>
									<Typography fontSize="14px" color="text.hint">
										Phí nền tảng:
									</Typography>
									<H6 my="0px">{
										response.data.order.commission_detail.system_fee.toLocaleString("vi-VN")}₫ ({Math.ceil(response.data.order.commission_detail.system_fee / response.data.order.store_order_amount * 100)}%)
									</H6>
								</FlexBox> */}

								{/* <FlexBox
									justifyContent="space-between"
									alignItems="center"
									mb="0.5rem"
								>
									<Typography fontSize="14px" color="text.hint">
										Tiền shop nhận được:
									</Typography>
									<H6 my="0px">{
										response.data.order.commission_detail.amount_received.toLocaleString("vi-VN")}₫
									</H6>
								</FlexBox> */}

								<Divider mb="0.5rem" />

								<Typography fontSize="14px">{response.data.order.payment_method === 1 ? " Thanh toán khi nhận hàng" : response.data.order.payment_method === 2 ?
									" Thanh toán qua thẻ" : " Thanh toán bằng ví Latipe"}</Typography>
							</Card>

						</Grid>
					)}

			</Grid>}
		</div >
	);
}

export default OrderDetailAdmin;
