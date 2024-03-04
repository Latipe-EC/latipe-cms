import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Card from "../Card";
import FlexBox from "../FlexBox";
import TextField from "../text-field/TextField";
import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from "react";
import Button from "../buttons/Button";
import { Card1 } from "../Card1";
import Grid from "../grid/Grid";
import Typography, { H5, Paragraph, Tiny } from "../Typography";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button as CharkraButton,
	Flex,
	Icon,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Radio,
	RadioGroup,
	Spinner,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { FaSync } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppThunkDispatch, RootState, useAppSelector } from "@stores/store";
import { getMyAddress, getMyProfile } from "@stores/slices/user-slice";
import Divider from "@components/Divider";
import './Checkout2.css';
import { getListDelivery } from "@stores/slices/deliveries-slice";
import { checkVoucher } from "@stores/slices/promotions-slice";
import { CloseIcon } from "@chakra-ui/icons";
import { createOrderV2 } from "@stores/slices/orders-slice";
import { ContentAlter, DiscountType, ErrorMessage, PaymentMethodName, TitleAlter, VoucherStatus, VoucherType, paymentMethodList } from "@/utils/constants";
import { getPaymentMethod } from "@/utils/utils";
import { RealDiscount } from "@/api/interface/promotion";
import { PromotionData } from "@/api/interface/order";
import { removeCartItem } from "@/stores/slices/carts-slice";


