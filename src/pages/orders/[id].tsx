import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@components/avatar/Avatar";
import Box from "@components/Box";
import Button from "@components/buttons/Button";
import Card from "@components/Card";
import Divider from "@components/Divider";
import FlexBox from "@components/FlexBox";
import Grid from "@components/grid/Grid";
import Icon from "@components/icon/Icon";
import DashboardLayout from "@components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import TableRow from "@components/TableRow";
import Typography, { H5, H6 } from "@components/Typography";
import useWindowSize from "../../hooks/useWindowSize";
import { format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { cancelOrder, getOrderById, refundOrder } from "@stores/slices/orders-slice";
import { DataGetOrderById, OrderItem } from "@interfaces/order";
import {
	Button as ButtonChakra,
	Center,
	Flex as FlexCharkra,
	Heading,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useToast
} from "@chakra-ui/react";
import {
	CheckPaymentOrderResponse,
	EPaymentMethod,
	EPaymentStatus
} from "../../api/interface/payment";
import { checkPaymentOrder, validPayment } from "@stores/slices/payment-slice";
import { getMyProfile } from "@stores/slices/user-slice";
import { StarIcon, WarningIcon } from "@chakra-ui/icons";
import {
	createRating,
	deleteRating,
	getRatingDetail,
	updateRating
} from "@stores/slices/ratings-slice";
import { RatingResponse } from "@interfaces/rating";
import { Action, Content, OrderStatus, PaymentMethodName, Title } from "@/utils/constants";
import { vi } from "date-fns/locale";
import { getPaymentMethod } from "@/utils/utils";

const OrderDetails = () => {
	const stepIconList = ["package-box", "payment_success", "truck-1", "receive_package", "rating"];
	const size = useWindowSize();
	const breakpoint = 350;
	const navigate = useNavigate();
	const { id } = useParams();
	const dispatch = useDispatch<AppThunkDispatch>();
	const toast = useToast();

	const [displayModalCancelOrder, setDisplayModalCancelOrder] = useState(false);
	const [orderDetail, setOrderDetail] = useState<DataGetOrderById>();
	const [displayRating, setDisplayRating] = useState<OrderItem>(null);
	const [selectedOrder, setSelectedOrder] = useState<string>();
	const [statusPaymentOrder, setStatusPaymentOrder] = useState<CheckPaymentOrderResponse>();
	const [profile, setProfile] = useState(null);
	const [ratingComment, setRatingComment] = useState<string>();
	const [ratingStar, setRatingStar] = useState<number>();
	const [detailRating, setDetailRating] = useState<RatingResponse>(null);
	const [viewRating, setViewRating] = useState<OrderItem>(null);
	const [showRefundModal, setShowRefundModal] = useState(false);

	useEffect(() => {
		dispatch(getOrderById(id)).unwrap().then((res) => {
			if (!res.data.error_code)
				setOrderDetail(res.data.data);
			else
				navigate('/404');

		});
		dispatch(checkPaymentOrder(id)).unwrap().then((res) => {
			if (res.status !== 200)
				navigate('/404');
			else
				setStatusPaymentOrder(res.data);
		});
		dispatch(getMyProfile()).unwrap().then((res) => {
			setProfile(res.data)
		});
	}, []);

	const handleRefundOrder = () => {
		dispatch(refundOrder({ order_id: selectedOrder })).unwrap().then((res) => {
			if (res.status === 200) {
				const newOrder = { ...orderDetail };
				newOrder.order.status = OrderStatus.ORDER_CANCEL_BY_USER;
				setOrderDetail(newOrder);
			} else {
				toast({
					title: "Hoàn tiền thất bại",
					description: "Xin vui lòng thử lại sau.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
			setShowRefundModal(false);
		})
	};

	const handleCancleOrder = () => {
		dispatch(cancelOrder({ order_id: selectedOrder })).unwrap().then((res) => {
			if (res.status === 200) {
				const newOrder = { ...orderDetail };
				newOrder.order.status = OrderStatus.ORDER_CANCEL_BY_USER;
				setOrderDetail(newOrder);
			} else {
				toast({
					title: "Hủy đơn hàng thất bại",
					description: "Xin vui lòng thử lại sau.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
			setDisplayModalCancelOrder(false);
		})
	};

	const handleOrderNow = () => {
		if (statusPaymentOrder.paymentMethod === EPaymentMethod.PAYPAL) {
			navigate(`/payment-paypal/${id}`);
		} else {
			dispatch(validPayment({ orderId: id })).unwrap().then((res) => {
				if (res.status === 200) {
					window.location.reload();
				} else {
					toast({
						title: "Thanh toán thất bại",
						description: "Xin vui lòng thử lại sau.",
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				}
			});
		}
	}

	const handleUploadRating = () => {
		dispatch(createRating({
			content: ratingComment,
			rating: ratingStar,
			storeId: orderDetail.order.store_id,
			productId: displayRating.product_id,
			orderItemId: displayRating.item_id,
		})).unwrap().then((res) => {
			if (res.status === 201) {
				const newOrder = { ...orderDetail };
				newOrder.order.order_items.map((item) => {
					if (item.item_id === displayRating.item_id) {
						item.rating_id = res.data.id;
					}
				});
				setOrderDetail(newOrder);
				setDisplayRating(null);
				setRatingComment(null);
				setRatingStar(null);
			} else {
				toast({
					title: "Đánh giá thất bại",
					description: "Xin vui lòng thử lại sau.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		});
	}

	const handleViewRating = (orderItem: OrderItem) => {
		dispatch(getRatingDetail(orderItem.rating_id)).unwrap().then((res) => {
			setDetailRating(res.data);
			setViewRating(orderItem);
		});
	}

	const handleUpdateRating = () => {
		dispatch(updateRating({
			id: detailRating.id,
			content: detailRating.content,
			rating: detailRating.rating,
		})).unwrap().then((res) => {
			if (res.status === 200) {
				const newOrder = { ...orderDetail };
				newOrder.order.order_items.map((item) => {
					if (item.item_id === viewRating.item_id) {
						item.rating_id = res.data.id;
					}
				});
				setOrderDetail(newOrder);
				setViewRating(null);
			} else {
				toast({
					title: "Cập nhật đánh giá thất bại",
					description: "Xin vui lòng thử lại sau.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		});
	}

	const handleDeleteRating = () => {
		console.log(detailRating);
		dispatch(deleteRating(detailRating.id)).unwrap().then((res) => {
			if (res.status === 200) {
				const newOrder = { ...orderDetail };
				newOrder.order.order_items.map((item) => {
					if (item.item_id === viewRating.item_id) {
						item.rating_id = null;
					}
				});
				setOrderDetail(newOrder);
				setViewRating(null);
			} else {
				toast({
					title: "Xóa đánh giá thất bại",
					description: "Xin vui lòng thử lại sau.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
		});
	}

	const isOlderThanSevenDays = () => {
		if (orderDetail.order.status !== OrderStatus.ORDER_COMPLETED)
			return true;
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		return new Date(orderDetail.order.created_at) < sevenDaysAgo;
	}

	const handleStatusIcon = (index: number) => {
		if (index === 0) {
			return true
		} else if (index === 1) {
			if (orderDetail.order.status >= 1 &&
				(orderDetail.order.payment_method === getPaymentMethod(PaymentMethodName.COD)
					|| statusPaymentOrder.paymentStatus === EPaymentStatus.COMPLETED))
				return true;
			else
				return false;
		} else if (index === 2) {
			return orderDetail.order.status >= 3;
		} else if (index === 3 || index === 4) {
			return orderDetail.order.status >= 5;
		}
	}

	const handleStatusLine = (index: number) => {
		if (index === 0) {
			return true
		} else if (index === 1) {
			if (orderDetail.order.status >= 1 && (orderDetail.order.payment_method === 1 || statusPaymentOrder.paymentStatus === EPaymentStatus.COMPLETED))
				return true;
			else
				return false;
		} else if (index === 2) {
			if (orderDetail.order.status >= 3)
				return true;
			else
				return false;
		} else if (index === 3) {
			if (orderDetail.order.status >= 4)
				return true;
			else
				return false;
		}
	}

	const handleStatusDone = (index: number) => {
		if (index === 0) {
			return orderDetail.order.status > 0;
		} else if (index === 1) {
			if (orderDetail.order.status >= 1
				&&
				(orderDetail.order.payment_method === 1 || statusPaymentOrder.paymentStatus === EPaymentStatus.COMPLETED))
				return true;
			else
				return false;
		} else if (index === 2) {
			return orderDetail.order.status >= 3;
		} else if (index === 3) {
			return orderDetail.order.status >= 4;
		} else if (index === 4) {
			return (orderDetail.order.status >= 5 && orderDetail.order.order_items.some(x => x.rating_id) && (isOlderThanSevenDays() || orderDetail.order.order_items.every(item => item.rating_id)));
		}
	}

	const handleMessageOrderCancel = (status: number): string => {
		switch (status) {
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
		}

	}

	return (
		<div>
			{orderDetail && statusPaymentOrder && (<>
				<DashboardPageHeader
					title="Chi tiết đơn hàng"
					iconName="bag_filled"
					button={
						<Button color="primary" bg="primary.light" px="2rem"
							onClick={() => navigate("/orders")}>
							{Action.RETURN_ORDER_PAGE}
						</Button>
					}
				/>

				{viewRating !== null &&
					<Modal isOpen={viewRating !== null} onClose={() => setViewRating(null)} isCentered
						size={"xl"}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>{Title.RATING_PRODUCT}</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Box mb={4}>
									<Image boxSize="100px" src={viewRating.image} alt={viewRating.product_name} />
									<Text>{viewRating.product_name}</Text>
								</Box>
								<Box d="flex" mb={4}
								>
									{[...Array(5)].map((_, i) => (
										<StarIcon
											key={i}
											color={i < detailRating.rating ? "teal.500" : "gray.300"}
											onClick={() =>
												setDetailRating({ ...detailRating, rating: i + 1 })}
											cursor={"pointer"}
										/>
									))}
								</Box>
								<Textarea placeholder="Viết đánh giá" value={detailRating.content}
									onChange={(e) => setDetailRating({
										...detailRating,
										content: e.target.value
									})}
									maxLength={200}
									resize="none"
								/>
							</ModalBody>
							<ModalFooter>
								<ButtonChakra colorScheme="red" variant="ghost" onClick={handleDeleteRating}
									mr={2}>{Action.DELETE}</ButtonChakra>
								<ButtonChakra
									isDisabled={detailRating.content === "" || detailRating.rating === 0 || detailRating.isChange}
									colorScheme="green" mr={3} onClick={handleUpdateRating}>
									{Action.EDIT}
								</ButtonChakra>
							</ModalFooter>
						</ModalContent>
					</Modal>}

				{displayRating &&
					<Modal isOpen={displayRating !== null} onClose={() => setDisplayRating(null)}
						isCentered
						size={"xl"}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>{Title.RATING_PRODUCT}</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Box mb={4}>
									<Image boxSize="100px" src={displayRating.image}
										alt={displayRating.product_name} />
									<Text>{displayRating.product_name}</Text>
								</Box>
								<Box d="flex" mb={4}
								>
									{[...Array(5)].map((_, i) => (
										<StarIcon
											key={i}
											color={i < ratingStar ? "teal.500" : "gray.300"}
											onClick={() => setRatingStar(i + 1)}
											cursor={"pointer"}
										/>
									))}
								</Box>
								<Textarea placeholder={Action.WRITE_RATING} value={ratingComment}
									maxLength={200}
									resize="none"
									onChange={(e) => setRatingComment(e.target.value)} />
							</ModalBody>
							<ModalFooter>
								<ButtonChakra colorScheme="red" variant="ghost"
									onClick={() => setDisplayRating(null)} mr={2}>{Action.CANCEL}</ButtonChakra>
								<ButtonChakra
									isDisabled={ratingComment === "" || ratingStar === 0}
									colorScheme="green" mr={3} onClick={handleUploadRating}>
									{Action.RATING_NOW}
								</ButtonChakra>
							</ModalFooter>
						</ModalContent>
					</Modal>}


				{showRefundModal &&
					<Modal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)}
						isCentered
						size={"xl"}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Bạn có chắc muốn hoàn tiền không ?</ModalHeader>
							<ModalCloseButton />
							<ModalFooter>
								<ButtonChakra colorScheme="red" variant="ghost"
									onClick={() => setShowRefundModal(false)} mr={2}>{Action.CANCEL}</ButtonChakra>
								<ButtonChakra
									colorScheme="green" mr={3} onClick={handleRefundOrder}>
									{Action.REFUND}
								</ButtonChakra>
							</ModalFooter>
						</ModalContent>
					</Modal>}

				{displayModalCancelOrder &&
					<Modal isOpen={displayModalCancelOrder}
						onClose={() => setDisplayModalCancelOrder(null)} isCentered>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>
								<Center>
									{Title.CANCEL_ORDER}
								</Center>
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<FlexCharkra>
									<WarningIcon boxSize="20px" mr="15px" color="red.500" />
									<Text>{Content.CONFIRM_CANCEL_ORDER}</Text>
								</FlexCharkra>
							</ModalBody>
							<ModalFooter>
								<Button colorScheme="red" onClick={handleCancleOrder}>
									{Action.CONFIRM}
								</Button>
								<Button colorScheme="blue" variant="ghost"
									onClick={() => setDisplayModalCancelOrder(false)}>
									{Action.CANCEL}
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				}

				{/* Render status order */}
				{orderDetail && orderDetail.order.status !== OrderStatus.ORDER_FAILED && <Card p="2rem 1.5rem" mb="30px">
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
										bg={handleStatusIcon(ind) ? "primary.main" : "gray.3-10"}
										color={handleStatusIcon(ind) ? "gray.white" : "primary.main"}
									>
										<Icon size="32px" defaultcolor="currentColor">
											{item}
										</Icon>
									</Avatar>
									{handleStatusDone(ind) && (
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
										bg={handleStatusLine(ind) ? "primary.main" : "gray.300"}
									/>
								)}
							</Fragment>
						))
						}
					</FlexBox>

					<FlexBox justifyContent={size.width < breakpoint ? "center" : "flex-end"}>
						<Typography
							p="0.5rem 1rem"
							borderRadius="300px"
							bg="primary.light"
							color="primary.main"
							textAlign="center"
						>
							{Content.EXPECTED_PICKUP_DATE} <b>  {format(new Date(orderDetail.order.delivery.receiving_date), "dd MMM, yyyy", { locale: vi })}</b>
						</Typography>
					</FlexBox>
					<FlexCharkra justifyContent={size.width < breakpoint ? "center" : "flex-end"} mt={2}>
						<ButtonChakra width="30%" bg="#FF5733" color="white" borderRadius="0"
							_hover={{ bg: "#FF0000" }}
							onClick={() => {
								navigate(`/products/${orderDetail.order.order_items[0].product_id}`)
							}}
						>{Content.BUY_AGAIN}</ButtonChakra>
					</FlexCharkra>
					{statusPaymentOrder &&
						orderDetail.order.status == OrderStatus.ORDER_CREATED && (
							<FlexCharkra justifyContent={size.width < breakpoint ? "center" : "flex-end"}
								mt={2}
								onClick={() => {
									setSelectedOrder(orderDetail.order.order_id);
									setDisplayModalCancelOrder(true)
								}}
							>
								<ButtonChakra width="30%" bg="white" color="black" borderRadius="0"
									border="1px solid gray">{Action.CANCEL_ORDER}</ButtonChakra>
							</FlexCharkra>
						)
					}
					{
						orderDetail.order.status == OrderStatus.ORDER_SHIPPING_FINISH && (
							<FlexCharkra justifyContent={size.width < breakpoint ? "center" : "flex-end"}
								mt={2}
								onClick={() => {
									setSelectedOrder(orderDetail.order.order_id);
									setShowRefundModal(true)
								}}
							>
								<ButtonChakra width="30%" bg="white" color="black" borderRadius="0"

									border="1px solid gray">{Action.REFUND}</ButtonChakra>
							</FlexCharkra>
						)
					}
					{statusPaymentOrder && statusPaymentOrder.paymentMethod !== EPaymentMethod.COD && statusPaymentOrder.paymentStatus ===
						EPaymentStatus.PENDING
						&& (
							<FlexCharkra justifyContent={size.width < breakpoint ? "center" : "flex-end"}
								mt={2}
								onClick={() => {
									setSelectedOrder(orderDetail.order.order_id);
									setDisplayModalCancelOrder(true);
								}}
							>
								<ButtonChakra
									isDisabled={statusPaymentOrder.paymentMethod === EPaymentMethod.BANKING &&
										profile.eWallet < orderDetail.order.amount}
									width="30%" bg="white" color="black" borderRadius="0"
									border="1px solid gray"
									onClick={handleOrderNow}
								>{Action.PAY_NOW}</ButtonChakra>
							</FlexCharkra>
						)}
					<FlexCharkra justifyContent={size.width < breakpoint ? "center" : "flex-end"} mt={2}
						onClick={() => {
							navigate(`/customer-service?store_id=${orderDetail.order.store_id}`)
						}}
					>
						<ButtonChakra width="30%" bg="white" color="black" borderRadius="0"
							border="1px solid gray">{Action.CONTACT_SELLER}</ButtonChakra>
					</FlexCharkra>
				</Card>}

				{/* Order cancel start from -1  */}
				{orderDetail && (orderDetail.order.status <= -1) && (
					<Center mt={4} mb={4}>
						<Text fontSize="xl">{handleMessageOrderCancel(orderDetail.order.status)}</Text>
					</Center>
				)}

				{orderDetail && orderDetail.order.status === OrderStatus.ORDER_FAILED && (
					<Center mt={4} mb={4}>
						<Text fontSize="xl">{Content.YOUR_ORDER_HAS_BEEN_ERROR}</Text>
					</Center>
				)}

				<Card p="0px" mb="30px" overflow="hidden">
					<TableRow bg="gray.200" p="12px" boxShadow="none" borderRadius={0}>
						<FlexBox className="pre" m="6px" alignItems="center">
							<Typography fontSize="14px" color="text.muted" mr="4px">
								{Title.ORDER_CODE}:
							</Typography>
							<Typography fontSize="14px">{orderDetail.order.order_id}</Typography>
						</FlexBox>
						<FlexBox className="pre" m="6px" alignItems="center">
							<Typography fontSize="14px" color="text.muted" mr="4px">
								{Title.ORDER_DATE}:
							</Typography>
							<Typography fontSize="14px">
								{format(new Date(orderDetail.order.created_at), "dd MMM, yyyy", { locale: vi })}
							</Typography>
						</FlexBox>
						{orderDetail.order.status === 4 && (
							<FlexBox className="pre" m="6px" alignItems="center">
								<Typography fontSize="14px" color="text.muted" mr="4px">
									{Title.ORDER_DELIVERY}:
								</Typography>
								<Typography fontSize="14px">
									{format(new Date(orderDetail.order.delivery.receiving_date), "dd MMM, yyyy", { locale: vi })}
								</Typography>
							</FlexBox>)}

					</TableRow>

					<Box py="0.5rem">
						{orderDetail.order.order_items.map((item) => (
							<FlexBox
								px="1rem"
								py="0.5rem"
								flexWrap="wrap"
								alignItems="center"
								key={item.product_id}
							>
								<FlexBox flex="2 2 260px" m="6px" alignItems="center">
									<Avatar src={item.image} size={64} />
									<Box ml="20px">
										<H6 my="0px">{item.product_name}</H6>
										<Typography fontSize="14px" color="text.muted">
											{(item.net_price > 0 ? item.net_price : item.price).toLocaleString('vi-VN')}₫ x {item.quantity}
										</Typography>
									</Box>
								</FlexBox>
								{item.name_option && (
									<FlexBox flex="1 1 260px" m="6px" alignItems="center">
										<Typography fontSize="14px" color="text.muted">
											{Title.ORDER_ITEM_PRODUCT_ATTRIBUTE}: {item.name_option}
										</Typography>
									</FlexBox>
								)}


								{!isOlderThanSevenDays() && (<FlexBox flex="160px" m="6px" alignItems="center">
									{
										item.rating_id ? (
											<Button
												onClick={() => {
													handleViewRating(item);
												}}
												marginLeft="auto"
												variant="text" color="primary">
												<Typography fontSize="14px">{Action.VIEW_RATING}</Typography>
											</Button>
										) : (
											<Button
												disabled={orderDetail.order.status < 4}
												variant="text" color="primary"
												onClick={() => setDisplayRating(item)}
												_hover={{ variant: "text" }}
												marginLeft="auto"
											>
												<Typography fontSize="14px">{Action.WRITE_RATING}</Typography>
											</Button>
										)
									}
								</FlexBox>
								)}
							</FlexBox>
						))}
					</Box>
				</Card>

				<Grid container spacing={6} style={{ display: 'flex', alignItems: 'stretch' }}>
					<Grid item lg={6} md={6} xs={12} style={{ display: 'flex' }}>
						<Card p="20px 30px" style={{ flex: 1 }}>
							<Heading as="h5" size="md" mt="0px" mb={2}>
								{Title.ORDER_DELIVERY_RECIEVE}
							</Heading>
							<Text fontSize="14px" my="0px" fontWeight={"bold"}>
								{orderDetail.order.delivery.shipping_name}
							</Text>
							<Text fontSize="14px" my="0px">
								{orderDetail.order.delivery.shipping_phone}
							</Text>
							<Text fontSize="14px" my="0px">
								{orderDetail.order.delivery.shipping_address}
							</Text>
						</Card>
					</Grid>
					<Grid item lg={6} md={6} xs={12} style={{ display: 'flex' }}>
						<Card p="20px 30px" style={{ flex: 1 }}>
							{orderDetail.order.order_status.map((item, index) => (
								<Text key={index}>
									{new Intl.DateTimeFormat('vi-VN', {
										hour: 'numeric',
										minute: 'numeric',
										day: 'numeric',
										month: 'numeric',
										year: 'numeric'
									}).format(new Date(item.created_at))}
									{' | '} {item.message}
								</Text>
							))}
						</Card>
					</Grid>

				</Grid>
				<Box container spacing={6} mt={12}>
					<Card p="20px 30px">
						<H5 mt="0px" mb="14px">
							{Title.TOTAL}
						</H5>
						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="0.5rem"
						>
							<Typography fontSize="14px" color="text.hint">
								{Title.ORDER_MONEY}:
							</Typography>
							<H6 my="0px">{(orderDetail.order.sub_total -
								orderDetail.order.delivery.cost).toLocaleString('vi-VN')}₫</H6>
						</FlexBox>
						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="0.5rem"
						>
							<Typography fontSize="14px" color="text.hint">
								{Title.ORDER_FEE_SHIPPING}:
							</Typography>
							<H6 my="0px">{orderDetail.order.delivery.cost.toLocaleString('vi-VN')}₫</H6>
						</FlexBox>
						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="0.5rem"
						>
							<Typography fontSize="14px" color="text.hint">
								{Title.ORDER_DISCOUNT_PRODUCT}:
							</Typography>
							<H6 my="0px">{orderDetail.order.item_discount.toLocaleString('vi-VN')}₫</H6>
						</FlexBox>

						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="0.5rem"
						>
							<Typography fontSize="14px" color="text.hint">
								{Title.ORDER_DISCOUNT_FEE_SHIPPING}:
							</Typography>
							<H6 my="0px">{orderDetail.order.shipping_discount.toLocaleString('vi-VN')}₫</H6>
						</FlexBox>

						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="0.5rem"
						>
							<Typography fontSize="14px" color="text.hint">
								{Title.ORDER_DISCOUNT_STORE}:
							</Typography>
							<H6 my="0px">{orderDetail.order.store_discount ? orderDetail.order.store_discount.toLocaleString('vi-VN') : 0}₫</H6>
						</FlexBox>

						<Divider mb="0.5rem" />

						<FlexBox
							justifyContent="space-between"
							alignItems="center"
							mb="1rem"
						>
							<H6 my="0px">{Title.TOTAL}</H6>
							<H6 my="0px">{orderDetail.order.amount.toLocaleString('vi-VN')}₫</H6>
						</FlexBox>
						<FlexBox justifyContent="space-between" alignItems="center">
							<Typography fontSize="14px" fontWeight="bold">{Title.ORDER_PAYMENT_METHOD}:</Typography>
							<Typography fontSize="14px">
								{orderDetail.order.payment_method === 1 ? Content.PAYMENT_ON_COD : orderDetail.order.payment_method === 2 ?
									Content.PAYMENT_ON_PAYPAL : Content.PAYMENT_ON_WALLET}
							</Typography>
						</FlexBox>
					</Card>
				</Box>
			</>)
			}
		</div>
	);
};

OrderDetails.layout = DashboardLayout;

export default OrderDetails;
