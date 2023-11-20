import Box from "../Box";
import Image from "../Image";
import { SpaceProps } from "styled-system";
import Button from "../buttons/Button";
import IconButton from "../buttons/IconButton";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Typography from "../Typography";
import { StyledProductCard7 } from "./ProductCardStyle";
import { CartGetDetailResponse } from "api/interface/cart";
import { deleteCartItem, updateQuantity } from "../../store/slices/carts-slice";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../store/store";
import { Checkbox } from "@chakra-ui/react";

export interface ProductCard7Props {
	product: CartGetDetailResponse;
	cartSelected: string[];
	setCartSelected: (value: string[]) => void;
}

const ProductCard7: React.FC<ProductCard7Props & SpaceProps> = ({ product,
	cartSelected, setCartSelected }) => {
	const dispatch = useDispatch<AppThunkDispatch>();

	const handleCartAmountChange =
		(amount, cartItem) => {
			dispatch(updateQuantity({ id: cartItem.id, quantity: amount }));
		};

	const handleRemoveCartItem =
		(cartItem) => {
			dispatch(deleteCartItem({ ids: [cartItem.id] }));
		};

	return (
		<StyledProductCard7 mb={2}>
			<FlexBox
				justifyContent="center"
				alignItems="center"
				width="2%"
				ml={"2"}
			>
				<Checkbox
					colorScheme={"green"}
					isChecked={cartSelected.includes(product.id)}
					onChange={(e) => {
						if (e.target.checked) {
							setCartSelected([...cartSelected, product.id]);
						} else {
							setCartSelected(cartSelected.filter((id) => id !== product.id));
						}
					}}
				/>
			</FlexBox>
			<Image
				src={product.image || "/assets/images/products/iphone-xi.png"}
				size={140}
				display="block"
				alt={product.productName}
				p="0.5rem"
			/>
			<FlexBox
				className="product-details"
				flexDirection="column"
				justifyContent="space-between"
				minWidth="0px"
				width="100%"
			>
				<a href={`/products/${product.productId}`}>
					<Typography
						className="title"
						fontWeight="600"
						fontSize="18px"
						mb="0.5rem"
					>
						{product.productName}
					</Typography>
				</a>
				<Box position="absolute" right="1rem" top="1rem">
					<IconButton
						padding="4px"
						ml="12px"
						size="small"
						onClick={() => handleRemoveCartItem(product)}
					>
						<Icon size="1.25rem">close</Icon>
					</IconButton>
				</Box>
				<FlexBox
					justifyContent="space-between"
					alignItems="flex-end"
				>
					<FlexBox flexWrap="wrap" alignItems="center">
						<Typography color="gray.600" mr="0.5rem">
							{product.nameOption.includes("latipe.product") ||
								!product.nameOption ? "" : product.nameOption}
						</Typography>

					</FlexBox>

				</FlexBox>
				<FlexBox
					justifyContent="space-between"
					alignItems="flex-end"
				>

					<FlexBox>
						<FlexBox flexWrap="wrap" alignItems="center">
							<Typography color="gray.600" mr="0.5rem">
								₫{product.price.toFixed(2)} x {product.quantity}
							</Typography>
							<Typography fontWeight={600} color="primary.main" mr="1rem">
								₫{(product.quantity * product.price).toLocaleString('vi-VN')}
							</Typography>
						</FlexBox>

						<FlexBox alignItems="center">
							<Button
								variant="outlined"
								color="primary"
								padding="5px"
								size="none"
								borderColor="primary.light"
								onClick={() => handleCartAmountChange(product.quantity - 1, product)}
								disabled={product.quantity === 1}
							>
								<Icon variant="small">minus</Icon>
							</Button>
							<Typography mx="0.5rem" fontWeight="600" fontSize="15px">
								{product.quantity}
							</Typography>
							<Button
								variant="outlined"
								color="primary"
								padding="5px"
								size="none"
								borderColor="primary.light"
								onClick={() => handleCartAmountChange(product.quantity + 1, product)}
							>
								<Icon variant="small">plus</Icon>
							</Button>
						</FlexBox>
					</FlexBox>
				</FlexBox>

			</FlexBox>
		</StyledProductCard7>
	);
};

export default ProductCard7;
