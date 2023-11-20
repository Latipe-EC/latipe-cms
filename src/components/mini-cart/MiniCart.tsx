import Avatar from "../avatar/Avatar";
import FlexBox from "../FlexBox";
import LazyImage from "../LazyImage";
import React, { Fragment, useState } from "react";
import Button from "../buttons/Button";
import Divider from "../Divider";
import Icon from "../icon/Icon";
import Typography, { H5, Paragraph, Tiny } from "../Typography";
import { StyledMiniCart } from "./MiniCartStyle";
import { AppThunkDispatch, RootState, useAppSelector } from "../../store/store";
import { CartGetDetailResponse } from "api/interface/cart";
import { useDispatch } from "react-redux";
import { deleteCartItem, getMyCart, updateQuantity } from "../../store/slices/carts-slice";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Checkbox, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type MiniCartProps = {
	toggleSidenav?: () => void;
};

const MiniCart: React.FC<MiniCartProps> = ({ toggleSidenav }) => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const carts = useAppSelector((state: RootState) => state.carts);
	const [currentPage, setCurrentPage] = useState(0);
	const [cartSelected, setCartSelected] = useState([]);

	const handleCartAmountChange =
		(amount, cartItem) => {
			dispatch(updateQuantity({ id: cartItem.id, quantity: amount }));
		};

	const handleRemoveCartItem =
		(cartItem) => {
			dispatch(deleteCartItem({ ids: [cartItem.id] }));
		};

	const handleMultiDeleteCartItem =
		() => {
			dispatch(deleteCartItem({ ids: cartSelected }));
		};

	const fetchMoreData = () => {
		if (carts.count <= carts.data.length)
			return;
		dispatch(getMyCart({ skip: (currentPage + 1) * 10, limit: 10 }))
		setCurrentPage(currentPage + 1);
	};

	const handleBuyNow = () => {
		if (cartSelected.length === 0) {
			return;
		}
		navigate(`/checkout?cartIds=${cartSelected.join(',')}`)
	}

	const getTotalPrice = () => {
		return 0;
	};
	React.useEffect(() => {

		return () => {
			dispatch(getMyCart({ skip: 0, limit: 10 }))
		};
	}, []);
	return (
		<StyledMiniCart>
			<div className="cart-list">
				<FlexBox justifyContent="center" alignItems="center" m="0px 20px" height="74px">
					<Icon size="1.75rem">bag</Icon>
					<Typography fontWeight={600} fontSize="16px" ml="0.5rem">
						{carts.count} sản phẩm
					</Typography>
					<FlexBox justifyContent="center" alignItems="center">
						<Button
							color="primary"
							variant="outlined"
							m="0px 1rem 0.75rem"
							onClick={() => {
								toggleSidenav();
								navigate('/cart')
							}}
						>
							<Typography fontWeight={600}>Xem giỏ hàng</Typography>
						</Button>
					</FlexBox>
				</FlexBox>

				<Divider />

				{carts.data.length === 0 && (
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
							Giỏ hàng bạn đang trống, hãy chọn sản phẩm để mua sắm
						</Paragraph>
					</FlexBox>
				)}

				{carts.data.length > 0 && <InfiniteScroll
					dataLength={carts.data.length}
					next={fetchMoreData}
					hasMore={carts.count !== 0 && carts.count > carts.data.length}
					loader={<Spinner />}
				>
					{carts.data.map((item: CartGetDetailResponse) => (
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
										onClick={() => handleCartAmountChange(item.quantity + 1, item)}
									>
										<Icon variant="small">plus</Icon>
									</Button>
									<Typography fontWeight={600} fontSize="15px" my="3px">
										{item.quantity}
									</Typography>
									<Button
										variant="outlined"
										color="primary"
										padding="5px"
										size="none"
										borderColor="primary.light"
										borderRadius="300px"
										onClick={() => handleCartAmountChange(item.quantity - 1, item)}
										disabled={item.quantity === 1}
									>
										<Icon variant="small">minus</Icon>
									</Button>
								</FlexBox>

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
								<Checkbox
									colorScheme={"green"}
									isChecked={cartSelected.includes(item.id)}
									onChange={(e) => {
										if (e.target.checked) {
											setCartSelected([...cartSelected, item.id]);
										} else {
											setCartSelected(cartSelected.filter((id) => id !== item.id));
										}
									}}
								/>
								<Icon
									className="clear-icon"
									size="1rem"
									ml="1.25rem"
									onClick={() => { handleRemoveCartItem(item) }}
								>
									close
								</Icon>
							</div>
							<Divider />
						</Fragment>
					))}
				</InfiniteScroll>}
			</div>

			{!!carts.count && (
				<Fragment>
					<Button
						variant="contained"
						color="secondary"
						m="1rem 1rem 0.75rem"
						onClick={handleMultiDeleteCartItem}
						disabled={cartSelected.length === 0}
					>
						<Typography fontWeight={600}>
							Xóa {cartSelected.length} sản phẩm
						</Typography>
					</Button>
					<Button
						variant="contained"
						color="primary"
						m="1rem 1rem 0.75rem"
						onClick={toggleSidenav}
					>
						<Typography fontWeight={600} onClick={() => handleBuyNow()}>
							Mua ngay (₫{getTotalPrice().toLocaleString('vi-VN')})
						</Typography>
					</Button>
				</Fragment>
			)}
		</StyledMiniCart>
	);
};

MiniCart.defaultProps = {
	toggleSidenav: () => { },
};

export default MiniCart;
