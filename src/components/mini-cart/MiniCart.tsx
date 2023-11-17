import Avatar from "../avatar/Avatar";
import FlexBox from "../FlexBox";
import LazyImage from "../LazyImage";
import { useAppContext } from "../../contexts/app/AppContext";
import { CartItem } from "../../reducers/cartReducer";
import React, { Fragment, useCallback } from "react";
import Button from "../buttons/Button";
import Divider from "../Divider";
import Icon from "../icon/Icon";
import Typography, { H5, Paragraph, Tiny } from "../Typography";
import { StyledMiniCart } from "./MiniCartStyle";
import { RootState, useAppSelector } from "../../store/store";

type MiniCartProps = {
	toggleSidenav?: () => void;
};

const MiniCart: React.FC<MiniCartProps> = ({ toggleSidenav }) => {
	const { dispatch } = useAppContext();
	const carts = useAppSelector((state: RootState) => state.carts);
	const [cartSelected, setCartSelected] = React.useState([]);
	const handleCartAmountChange = useCallback(
		(amount, product) => () => {
			dispatch({
				type: "CHANGE_CART_AMOUNT",
				payload: {
					...product,
					qty: amount,
				},
			});
		},
		[]
	);

	const getTotalPrice = () => {
		return (
			cartList.reduce(
				(accumulator, item) => accumulator + item.price * item.qty,
				0
			) || 0
		);
	};

	return (
		<StyledMiniCart>
			<div className="cart-list">
				<FlexBox alignItems="center" m="0px 20px" height="74px">
					<Icon size="1.75rem">bag</Icon>
					<Typography fontWeight={600} fontSize="16px" ml="0.5rem">
						{carts.count} item
					</Typography>
				</FlexBox>

				<Divider />

				{!!!carts.count && (
					<FlexBox
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						height="calc(100% - 80px)"
					>
						<LazyImage
							src="/assets/images/logos/shopping-bag.svg"
							width="90px"
							height="100%"
						/>
						<Paragraph
							mt="1rem"
							color="text.muted"
							textAlign="center"
							maxWidth="200px"
						>
							Your shopping bag is empty. Start shopping
						</Paragraph>
					</FlexBox>
				)}
				// TODO : change display cart
				{/* {cartList.map((item: CartItem) => (
					<Fragment key={item.id}>
						<div className="cart-item">
							<FlexBox alignItems="center" flexDirection="column">
								<Button
									variant="outlined"
									color="primary"
									padding="5px"
									size="none"
									borderColor="primary.light"
									borderRadius="300px"
									onClick={handleCartAmountChange(item.qty + 1, item)}
								>
									<Icon variant="small">plus</Icon>
								</Button>
								<Typography fontWeight={600} fontSize="15px" my="3px">
									{item.qty}
								</Typography>
								<Button
									variant="outlined"
									color="primary"
									padding="5px"
									size="none"
									borderColor="primary.light"
									borderRadius="300px"
									onClick={handleCartAmountChange(item.qty - 1, item)}
									disabled={item.qty === 1}
								>
									<Icon variant="small">minus</Icon>
								</Button>
							</FlexBox>

							<a href={`/product/${item.id}`}>
								<Avatar
									src={item.imgUrl || "/assets/images/products/iphone-x.png"}
									mx="1rem"
									alt={item.name}
									size={76}
								/>
							</a>

							<div className="product-details">
								<a href={`/product/${item.id}`}>
									<H5 className="title" fontSize="14px">
										{item.name}
									</H5>
								</a>
								<Tiny color="text.muted">
									${item.price.toFixed(2)} x {item.qty}
								</Tiny>
								<Typography
									fontWeight={600}
									fontSize="14px"
									color="primary.main"
									mt="4px"
								>
									${(item.qty * item.price).toFixed(2)}
								</Typography>
							</div>

							<Icon
								className="clear-icon"
								size="1rem"
								ml="1.25rem"
								onClick={handleCartAmountChange(0, item)}
							>
								close
							</Icon>
						</div>
						<Divider />
					</Fragment>
				))} */}
			</div>

			{!!carts.count && (
				<Fragment>
					<a href="/checkout">
						<Button
							variant="contained"
							color="primary"
							m="1rem 1rem 0.75rem"
							onClick={toggleSidenav}
						>
							<Typography fontWeight={600}>
								Checkout Now (${getTotalPrice().toFixed(2)})
							</Typography>
						</Button>
					</a>
					<a href="/cart">
						<Button
							color="primary"
							variant="outlined"
							m="0px 1rem 0.75rem"
							onClick={toggleSidenav}
						>
							<Typography fontWeight={600}>View Cart</Typography>
						</Button>
					</a>
				</Fragment>
			)}
		</StyledMiniCart>
	);
};

MiniCart.defaultProps = {
	toggleSidenav: () => { },
};

export default MiniCart;
