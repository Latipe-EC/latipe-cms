import LazyImage from "../LazyImage";
import { useAppContext } from "../../contexts/app/AppContext";
import { CartItem } from "../../reducers/cartReducer";
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Button from "../buttons/Button";
import { Button as ButtonCharkra, Wrap, WrapItem } from "@chakra-ui/react";

import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { H1, H2, H3, H4, H5, H6, SemiSpan } from "../Typography";
import { ProductDetailResponse } from "api/interface/product";
import { Badge, Divider, IconButton, Tooltip } from "@chakra-ui/react";
import { FaFlag, FaShoppingCart } from "react-icons/fa";
import './ProductIntro.css'
import { set } from "lodash";
export interface ProductIntroProps {
	product: ProductDetailResponse
}

const ProductIntro: React.FC<ProductIntroProps> = ({ product }) => {
	const [selectedImage, setSelectedImage] = useState({ id: 0, value: product.images[0] });
	const [selectPrice, setSelectPrice] = useState(product.price);
	const [selectPromotionPrice, setSelectPromotionPrice] = useState(product.promotionalPrice);
	const [selectOption, setSelectOption] = useState([]);

	const { state, dispatch } = useAppContext();
	const [selectQuantity, setSelectQuantity] = useState(product.productClassifications[0].quantity);
	const [quantity, setQuantity] = useState(1);
	console.log(product);
	// const routerId = router.query.id as string;
	const { id: routerId } = useParams();
	const sum = product.ratings ? product.ratings.reduce((acc, cur) => acc + cur, 0) : 0;
	const avg = product.ratings ? sum / product.ratings.length : 0;
	const handleImageClick = (ind) => () => {
		setSelectedImage({ id: ind, value: product.images[ind] });
	};

	const handleBuyNow = () => {

	};

	const handleAddToCart = () => {
		if (product.productVariants.length > 0) {

			return;
		}

	};

	const handleSelectOption = (index, val) => {
		const newSelectOption = [...selectOption];
		newSelectOption[index] = product.productVariants[index].options[val].value;
		if (index === 1 && selectOption[0]) {
			setSelectedImage
				({
					id: 999999,
					value: product.productVariants[0].options[
						product.productVariants[0].options.findIndex(
							(option) => option.value === selectOption[0]
						)]
						.image
				});
		} else if (index === 0 && selectOption[1]) {
			const indexOption = product.productVariants[1].options.findIndex(
				(option) => option.value === selectOption[1]
			)
			setSelectedImage
				({
					id: 999999,
					value: product.productVariants[1].options[indexOption]
						.image
				});
			setSelectQuantity(product.productVariants[1].options[indexOption].);
		}
		setSelectOption(newSelectOption);
	}
	const handleCheckValid = () => {
		if (product.productVariants.length > 0) {
			if (selectOption.length !== product.productVariants.length)
				return false;
		}
		return true;
	}
	// const handleCartAmountChange = useCallback(
	// 	(amount) => () => {
	// 		dispatch({
	// 			type: "CHANGE_CART_AMOUNT",
	// 			payload: {
	// 				qty: amount,
	// 				name: title,
	// 				price,
	// 				imgUrl: imgUrl[0],
	// 				id: id || routerId,
	// 			},
	// 		});
	// 	},
	// 	[]
	// );

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

					<FlexBox alignItems="center" mb="1rem" >
						<H5 fontSize={3} color="orange" fontWeight="bold" style={{ textDecoration: 'underline' }}>{sum}</H5>
						<Box ml="10px" mr="10px">
							<Rating color="warn" value={avg} outof={5} />
						</Box>
						<Divider orientation="vertical" width="1px" h="20px" bgColor="red.300" />
						<Box ml="8px" mr="8px">
							<SemiSpan color="text.secondary" fontSize={3}>
								<span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
									5</span> Đánh giá
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
									icon={<Icon as={FaFlag} />}
									variant="outline"
									colorScheme="red"
								/>
							</Tooltip>
						</Box>
					</FlexBox>

					<Box bg="#fafafa" my={4} height={"50px"} display="flex" alignItems="center" textAlign="center">
						{selectPromotionPrice && selectPromotionPrice > 0 ? (
							<>
								<H1 color="primary.main" mb="4px" lineHeight="1">
									<del>₫{selectPrice.toLocaleString('vi-VN')}</del> ₫{selectPromotionPrice.toLocaleString('vi-VN')}
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
											<WrapItem key={`detail-${options.id}`}>
												<ButtonCharkra
													onClick={() => handleSelectOption(index, indexValue)}
													colorScheme="white"
													color={"black"}
													mr="1rem"
													border={"1px"}
													fontWeight={"normal"}
													borderRadius={"0"}
													borderColor={selectOption[index] === option.value ? "#D0011B" : "gray"}
													className={selectOption[index] === option.value ? "selected" : ""}
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

					<FlexBox alignItems="center" mb="1rem" >
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
								onClick={() => { setQuantity(quantity + 1) }}
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
							leftIcon={<Icon as={FaShoppingCart} />}
							disabled={!handleCheckValid()}
							bg="#FDF3F4"
							color={"red"}
							mr="1rem"
							size="lg"
						>
							Thêm vào giỏ hàng
						</ButtonCharkra>
						<ButtonCharkra
							onClick={handleBuyNow}
							disabled={!handleCheckValid()}
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
		</Box >
	);
};

export default ProductIntro;
