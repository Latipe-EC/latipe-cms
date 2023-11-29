import { useEffect, useState } from "react";
import CheckoutForm2 from "../../src/components/checkout/CheckoutForm2";
import CheckoutSummary2 from "../../src/components/checkout/CheckoutSummary2";
import Container from "../../src/components/Container";
import GroceryLayout from "../../src/components/layout/GroceryLayout";
import Grid from "../components/grid/Grid";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "store/store";
import { getMultiCart } from "../store/slices/carts-slice";
import { getFeatureProduct } from "../store/slices/products-slice";
import { useNavigate } from "react-router-dom";

const CheckoutAlternative = () => {
	const [products, setProducts] = useState([]);
	const [vouchers, setVouchers] = useState([]);
	const [selectDelivery, setSelectDelivery] = useState(null);
	const navigate = useNavigate();

	const dispatch = useDispatch<AppThunkDispatch>();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const listCartIdsString = params.get('cartIds')
		const productId = params.get('productId')
		const option = params.get('option')
		const quantity = params.get('quantity')

		if (listCartIdsString) {
			dispatch(getMultiCart({ cartIds: listCartIdsString })).unwrap().then((res) => {
				setProducts(res.data)
			});
		} else if (productId !== null && option !== null) {
			// const productId option
			dispatch(getFeatureProduct([
				{
					productId: productId,
					optionId: option,
				}
			])).unwrap().then((res) => {
				if (res.data.length === 0) {
					navigate('/404');
				}
				setProducts([{ ...res.data[0], quantity: quantity, productOptionId: option, image: res.data[0].thumbnailUrl, productId: res.data[0].id }])
			});
		} else {
			navigate('/404');
		}
	}, []);

	return (
		<Container my="1.5rem">
			<Grid container spacing={6}>
				<Grid item lg={8} md={8} xs={12}>
					<CheckoutForm2 products={products}
						vouchers={vouchers}
						setVouchers={setVouchers} setSelectDelivery={setSelectDelivery}
					/>
				</Grid>
				<Grid item lg={4} md={4} xs={12}>
					<CheckoutSummary2
						products={products}
						vouchers={vouchers}
						selectDelivery={selectDelivery}
					/>
				</Grid>
			</Grid>
		</Container>
	);
};

CheckoutAlternative.layout = GroceryLayout;

export default CheckoutAlternative;