const CheckoutForm2 = ({ products, vouchers, setVouchers, setListDeliveries, listDeliveries }) => {
	const [hasVoucher, setHasVoucher] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppThunkDispatch>();
	const [deliveries, setDeliveries] = useState([]);
	const [openSelectAddress, setOpenSelectAddress] = useState(false);
	const [selectAddress, setSelectAddress] = useState(null);
	const [profile, setProfile] = useState(null);
	const [getTotalPrice, setGetTotalPrice] = useState(0);
	const [errorVoucher, setErrorVoucher] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showErrorOrder, setShowErrorOrder] = useState(false);
	const [newProducts, setNewProducts] = useState([]);
	const [methodPayment, setMethodPayment] = useState(PaymentMethodName.COD);
	const [voucher, setVoucher] = useState('');
	const [isAlterOpen, setIsAlterOpen] = useState(false);
	const [messageAlter, setMessageAlter] = useState('');
	const users = useAppSelector((state: RootState) => state.user);

	const handleSelectAddress = (address, index) => {
		const tmp = [...listDeliveries];
		tmp[index] = {
			...address
		};
		setListDeliveries(tmp);
	}

	const toggleHasVoucher = () => {
		setHasVoucher((has) => !has);
		setErrorVoucher("");
	};

	useEffect(() => {
		loadAddress();
		dispatch(getMyProfile()).unwrap().then((res) => {
			setProfile(res.data)
		});
	}, []);

	useEffect(() => {
		if (!selectAddress || products.length === 0)
			return
		dispatch(getListDelivery({
			src_code: products.map(x => x.cityOrProvinceId),
			dest_code: selectAddress ? selectAddress.cityOrProvinceId : 0,
		})).unwrap().then((res) => {
			setDeliveries(res.data);
		});
	}, [selectAddress]);

	useEffect(() => {
		if (products.length > 0) {
			setGetTotalPrice(products.reduce((acc, item) => acc + item.price * item.quantity, 0));

			const prods = products.reduce((acc, product) => {
				const key = product.storeId;
				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(product);
				return acc;
			}, {})
			setNewProducts(prods);

			setListDeliveries(Object.keys(prods).map(() => {
				return {
					src_code: '',
					dest_code: '',
					receive_date: '',
					delivery_id: '',
					delivery_name: '',
					cost: 0
				}
			}));


		}

	}, [products]);

	useEffect(() => {
		const tmpVouchers = [...vouchers];
		for (const voucher of tmpVouchers) {
			if (voucher.voucher_type === VoucherType.DELIVERY) {
				voucher.real_discount = renderVoucherPrice(voucher);
			}
		}
		setVouchers(tmpVouchers);
	}, [listDeliveries]);

	useEffect(() => {
		const tmpVouchers = [...vouchers];
		for (const voucher of tmpVouchers) {
			if (voucher.voucher_require.payment_method
				&& voucher.voucher_require.payment_method !== getPaymentMethod(methodPayment)) {
				setIsAlterOpen(true);
				setMessageAlter(ContentAlter.VOUCHER_CHANGED_BY_CHANGE_METHOD_PAYMENT);
				tmpVouchers.splice(tmpVouchers.indexOf(voucher), 1);
			}
		}
		setVouchers(tmpVouchers);
	}, [methodPayment]);

	const loadAddress = () => {
		dispatch(getMyAddress({})).unwrap().then((res) => {
			const address = res.data.data.length > 0 ? res.data.data[0] : null
			if (selectAddress && res.data.data[0].id === selectAddress.id) {
				return;
			}
			setSelectAddress(address)
		});
	}

	const removeVoucher = (voucher) => {
		const index = vouchers.map(x => x.voucher_code).indexOf(voucher);
		if (index > -1) {
			vouchers.splice(index, 1);
			setVouchers([...vouchers]);
		}
		setErrorVoucher("");
	}

	// Display voucher price
	const renderVoucherPrice = (voucher): RealDiscount => {

		const result = {
			totalPrice: 0,
			deliveries: []
		}
		let totalPrice = 0;

		// Voucher free ship
		if (voucher.voucher_type === VoucherType.DELIVERY) {
			// Get price per shop
			const prices = Object.keys(newProducts).map((key) => {
				return {
					key, price: newProducts[key].reduce((acc, item) => acc +
						item.promotionalPrice > 0 ? item.promotionalPrice : item.price * item.quantity, 0)
				}
			});

			// Mapping price with delivery
			const objPriceDelivery = {}
			for (let i = 0; i < prices.length; i++) {
				// id: cost + delivery_id
				objPriceDelivery[listDeliveries[i].cost + '-' + prices[i].key] = prices[i].price;
			}

			// Sort price with delivery
			const sortedObjPriceDelivery = Object.fromEntries(
				Object.entries(objPriceDelivery).sort((a, b) => a[0].localeCompare(b[0]))
			);

			// case 1: voucher usable is less than delivery
			if (prices.length > voucher.count_usable) {
				for (let i = 0; i < voucher.count_usable; i++) {
					for (const key in sortedObjPriceDelivery) {
						if (sortedObjPriceDelivery[key] >= voucher.voucher_require.min_require) {
							const shippingValue = parseInt(key.split('-')[0]);
							totalPrice += Math.min(voucher.discount_data.shipping_value, shippingValue);
							result.deliveries.push(key.split('-')[1]);
							delete sortedObjPriceDelivery[key];
							break;
						}
						delete sortedObjPriceDelivery[key];
					}
				}
			}
			// case 2: voucher usable is greater than delivery
			else {
				for (const key in sortedObjPriceDelivery) {
					if (sortedObjPriceDelivery[key] >= voucher.voucher_require.min_require) {
						const shippingValue = parseInt(key.split('-')[0]);
						totalPrice += Math.min(voucher.discount_data.shipping_value, shippingValue);
						result.deliveries.push(key.split('-')[1]);
					}
				}
			}
			result.totalPrice = totalPrice;
			return result;
		}
		// Voucher discount product
		else {
			const { discount_type, discount_percent, discount_value, maximum_value } = voucher.discount_data;
			const discount = discount_type === DiscountType.PERCENT_DISCOUNT ?
				discount_percent * getTotalPrice : discount_value;
			result.totalPrice = Math.min(discount, maximum_value);
			return result;
		}

	}


	const handleAddVoucher = (voucher) => {

		if (vouchers.map(x => x.voucher_code).includes(voucher)) {
			setErrorVoucher(ErrorMessage.VOUCHER_USED);
			return;
		}

		dispatch(checkVoucher({
			vouchers: [...vouchers.map(x => x.voucher_code), voucher]
		})).unwrap().then((res) => {
			if (res.status !== 200) {
				setErrorVoucher(ErrorMessage.INVALID_VOUCHER);
				return;
			}

			const vouchers = res.data.data.items;
			if (vouchers.some(x => x.status === VoucherStatus.INACTIVE)
				|| vouchers.some(x => x.voucher_counts === 0)
				|| vouchers.some(x => x.voucher_counts === 0)
				|| vouchers.some(x => x.count_usable === 0)
			) {
				setErrorVoucher(ErrorMessage.INVALID_VOUCHER);
				return;
			}

			/// Check voucher
			for (const v of vouchers) {
				if (v.voucher_require && v.voucher_require.min_require > 0) {
					if (getTotalPrice < v.voucher_require.min_require) {
						setErrorVoucher(ErrorMessage.VOUCHER_REQUIRE_NOT_MET);
						return;
					}
				}

				if (v.voucher_require.payment_method && v.voucher_require.payment_method !== getPaymentMethod(methodPayment)) {
					setErrorVoucher(ErrorMessage.VOUCHER_REQUIRE_NOT_MET);
					return;
				}

				if (v.count_usable === 0) {
					setErrorVoucher(ErrorMessage.VOUCHER_USED);
					return;
				}
				v.real_discount = renderVoucherPrice(v);
			}


			setVouchers([...vouchers]);
			setErrorVoucher("");
		});
	}

	const handleOrder = () => {
		if (methodPayment === PaymentMethodName.Wallet && profile && profile.eWallet < getTotalPrice) {
			return;
		}

		setIsLoading(true);

		// process promotion_data
		const promotion_data: PromotionData = {}
		const paymentVoucher = vouchers.filter(x => x.voucher_type === VoucherType.PRODUCT)

		const deliveryVoucher = vouchers.filter(x => x.voucher_type === VoucherType.DELIVERY)

		if (deliveryVoucher.length > 0) {
			promotion_data.free_shipping_voucher = {
				voucher_code: deliveryVoucher[0].voucher_code,
				store_ids: deliveryVoucher[0].real_discount.deliveries
			}
		}

		if (paymentVoucher.length > 0) {
			promotion_data.payment_voucher = {
				voucher_code: paymentVoucher[0].voucher_code,
			}
		}

		const storeProducts = Object.keys(newProducts).map((key, ind) => {
			return {
				store_id: key,
				order_items: newProducts[key].map((item) => {
					return {
						product_id: item.productId,
						quantity: parseInt(item.quantity),
						option_id: item.productOptionId,
					}
				}),
				delivery: {
					delivery_id: listDeliveries[ind].delivery_id
				},
				cart_ids: newProducts[key][0].cart_id ? newProducts[key].map((item) => item.cart_id) : []
			}
		});

		dispatch(createOrderV2({
			address: {
				address_id: selectAddress.id
			},
			store_orders: storeProducts,
			promotion_data,
			payment_method: getPaymentMethod(methodPayment),
		})).unwrap().then((res) => {
			setIsLoading(false);
			if (res.status === 200) {
				// remove cart item if success
				const cart_ids = storeProducts.map((item) => item.cart_ids).flat();
				if (cart_ids.length > 0)
					dispatch(removeCartItem(cart_ids));
				if (methodPayment === PaymentMethodName.PayPal) {
					navigate(`/payment-paypal/${res.data.data.order_key}`);
					return;
				}
				navigate('/orders/success')
			}
		}).catch(() => {
			setIsLoading(false);
			setIsAlterOpen(true);
			setMessageAlter(ErrorMessage.ORDER_FAILED);
		});

	}

	return (
		<Box position="relative">
			<Modal isOpen={showErrorOrder} onClose={() => setShowErrorOrder(false)} isCentered size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader style={{
						fontWeight: 'bold',
						fontSize: '20px',
						color: 'gray.800',
						textAlign: "center",
						marginTop: '20px'
					}}>
						Lỗi
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Có lỗi xảy ra xin vui lòng thử lại sau!</Text>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' color="red" mr={3} onClick={() => setShowErrorOrder(false)}>
							Đóng
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{isLoading && (
				<Box
					position="absolute"
					top="0"
					left="0"
					right="0"
					bottom="0"
					display="flex"
					justifyContent="center"
					alignItems="center"
					zIndex="10000"
				>
					<Spinner size="xl" color="orange" thickness="4px" />
				</Box>
			)}

			<Box >
				<Modal isOpen={openSelectAddress} onClose={() => {
					setOpenSelectAddress(false)
				}} isCentered>
					<ModalOverlay />
					<ModalContent minH="400px">
						<ModalHeader>Chọn địa chỉ</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<RadioGroup value={selectAddress}>
								{users.dataAddress.map((address, index) => (
									<Box key={index} my={4} >
										<Flex align="center" justifyContent="space-between">
											<Typography fontSize="lg">
												{`${address.contactName} | ${address.phone} | ${address.detailAddress}`}
											</Typography>
											<Radio value={address}
												onChange={() => setSelectAddress(address)}></Radio>
										</Flex>
										{index < users.dataAddress.length - 1 && <Divider />}
									</Box>
								))}
							</RadioGroup>
						</ModalBody>
					</ModalContent>
				</Modal>
				<Card1 mb="1.5rem">
					<FlexBox alignItems="center" mb="1.75rem">
						<Avatar
							bg="primary.main"
							size={32}
							color="primary.text"
							mr="0.875rem"
						>
							1
						</Avatar>
						<Typography fontSize="20px">Địa Chỉ Nhận Hàng</Typography>
						<IconButton
							aria-label="Reload address"
							icon={<FaSync />}
							onClick={() => {
								loadAddress()
								dispatch(getListDelivery({
									src_code: products.map(x => x.cityOrProvinceId),
									dest_code: selectAddress ? selectAddress.cityOrProvinceId : 0,
								})).unwrap().then((res) => {
									setDeliveries(res.data);
								});
							}}
							ml="1rem"
						/>

					</FlexBox>

					{selectAddress ? (
						<Box>
							<Typography mb="0.75rem">
								{`${selectAddress.contactName} | ${selectAddress.phone} | ${selectAddress.detailAddress}`}</Typography>
							<CharkraButton onClick={() => setOpenSelectAddress(true)}>Thay
								đổi</CharkraButton>
						</Box>) : (
						<CharkraButton onClick={() => window.open('/address', '_blank')}>Thêm địa
							chỉ</CharkraButton>
					)}
				</Card1>

				<Card1 mb="0.5rem">
					<FlexBox alignItems="center" >
						<Avatar
							bg="primary.main"
							size={32}
							color="primary.text"
							mr="0.875rem"
						>
							2
						</Avatar>
						<Typography fontSize="20px">Sản phẩm</Typography>
					</FlexBox>
				</Card1>


				{
					Object.keys(newProducts).map((key, index) => {
						return <Card1 mb="1.5rem">
							<Box key={`box-prods-${index}`}>
								<Flex
									justifyContent="flex-start"
								> <strong>Giỏ hàng {index + 1}</strong></Flex>
								<Flex
									justifyContent="flex-end"
								>Được giao bởi&nbsp; <b>{newProducts[key][0].storeName}</b></Flex>
							</Box>
							{newProducts[key].map((item) => (
								<Fragment key={item.id}>
									<div className="cart-item">
										<Avatar
											src={item.image || "/assets/images/products/iphone-x.png"}
											mx="1rem"
											alt={item.nameOption}
											size={76}
											onClick={() => navigate(`/products/${item.productId}`)}
										/>

										<div className="product-details">
											<H5 className="title" fontSize="14px" onClick={() => navigate(`/products/${item.productId}`)}>
												{item.productName}
											</H5>
											<Tiny color="text.muted">
												{item.price.toFixed(2)}₫ x {item.quantity}
											</Tiny>
											<Typography
												fontWeight={600}
												fontSize="14px"
												color="primary.main"
												mt="4px"
											>
												{(item.quantity * item.price).toLocaleString('vi-VN')}₫
											</Typography>
										</div>
									</div>
									<Divider />
								</Fragment>
							))}
							{!deliveries || deliveries.length === 0 && <Box mt={2} color="red">Vui lòng chọn địa chỉ nhận hàng</Box>}
							{deliveries && deliveries.length > 0 &&
								<Box my={2}>
									<Box>Hình thức giao hàng</Box>
									<Grid container spacing={6} key="container-delivery">
										{deliveries.map((item, ind) => (
											<Grid item md={4} sm={6} xs={12} key={`del-${ind}`}>
												<Box
													p="1rem"
													boxShadow="none"
													border={item.delivery_id === listDeliveries[index].delivery_id
														? "2px solid"
														: "1px solid"}
													cursor="pointer"
													borderRadius="10px"
													borderColor={
														item.delivery_id === listDeliveries[index].delivery_id
															? "primary.main"
															: "black"
													}
													onClick={() => handleSelectAddress(
														item,
														index,
													)}
												>
													<Text mb="0.25rem" fontWeight="bold">{item.delivery_name}</Text>
													<Text color="gray.700">{item.cost.toLocaleString('vi-VN')}₫</Text>
												</Box>
											</Grid>
										))}
									</Grid>
								</Box>}
						</Card1>
					}
					)
				}


				<Card1 mb="1.5rem">
					<FlexBox alignItems="center" mb="1.75rem">
						<Avatar
							bg="primary.main"
							size={32}
							color="primary.text"
							mr="0.875rem"
						>
							3
						</Avatar>
						<Typography fontSize="20px" fontWeight="bold">Phương thức thanh
							toán</Typography>
					</FlexBox>

					<Grid container spacing={6} key="container-method-list">
						{paymentMethodList.map((item) => (
							<Grid item md={4} sm={6} xs={12} key={item.name}>
								<Tooltip
									isOpen={item.name === PaymentMethodName.Wallet && methodPayment === PaymentMethodName.Wallet && profile && profile.eWallet < getTotalPrice}
									label="Không đủ tiền"
									placement="top"
								>
									<Card
										bg={item.color}
										p="1rem"
										boxShadow="none"
										border="2px solid"
										cursor="pointer"
										disabled={methodPayment === PaymentMethodName.Wallet
											&& profile && profile.eWallet < getTotalPrice}
										borderColor={
											item.name === methodPayment
												? "primary.main"
												: "transparent"
										}
										onClick={() => setMethodPayment(item.name)}
									>
										<Box
											height="24px"
											width="36px"
											position="relative"
											mb="0.5rem"
										>
											<Icon as={item.icon} />
										</Box>
										<Paragraph color="white" fontWeight="bold">{item.name}</Paragraph>
									</Card>
								</Tooltip>
							</Grid>
						))}
					</Grid>

					<Paragraph
						className="cursor-pointer"
						color="primary.main"
						mt="1.5rem"
						lineHeight="2"
						onClick={toggleHasVoucher}
						fontWeight="medium"
						fontSize="lg"
					>
						Thêm voucher.
					</Paragraph>
					{vouchers.length > 0 &&
						vouchers.map((voucher, index) => (
							<Flex key={`vou-${index}`} direction="row" alignItems="center" mb={2}>
								<Box mr={2}>
									<Text color="primary.main" fontWeight="bold">{voucher.detail}</Text>
								</Box>
								<Box mr={2}>
									<Text>|</Text>
								</Box>
								<Box mr={2}>
									<Text color="gray.500">{voucher.voucher_code}</Text>
								</Box>
								<Box mr={2}>
									<Text>|</Text>
								</Box>
								<Box mr={2}>
									<Text
										color="green.500">{voucher.real_discount.totalPrice.toLocaleString('vi-VN')}₫</Text>
								</Box>
								<IconButton
									aria-label="Delete voucher"
									icon={<CloseIcon />}
									colorScheme="red"
									size="xs"
									onClick={() => removeVoucher(voucher.voucher_code)}
								/>
							</Flex>
						))
					}
					{errorVoucher && <Text color="red.500">{errorVoucher}</Text>}
					{hasVoucher && (
						<>
							<FlexBox mt="0.5rem" maxWidth="500px">
								<TextField
									name="voucher"
									placeholder="Nhập voucher code ở đây"
									fullwidth
									value={voucher || ""}
									onChange={(e) => setVoucher(e.target.value)}
								/>
								<Button
									variant="contained"
									color="primary"
									type="button"
									ml="1rem"
									onClick={() => {
										if (voucher === "")
											return
										handleAddVoucher(voucher);
										setVoucher("")
									}}
									disabled={voucher === ""}
								>
									Áp dụng
								</Button>
							</FlexBox></>
					)}

					<Button
						variant="contained"
						color="primary"
						mt="1.5rem"
						type="submit"
						fullwidth
						disabled={methodPayment === "" || listDeliveries.some(x => x.delivery_id === '')
							|| (methodPayment
								&& methodPayment === PaymentMethodName.Wallet
								&& profile
								&& profile.eWallet < getTotalPrice)}
						onClick={handleOrder}
					>
						Đặt hàng
					</Button>
				</Card1>
			</Box>

			<AlertDialog
				isOpen={isAlterOpen}
				onClose={() => setIsAlterOpen(false)}
				leastDestructiveRef={undefined}
				isCentered
			>
				<AlertDialogOverlay>
					<AlertDialogContent style={{ backgroundColor: '#92b55e' }}>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							{TitleAlter.WARNING_TITLE}
						</AlertDialogHeader>
						<AlertDialogBody style={{ fontSize: '15px', color: '#ffffff' }}>
							{messageAlter}
						</AlertDialogBody>

					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Box >
	);
};



export default CheckoutForm2;
