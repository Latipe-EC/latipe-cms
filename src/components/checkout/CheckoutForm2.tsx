import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Card from "../Card";
import FlexBox from "../FlexBox";
import TextField from "../text-field/TextField";
import { Formik } from "formik";
import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from "react";
import * as yup from "yup";
import Button from "../buttons/Button";
import { Card1 } from "../Card1";
import Grid from "../grid/Grid";
import Typography, { H5, Paragraph, Tiny } from "../Typography";
import { Button as CharkraButton, Flex, Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Spacer, Spinner, Text, Tooltip, useToast } from "@chakra-ui/react";
import { FaMoneyBillWave, FaPaypal, FaSync, FaWallet } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppThunkDispatch, RootState, useAppSelector } from "../../store/store";
import { getMyAddress, getMyProfile } from "../../store/slices/user-slice";
import Divider from "../../components/Divider";
import './Checkout2.css';
import { getListDelivery } from "../../store/slices/deliveries-slice";
import { applyVoucher } from "../../store/slices/promotions-slice";
import { CloseIcon } from "@chakra-ui/icons";
import { createOrder } from "../../store/slices/orders-slice";

const CheckoutForm2 = ({ products, vouchers, setVouchers, setSelectDelivery }) => {
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


	const users = useAppSelector((state: RootState) => state.user);

	const handleFormSubmit = async (values) => {
		console.log(values);
		navigate("/payment");
	};

	const handleFieldValueChange = (value, fieldName, setFieldValue) => () => {
		if (fieldName === 'card' && value === 'Wallet' && profile && profile.eWallet < getTotalPrice)
			return
		if (fieldName === 'address') {
			setSelectDelivery(value)
			setFieldValue(fieldName, value.delivery_id);
			return;
		}
		setFieldValue(fieldName, value);
	};

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
		console.log(selectAddress);
		dispatch(getListDelivery({
			src_code: products.map(x => x.cityOrProvinceId),
			dest_code: selectAddress ? selectAddress.cityOrProvinceId : 0,
		})).unwrap().then((res) => {
			setDeliveries(res.data)
		});
	}, [selectAddress]);

	useEffect(() => {
		if (products.length > 0) {
			setGetTotalPrice(products.reduce((acc, item) => acc + item.price * item.quantity, 0));
		}

	}, [products]);

	const loadAddress = () => {
		dispatch(getMyAddress({})).unwrap().then((res) => {
			const address = res.data.data.length > 0 ? res.data.data[0] : null
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

	const handleAddVoucher = (voucher) => {
		if (vouchers.map(x => x.voucher_code).includes(voucher)) {
			setErrorVoucher("Voucher đã được áp dụng");
			return;
		}
		dispatch(applyVoucher({ vouchers: [...vouchers.map(x => x.voucher_code), voucher] })).unwrap().then((res) => {
			if (res.status !== 200) {
				setErrorVoucher("Voucher không hợp lệ");
				return;
			}
			for (const v of res.data.items) {
				if (v.voucher_require && v.voucher_require.min_require > 0) {
					if (getTotalPrice < v.voucher_require.min_require) {
						setErrorVoucher("Voucher không hợp lệ");
						return;
					}
				}
			}
			setVouchers([...res.data.items]);
			setErrorVoucher("");
		});
	}

	const handleOrder = (values: typeInitValue) => {
		if (values.card === "Wallet" && profile && profile.eWallet < getTotalPrice) {
			return;
		}
		setIsLoading(true);
		let payment_method = 1;
		if (values.card === "PayPal")
			payment_method = 2;
		else if (values.card === "Wallet")
			payment_method = 3;
		dispatch(createOrder({
			address: {
				address_id: selectAddress.id
			},
			delivery: {
				delivery_id: values.address
			},
			payment_method,
			vouchers: vouchers.map(x => x.voucher_code),
			order_items: products.map(x => {
				return {
					cart_id: x.cartId,
					product_id: x.productId,
					option_id: x.productOptionId,
					quantity: parseInt(x.quantity),
				}
			}),
		})).unwrap().then((res) => {
			setIsLoading(false);
			if (res.status === 200) {
				if (values.card === "Paypal") {
					navigate(`/payment/paypal/${res.data.data.order_key}`);
					return;
				}
				navigate('/orders/success')
			}
		});

	}

	return (
		<Box position="relative">
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
			<Formik
				initialValues={initialValues}
				validationSchema={checkoutSchema}
				onSubmit={handleFormSubmit}
			>
				{({
					values,
					handleChange,
					handleSubmit,
					setFieldValue,
				}) => (
					<form onSubmit={handleSubmit}>
						<Modal isOpen={openSelectAddress} onClose={() => { setOpenSelectAddress(false) }} isCentered>
							<ModalOverlay />
							<ModalContent minH="400px">
								<ModalHeader>Chọn địa chỉ</ModalHeader>
								<ModalCloseButton />
								<ModalBody>
									<RadioGroup value={selectAddress}>
										{users.dataAddress.map((address, index) => (
											<Box key={index} my={4}>
												<Flex align="center" justifyContent="space-between">
													<Typography fontSize="lg">
														{`${address.contactName} | ${address.phone} | ${address.detailAddress}`}
													</Typography>
													<Radio value={address} onChange={() => setSelectAddress(address)}></Radio>
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
									onClick={() => loadAddress()}
									ml="1rem"
								/>

							</FlexBox>

							{selectAddress ? (
								<Box>
									<Typography mb="0.75rem">
										{`${selectAddress.contactName} | ${selectAddress.phone} | ${selectAddress.detailAddress}`}</Typography>
									<CharkraButton onClick={() => setOpenSelectAddress(true)}>Thay đổi</CharkraButton>
								</Box>) : (
								<CharkraButton onClick={() => window.open('/address', '_blank')}>Thêm địa chỉ</CharkraButton>
							)}
						</Card1>

						<Card1 mb="1.5rem">
							<FlexBox alignItems="center" mb="1.75rem">
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

							{products.map((item) => (
								<Fragment key={item.id}>
									<div className="cart-item">
										<a href={`/products/${item.productId}`}>
											<Avatar
												src={item.image || "/assets/images/products/iphone-x.png"}
												mx="1rem"
												alt={item.nameOption}
												size={76}
											/>
										</a>

										<div className="product-details">
											<a href={`/products/${item.productId}`}>
												<H5 className="title" fontSize="14px">
													{item.productName}
												</H5>
											</a>
											<Tiny color="text.muted">
												₫{item.price.toFixed(2)} x {item.quantity}
											</Tiny>
											<Typography
												fontWeight={600}
												fontSize="14px"
												color="primary.main"
												mt="4px"
											>
												₫{(item.quantity * item.price).toLocaleString('vi-VN')}
											</Typography>
										</div>
									</div>
									<Divider />
								</Fragment>
							))}

						</Card1>

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
								<Typography fontSize="20px">Đơn vị vận chuyển</Typography>
							</FlexBox>
							{deliveries && deliveries.length > 0 &&
								<Grid container spacing={6} key="container-delivery">
									{deliveries.map((item, ind) => (
										<Grid item md={4} sm={6} xs={12} key={`del-${ind}`}>
											<Box
												p="1rem"
												boxShadow="none"
												border="1px solid"
												cursor="pointer"
												borderRadius="10px"
												borderColor={
													item.delivery_id === values.address
														? "primary.main"
														: "transparent"
												}
												onClick={handleFieldValueChange(
													item,
													"address",
													setFieldValue
												)}
											>
												<Text mb="0.25rem" fontWeight="bold">{item.delivery_name}</Text>
												<Text color="gray.700">₫{item.cost.toLocaleString('vi-VN')}</Text>
											</Box>
										</Grid>
									))}
								</Grid>}
						</Card1>


						<Card1 mb="1.5rem">
							<FlexBox alignItems="center" mb="1.75rem">
								<Avatar
									bg="primary.main"
									size={32}
									color="primary.text"
									mr="0.875rem"
								>
									4
								</Avatar>
								<Typography fontSize="20px" fontWeight="bold">Phương thức thanh toán</Typography>
							</FlexBox>

							<Grid container spacing={6} key="container-method-list">
								{paymentMethodList.map((item) => (
									<Grid item md={4} sm={6} xs={12} key={item.name}>
										<Tooltip
											isOpen={item.name === 'Wallet' && profile && profile.eWallet < getTotalPrice}
											label="Không đủ tiền"
											placement="top"
										>
											<Card
												bg={item.color}
												p="1rem"
												boxShadow="none"
												border="2px solid"
												cursor="pointer"
												disabled={item.name === 'Wallet' && profile && profile.eWallet < getTotalPrice}
												borderColor={
													item.name === values.card
														? "primary.main"
														: "transparent"
												}
												onClick={handleFieldValueChange(
													item.name,
													"card",
													setFieldValue
												)}
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
									<Flex key={`vou-${index}`} direction="row" alignItems="center">
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
											<Text color="green.500">₫{voucher.discount_value.toLocaleString('vi-VN')}</Text>
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
								<FlexBox mt="0.5rem" maxWidth="400px">
									<TextField
										name="voucher"
										placeholder="Nhập voucher code ở đây"
										fullwidth
										value={values.voucher || ""}
										onChange={handleChange}
									/>
									<Button
										variant="contained"
										color="primary"
										type="button"
										ml="1rem"
										onClick={() => {
											if (values.voucher === "")
												return
											handleAddVoucher(values.voucher);
											values.voucher = "";
										}}
										disabled={values.voucher === ""}
									>
										Áp dụng
									</Button>
								</FlexBox>
							)}

							<Button
								variant="contained"
								color="primary"
								mt="1.5rem"
								type="submit"
								fullwidth
								disabled={values.card === "" || values.address === ""}
								onClick={() => handleOrder(values)}
							>
								Đặt hàng
							</Button>
						</Card1>
					</form>
				)}
			</Formik>
		</Box>
	);
};

const paymentMethodList = [
	{ name: 'COD', icon: FaMoneyBillWave, color: "#a0a832" },
	{ name: 'PayPal', icon: FaPaypal, color: "#3265a8" },
	{ name: 'Wallet', icon: FaWallet, color: "#32a86d" },
];

const initialValues: typeInitValue = {
	address: "",
	contact: "",
	card: "",
	date: "",
	time: "",
	voucher: "",
};

const checkoutSchema = yup.object().shape({
	address: yup.string().required("required"),
	contact: yup.string().required("required"),
	card: yup.string().required("required"),
	date: yup.object().required("required"),
	time: yup.object().required("required"),
	voucher: yup.string(),
});

interface typeInitValue {
	address: string;
	contact: string;
	card: string;
	date: string;
	time: string;
	voucher: string;
}

export default CheckoutForm2;
