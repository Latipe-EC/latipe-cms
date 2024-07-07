import LazyImage from "../LazyImage";
import React, { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Button from "../buttons/Button";
import {
	Badge,
	Button as ButtonCharkra,
	Divider,
	IconButton,
	Spinner,
	Tooltip,
	Wrap,
	WrapItem,
	useToast
} from "@chakra-ui/react";

import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { H1, H3, H5, H6, SemiSpan } from "../Typography";
import { ProductDetailResponse } from "@interfaces/product";
import { FaFlag, FaShoppingCart } from "react-icons/fa";
import './ProductIntro.css'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, incrementCount } from "@stores/slices/carts-slice";
import { AppThunkDispatch } from "@stores/store";
import { LoginResponse } from "@interfaces/auth";
import { handleApiCallWithToast } from "@/utils/utils";
import { ContentToast, TitleToast } from "@/utils/constants";

export interface ProductIntroProps {
	product: ProductDetailResponse
}

const ProductIntro: React.FC<ProductIntroProps> = ({ product }) => {

	const dispatch = useDispatch<AppThunkDispatch>();
	const [selectedImage, setSelectedImage] = useState({ id: 0, value: product.images[0] });
	const [selectPrice, setSelectPrice] = useState(product.price);
	const [selectPromotionPrice, setSelectPromotionPrice] = useState(product.promotionalPrice);
	const [selectOption, setSelectOption] = useState([]);
	const [selectQuantity, setSelectQuantity] = useState(product.productClassifications[0].quantity);
	const [quantity, setQuantity] = useState(1);
	const toast = useToast();
	const [selectClassification, setSelectClassification] = useState(null);
	const [avg, setAvg] = useState(0);
	// const routerId = router.query.id as string;
	const sum = product.ratings ? product.ratings.reduce((acc, cur, index) => acc + cur * (index + 1), 0) : 0;
	const navigate = useNavigate();

	useEffect(() => {
		setAvg(product.ratings ? sum / product.ratings.reduce((a, b) => a + b, 0) : 0)
	}, [])
	const handleImageClick = (ind) => () => {
		setSelectedImage({ id: ind, value: product.images[ind] });
	};

	const handleBuyNow = () => {
		const REACT_STARTER_AUTH: LoginResponse = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));
		if (!REACT_STARTER_AUTH) {
			window.location.href = "/login";
			return;
		}

		if (product.productVariants.length > 0 && product.productVariants.length !== selectOption.length) {
			return;
		}
		if (product.productVariants.length === 0) {
			navigate(`/checkout?productId=${product.id}&quantity=${quantity}&option=${product.productClassifications[0].id}`);
			return;
		}
		const optionsTwo = product.productVariants.length === 2 ?
			product.productVariants[1].options.length : 1;
		const indexFinal = selectOption[0] *
			optionsTwo + (selectOption.length === 2 ? selectOption[1] : 0);
		navigate(`/checkout?productId=${product.id}&quantity=${quantity}&option=${product.productClassifications[indexFinal].id}`);
	};

	const handleAddToCart = () => {

		handleApiCallWithToast(dispatch,
			addToCart,
			{
				productId: product.id,
				quantity: quantity,
				productOptionId: selectClassification
			},
			null,
			TitleToast.ADD_TO_CART,
			TitleToast.SUCCESS,
			ContentToast.ADD_TO_CART_SUCCESS,
			TitleToast.ERROR,
			ContentToast.ADD_TO_CART_ERROR,
			null,
			toast,
			<Spinner />,
			(res) => {
				if (res.data.quantity === quantity)
					dispatch(incrementCount())
			})

	};

	const handleSelectOption = (index, val) => {

		const newSelectOption = [...selectOption];
		newSelectOption[index] = val;
		// if selectOption empty 
		if (selectOption.length === 0 || (selectOption.length === 1 && selectOption[index] !== undefined)) {

			setSelectedImage({
				id: 999999,
				value: product.productVariants[index].options[val].image ? product.productVariants[index].options[val].image : product.images[0],
			});
			let finalIndex = 0;

			if (index === 0) {
				finalIndex = newSelectOption[index] * product.productVariants[index].options.length
			} else {
				finalIndex = val;
			}

			if (product.productVariants.length === 2) {
				setSelectQuantity(product.productClassifications[finalIndex].quantity);
				setSelectPrice(parseInt(String(product.productClassifications[finalIndex].price)));
				setSelectPromotionPrice(parseInt(String(product.productClassifications[finalIndex].promotionalPrice)));
				setSelectClassification(product.productClassifications[finalIndex].id);
			}
			else {
				setSelectQuantity(product.productClassifications[val].quantity);
				setSelectPrice(parseInt(String(product.productClassifications[val].price)));
				setSelectPromotionPrice(parseInt(String(product.productClassifications[val].promotionalPrice)));
				setSelectClassification(product.productClassifications[val].id);
			}
			// if product have already 1 option
		} else {
			const indexFinal = newSelectOption[0] * product.productVariants[1].options.length + newSelectOption[1];
			setSelectedImage({
				id: 999999,
				value: product.productVariants[0].options[newSelectOption[0]].image ? product.productVariants[0].options[newSelectOption[0]].image : product.images[0],
			});
			setSelectQuantity(
				product.productClassifications[indexFinal].quantity
			);
			setSelectPrice(parseInt(String(product.productClassifications[indexFinal].price)));
			setSelectPromotionPrice(
				parseInt(String(product.productClassifications[indexFinal].promotionalPrice
				)));
			setSelectClassification(product.productClassifications[indexFinal].id);
		}


		setQuantity(1);
		setSelectOption(newSelectOption);

	};

	const handleCheckValid = () => {
		const user = JSON.parse(localStorage.getItem('REACT_STARTER_AUTH'));

		if (user && user.role === "ADMIN")
			return false
		if (product.productVariants.length > 0) {
			console.log(selectOption);
			if (selectOption.filter(item => item !== undefined).length !== product.productVariants.length)
				return false;
		}
		return true;
	}

	return (
		<Box overflow="hidden">
			<Grid container justifyContent="center" spacing={16}>
				<Grid item md={6} xs={12} alignItems="center">
					<Box>
						<FlexBox justifyContent="center" mb="50px">
							<LazyImage
								src={selectedImage.value}
								alt={product.name}
								height="300px"
								width="300px"
								loading="eager"
								objectFit="contain"
							/>
						</FlexBox>
						<FlexBox overflow="auto">
							{product.images.map((url, ind) => (
								<Box
									size={70}
									minWidth={70}
									bg="white"
									borderRadius="10px"
									display="flex"
									justifyContent="center"
									alignItems="center"
									cursor="pointer"
									border="1px solid"
									key={ind}
									ml={ind === 0 && "auto"}
									mr={ind === product.images.length - 1 ? "auto" : "10px"}
									borderColor={
										selectedImage.id === ind ? "primary.main" : "gray.400"
									}
									onClick={handleImageClick(ind)}
								>
									<Avatar src={url} borderRadius="10px" size={40} />
								</Box>
							))}
						</FlexBox>
					</Box>
				</Grid>

				<Grid item md={6} xs={12} alignItems="center">
					<H1 mb="1rem">{product.name}</H1>

					<FlexBox alignItems="center" mb="1rem">
						<H5 fontSize={3} color="orange" fontWeight="bold"
							style={{ textDecoration: 'underline' }}>{sum}</H5>
						<Box ml="10px" mr="10px">
							<Rating color="warn" value={avg} outof={5} />
						</Box>
						<Divider orientation="vertical" width="1px" h="20px" bgColor="red.300" />
						<Box ml="8px" mr="8px">
							<SemiSpan color="text.secondary" fontSize={3}>
								<span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
									{product.ratings.reduce((a, b) => a + b, 0)}</span> Đánh giá
							</SemiSpan>
						</Box>
						<Divider orientation="vertical" width="1px" h="20px" bgColor="red.300" />
						<Box ml="8px" mr="8px">
							<SemiSpan color="text.secondary" fontSize={3}>
								<span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
									{product.countSale || 0}</span> Đã bán
							</SemiSpan>
						</Box>
						<Box ml="auto" mr="4px">
							<Tooltip label="Báo cáo sản phẩm">
								<IconButton
									aria-label="Report"
									icon={<Icon as={FaFlag} children={""} />}
									variant="outline"
									colorScheme="red"
								/>
							</Tooltip>
						</Box>
					</FlexBox>

					<Box bg="#fafafa" my={4} height={"50px"} display="flex" alignItems="center"
						textAlign="center">
						{selectPromotionPrice && selectPromotionPrice > 0 ? (
							<>
								<H1 color="primary.main" mb="4px" lineHeight="1">
									<del>₫{selectPrice.toLocaleString('vi-VN')}</del>
									₫{selectPromotionPrice.toLocaleString('vi-VN')}
								</H1>
								<Badge ml='2' bg="green.500" color="white" fontSize='1.2em' mt="-4"
								>GIẢM {(((selectPrice - selectPromotionPrice) / selectPrice) * 100).toFixed(0)}%</Badge>
							</>
						) : (
							<>
								<H1 color="primary.main" mb="4px" lineHeight="1">
									₫{selectPrice.toLocaleString('vi-VN')}
								</H1>
							</>
						)}
					</Box>

					<Box alignItems="center" mb="1rem">
						{product.productVariants.map((options, index) => (
							<FlexBox key={options.id}>
								<FlexBox mb="1rem" mr="2rem" textAlign="center" alignItems="center`">
									<H3 lineHeight="1" ml="8px" fontWeight={"normal"}>
										{options.name}
									</H3>
								</FlexBox>
								<FlexBox alignItems="center" mb="1rem">
									<Wrap mb="1rem">
										{options.options.map((option, indexValue) => (
											<WrapItem key={`detail-${options.id}-${indexValue}`}>
												<ButtonCharkra
													onClick={() => handleSelectOption(index, indexValue)}
													colorScheme="white"
													color={"black"}
													mr="1rem"
													border={"1px"}
													fontWeight={"normal"}
													borderRadius={"0"}
													borderColor={options.options[selectOption[index]] && options.options[selectOption[index]].value === option.value ? "#D0011B" : "gray"}
													className={options.options[selectOption[index]] && options.options[selectOption[index]].value === option.value ? "selected" : ""}
												>
													{option.value}
												</ButtonCharkra>
											</WrapItem>
										))}
									</Wrap>
								</FlexBox>
							</FlexBox>
						))}
					</Box>

					<FlexBox alignItems="center" mb="1rem">
						<H5 fontSize={3} fontWeight="bold" mr={4}
						>Số lượng</H5>
						<FlexBox alignItems="center" mr={4}>
							<Button
								p="9px"
								variant="outlined"
								size="small"
								color="primary"
								onClick={() => {
									setQuantity(quantity - 1)
								}}
								disabled={quantity <= 1}
							>
								<Icon variant="small">minus</Icon>
							</Button>
							<H3 fontWeight="600" mx="20px">
								{quantity.toString().padStart(2, "0")}
							</H3>
							<Button
								p="9px"
								variant="outlined"
								size="small"
								color="primary"
								onClick={() => {
									setQuantity(quantity + 1)
								}}
								disabled={selectQuantity <= quantity}
							>
								<Icon variant="small">plus</Icon>
							</Button>
						</FlexBox>
						<H5 fontSize={2}
						>{selectQuantity} sản phẩm có sẵn</H5>
					</FlexBox>

					<FlexBox alignItems="center" mb="1rem">
						<ButtonCharkra
							onClick={handleAddToCart}
							leftIcon={<Icon as={FaShoppingCart} children={""} />}
							isDisabled={!handleCheckValid()}
							bg="#FDF3F4"
							color={"red"}
							mr="1rem"
							size="lg"
						>
							Thêm vào giỏ hàng
						</ButtonCharkra>
						<ButtonCharkra
							onClick={handleBuyNow}
							isDisabled={!handleCheckValid()}
							variant="solid"
							colorScheme="red"
							_hover={{ bg: "red.500" }}
							size="lg"
						>
							Mua ngay
						</ButtonCharkra>
					</FlexBox>
					<FlexBox alignItems="center" mb="1rem">
						<SemiSpan>Sold By:</SemiSpan>
						<a href={`/shop/${product.store.id}`}>
							<H6 lineHeight="1" ml="8px">
								{product.store.name}
							</H6>
						</a>
					</FlexBox>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ProductIntro;
