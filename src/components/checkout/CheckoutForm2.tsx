import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Card from "../Card";
import FlexBox from "../FlexBox";
import TextField from "../text-field/TextField";
import { Formik } from "formik";
import { useLocation, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from "react";
import * as yup from "yup";
import Button from "../buttons/Button";
import { Card1 } from "../Card1";
import Grid from "../grid/Grid";
import Typography, { H5, H6, Paragraph, Tiny } from "../Typography";
import { Button as CharkraButton, Flex, Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup } from "@chakra-ui/react";
import { FaMoneyBillWave, FaPaypal, FaSync, FaWallet } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppThunkDispatch, RootState, useAppSelector } from "../../store/store";
import { getMultiCart } from "../../store/slices/carts-slice";
import { getFeatureProduct } from "../../store/slices/products-slice";
import { getMyAddress, getMyProfile } from "../../store/slices/user-slice";
import Divider from "../../components/Divider";
import './Checkout2.css';

const CheckoutForm2 = ({ products }) => {
	const [hasVoucher, setHasVoucher] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppThunkDispatch>();

	const [openSelectAddress, setOpenSelectAddress] = useState(false);
	const [selectAddress, setSelectAddress] = useState(null);
	const [profile, setProfile] = useState(null);
	const [getTotalPrice, setGetTotalPrice] = useState(0);
	const users = useAppSelector((state: RootState) => state.user);

	const handleFormSubmit = async (values) => {
		console.log(values);
		navigate("/payment");
	};

	const handleFieldValueChange = (value, fieldName, setFieldValue) => () => {
		if (fieldName === 'card' && value === 'Wallet' && profile && profile.eWallet < getTotalPrice)
			return
		setFieldValue(fieldName, value);
	};

	const toggleHasVoucher = () => {
		setHasVoucher((has) => !has);
	};

	useEffect(() => {
		loadAddress();
		dispatch(getMyProfile()).unwrap().then((res) => {
			setProfile(res.data)
		});
	}, []);

	const loadAddress = () => {
		dispatch(getMyAddress({})).unwrap().then((res) => {
			console.log(res);
			const address = res.data.data.length > 0 ? res.data.data[0] : null
			setSelectAddress(address)
		});
	}
	return (
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

						<Grid container spacing={6}>
							{addressList.map((item, ind) => (
								<Grid item md={4} sm={6} xs={12} key={ind}>
									<Card
										bg="gray.100"
										p="1rem"
										boxShadow="none"
										border="1px solid"
										cursor="pointer"
										borderColor={
											item.address === values.address
												? "primary.main"
												: "transparent"
										}
										onClick={handleFieldValueChange(
											item.address,
											"address",
											setFieldValue
										)}
									>
										<H6 mb="0.25rem">{item.addressType}</H6>
										<Paragraph color="gray.700">{item.address}</Paragraph>
									</Card>
								</Grid>
							))}
						</Grid>
						<CharkraButton my={2}>Thay đổi</CharkraButton>

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

						<Grid container spacing={6}>
							{paymentMethodList.map((item) => (
								<Grid item md={4} sm={6} xs={12} key={item.name}>
									<Card
										bg={item.color}
										p="1rem"
										boxShadow="none"
										border="2px solid"
										cursor="pointer"
										// disabled={item.name === 'Wallet' && profile && profile.eWallet < getTotalPrice}
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
								</Grid>
							))}
						</Grid>

						<Paragraph
							className="cursor-pointer"
							color="primary.main"
							mt="1.5rem"
							lineHeight="1"
							onClick={toggleHasVoucher}
							fontWeight="medium"
						>
							Thêm voucher.
						</Paragraph>

						{hasVoucher && (
							<FlexBox mt="1.5rem" maxWidth="400px">
								<TextField
									name="voucher"
									placeholder="Enter voucher code here"
									fullwidth
									value={values.voucher || ""}
									onChange={handleChange}
								/>
								<Button
									variant="contained"
									color="primary"
									type="button"
									ml="1rem"
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
						>
							Đặt hàng
						</Button>
					</Card1>
				</form>
			)}
		</Formik>
	);
};

const addressList = [
	{
		addressType: "Home",
		address: "435 Bristol Avenue, Abington MA 2351",
	},
	{
		addressType: "Office",
		address: "777 Brockton Avenue, Abington MA 2351",
	},
	{
		addressType: "Office 2",
		address: "777 Kazi Avenue, Abington MA 2351",
	},
];

const paymentMethodList = [
	{ name: 'COD', icon: FaMoneyBillWave, color: "#a0a832" },
	{ name: 'PayPal', icon: FaPaypal, color: "#3265a8" },
	{ name: 'Wallet', icon: FaWallet, color: "#32a86d" },
];

const initialValues = {
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

export default CheckoutForm2;
