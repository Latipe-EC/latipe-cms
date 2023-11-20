import { Fragment, useState } from "react";
import Button from "../components/buttons/Button";
import FlexBox from "../components/FlexBox";
import Grid from "../components/grid/Grid";
import CheckoutNavLayout from "../components/layout/CheckoutNavLayout";
import ProductCard7 from "../components/product-cards/ProductCard7";
import Typography from "../components/Typography";
import CartLayout from "../components/layout/CartLayout";
import { AppThunkDispatch, RootState, useAppSelector } from "../store/store";
import { useDispatch } from "react-redux";
import { deleteCartItem, getMyCart } from "../store/slices/carts-slice";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
	const carts = useAppSelector((state: RootState) => state.carts);
	const navigate = useNavigate();
	const [cartSelected, setCartSelected] = useState([]);
	const dispatch = useDispatch<AppThunkDispatch>();
	const [currentPage, setCurrentPage] = useState(0);

	const handleBuySelected = () => {
		if (cartSelected.length === 0) {
			return;
		}
		navigate(`/checkout?cartIds=${cartSelected.join(',')}`)
	}

	const fetchMoreData = () => {
		if (carts.count <= carts.data.length)
			return;
		dispatch(getMyCart({ skip: (currentPage + 1) * 10, limit: 10 }))
		setCurrentPage(currentPage + 1);

	};

	const handleRemoveSelected = () => {
		dispatch(deleteCartItem({ ids: cartSelected }));
	}
	const handleUnselectAll = () => {
		setCartSelected([]);
	}
	const calculateTotalPrice = () => {
		let total = 0;
		carts.data.forEach((item) => {
			if (cartSelected.includes(item.id)) {
				total += item.price * item.quantity;
			}
		})
		return total;
	}
	return (
		<CartLayout>
			<Fragment>
				<Grid containe>
					<Grid item xl={12} lg={8} md={8} xs={12} mb={8}>
						{carts.data.length > 0 && <InfiniteScroll
							dataLength={carts.data.length}
							next={fetchMoreData}
							hasMore={carts.count !== 0 && carts.count > carts.data.length}
							loader={<Spinner />}
						>
							{carts.data.map((item) => (
								<ProductCard7 key={item.id} mb="1.5rem" product={item}
									cartSelected={cartSelected} setCartSelected={setCartSelected} />
							))}
						</InfiniteScroll>}
					</Grid>
				</Grid>
				<FlexBox
					position="fixed"
					bottom="0"
					left="0"
					right="0"
					width="100%"
					justifyContent="space-between"
					alignItems="center"
					p="1rem"
					backgroundColor="#F6F9FC"
				>
					<Button variant="contained" color="primary" onClick={handleUnselectAll}>
						Bỏ chọn sản phẩm ({cartSelected.length})
					</Button>
					<Typography fontWeight={"bold"}>
						Tổng giá tiền: ₫{calculateTotalPrice().toLocaleString('vi-VN')}
					</Typography>
					<FlexBox justifyContent="space-between"
						alignItems="center">
						<Button
							disabled={cartSelected.length === 0}
							color="primary"
							border="1px solid"

							onClick={handleRemoveSelected}
							style={{ marginLeft: '10px' }}
							mr={2}>
							Xóa sản phẩm đã chọn
						</Button>
						<Button
							borderRadius="5px"
							borderColor="green"
							border="1px solid"
							disabled={cartSelected.length === 0}
							color="green" onClick={handleBuySelected}>
							Mua hàng
						</Button>
					</FlexBox>
				</FlexBox>
			</Fragment>
		</CartLayout>
	);
};

Cart.layout = CheckoutNavLayout;

export default Cart;
