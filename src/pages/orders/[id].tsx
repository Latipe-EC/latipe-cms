import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../../../src/components/avatar/Avatar";
import Box from "../../../src/components/Box";
import Button from "../../../src/components/buttons/Button";
import Card from "../../../src/components/Card";
import Divider from "../../../src/components/Divider";
import FlexBox from "../../../src/components/FlexBox";
import Grid from "../../../src/components/grid/Grid";
import Icon from "../../../src/components/icon/Icon";
import DashboardLayout from "../../../src/components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../../../src/components/layout/DashboardPageHeader";
import TableRow from "../../../src/components/TableRow";
import Typography, { H5, H6, Paragraph } from "../../../src/components/Typography";
import productDatabase from "../../data/product-database";
import useWindowSize from "../../hooks/useWindowSize";
import { format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../store/store";
import { getOrderById } from "../../store/slices/orders-slice";
import { DataGetOrderById } from "api/interface/order";
import { set } from "lodash";

type OrderStatus = "packaging" | "shipping" | "delivering" | "complete";

const OrderDetails = () => {
	const orderStatus: OrderStatus = "shipping";
	const orderStatusList = ["packaging", "shipping", "delivering", "complete"];
	const stepIconList = ["package-box", "payment_success", "truck-1", "receive_package", "rating"];
	const statusIndex = orderStatusList.indexOf(orderStatus);
	const size = useWindowSize();
	const breakpoint = 350;
	const navigate = useNavigate();
	const { id } = useParams();
	const dispatch = useDispatch<AppThunkDispatch>();

	const [orderDetail, setOrderDetail] = useState<DataGetOrderById>();

	useEffect(() => {
		dispatch(getOrderById(id)).unwrap().then((res) => {
			if (res.status === 200)
				setOrderDetail(res.data.data);
			else
				navigate('/404');
		});
	}, []);
	return (

		<div>
			<DashboardPageHeader
				title="Chi tiết đơn hàng"
				iconName="bag_filled"
				button={
					<Button color="primary" bg="primary.light" px="2rem" onClick={() => navigate("/orders")}>
						Quay trở lại đơn hàng
					</Button>
				}
			/>

			<Card p="2rem 1.5rem" mb="30px">
				<FlexBox
					flexDirection={size.width < breakpoint ? "column" : "row"}
					justifyContent="space-between"
					alignItems="center"
					flexWrap="wrap"
					my="2rem"
				>
					{stepIconList.map((item, ind) => (
						<Fragment key={item}>
							<Box position="relative">
								<Avatar
									size={64}
									bg={ind <= statusIndex ? "primary.main" : "gray.300"}
									color={ind <= statusIndex ? "gray.white" : "primary.main"}
								>
									<Icon size="32px" defaultcolor="currentColor">
										{item}
									</Icon>
								</Avatar>
								{ind < statusIndex && (
									<Box position="absolute" right="0" top="0">
										<Avatar size={22} bg="gray.200" color="success.main">
											<Icon size="12px" defaultcolor="currentColor">
												done
											</Icon>
										</Avatar>
									</Box>
								)}
							</Box>
							{ind < stepIconList.length - 1 && (
								<Box
									flex={size.width < breakpoint ? "unset" : "1 1 0"}
									height={size.width < breakpoint ? 50 : 4}
									minWidth={size.width && size.width < breakpoint ? 4 : 50}
									bg={ind < statusIndex ? "primary.main" : "gray.300"}
								/>
							)}
						</Fragment>
					))}
				</FlexBox>

				<FlexBox justifyContent={size.width < breakpoint ? "center" : "flex-end"}>
					<Typography
						p="0.5rem 1rem"
						borderRadius="300px"
						bg="primary.light"
						color="primary.main"
						textAlign="center"
					>
						Estimated Delivery Date <b>4th October</b>
					</Typography>
				</FlexBox>
			</Card>

			<Card p="0px" mb="30px" overflow="hidden">
				<TableRow bg="gray.200" p="12px" boxShadow="none" borderRadius={0}>
					<FlexBox className="pre" m="6px" alignItems="center">
						<Typography fontSize="14px" color="text.muted" mr="4px">
							Order ID:
						</Typography>
						<Typography fontSize="14px">9001997718074513</Typography>
					</FlexBox>
					<FlexBox className="pre" m="6px" alignItems="center">
						<Typography fontSize="14px" color="text.muted" mr="4px">
							Placed on:
						</Typography>
						<Typography fontSize="14px">
							{format(new Date(), "dd MMM, yyyy")}
						</Typography>
					</FlexBox>
					<FlexBox className="pre" m="6px" alignItems="center">
						<Typography fontSize="14px" color="text.muted" mr="4px">
							Delivered on:
						</Typography>
						<Typography fontSize="14px">
							{format(new Date(), "dd MMM, yyyy")}
						</Typography>
					</FlexBox>
				</TableRow>

				<Box py="0.5rem">
					{productDatabase.slice(179, 182).map((item) => (
						<FlexBox
							px="1rem"
							py="0.5rem"
							flexWrap="wrap"
							alignItems="center"
							key={item.id}
						>
							<FlexBox flex="2 2 260px" m="6px" alignItems="center">
								<Avatar src={item.imgUrl} size={64} />
								<Box ml="20px">
									<H6 my="0px">{item.title}</H6>
									<Typography fontSize="14px" color="text.muted">
										${item.price} x 1
									</Typography>
								</Box>
							</FlexBox>
							<FlexBox flex="1 1 260px" m="6px" alignItems="center">
								<Typography fontSize="14px" color="text.muted">
									Product properties: Black, L
								</Typography>
							</FlexBox>
							<FlexBox flex="160px" m="6px" alignItems="center">
								<Button variant="text" color="primary">
									<Typography fontSize="14px">Write a Review</Typography>
								</Button>
							</FlexBox>
						</FlexBox>
					))}
				</Box>
			</Card>

			<Grid container spacing={6}>
				<Grid item lg={6} md={6} xs={12}>
					<Card p="20px 30px">
						<H5 mt="0px" mb="14px">
							Shipping Address
						</H5>
						<Paragraph fontSize="14px" my="0px">
							Kelly Williams 777 Brockton Avenue, Abington MA 2351
						</Paragraph>
					</Card>
				</Grid>
				<Grid item lg={6} md={6} xs={12}>
					<Card p="20px 30px">
						<H5 mt="0px" mb="14px">
							Total Summary
						</H5>
						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="0.5rem"
						>
							<Typography fontSize="14px" color="text.hint">
								Subtotal:
							</Typography>
							<H6 my="0px">$335</H6>
						</FlexBox>
						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="0.5rem"
						>
							<Typography fontSize="14px" color="text.hint">
								Shipping fee:
							</Typography>
							<H6 my="0px">$10</H6>
						</FlexBox>
						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="0.5rem"
						>
							<Typography fontSize="14px" color="text.hint">
								Discount:
							</Typography>
							<H6 my="0px">-$30</H6>
						</FlexBox>

						<Divider mb="0.5rem" />

						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="1rem"
						>
							<H6 my="0px">Total</H6>
							<H6 my="0px">$315</H6>
						</FlexBox>
						<Typography fontSize="14px">Paid by Credit/Debit Card</Typography>
					</Card>
				</Grid>
			</Grid>
		</div>
	);
};

const steps = [
	{ title: 'Đơn hàng đã đặt', description: 'Contact Info' },
	{ title: 'Đơn hàng đã thanh toán ', description: 'Date & Time' },
	{ title: 'Đã giao cho ĐVVC', description: 'Select Rooms' },
	{ title: 'Đã nhận được hàng', description: 'Select Rooms' },
	{ title: 'Đánh giá', description: 'Select Rooms' },
]

OrderDetails.layout = DashboardLayout;

export default OrderDetails;
