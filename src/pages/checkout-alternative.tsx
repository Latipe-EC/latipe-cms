import { useEffect, useState } from "react";
import CheckoutForm2 from "@components/checkout/CheckoutForm2";
import CheckoutSummary2 from "@components/checkout/CheckoutSummary2";
import Container from "@components/Container";
import GroceryLayout from "@components/layout/GroceryLayout";
import Grid from "@components/grid/Grid";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { getMultiCart } from "@stores/slices/carts-slice";
import { getFeatureProduct } from "@stores/slices/products-slice";
import { useNavigate } from "react-router-dom";

const CheckoutAlternative = () => {
	const [products, setProducts] = useState([]);
	const [vouchers, setVouchers] = useState([]);
	const [listDeliveries, setListDeliveries] = useState([]);
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
				if (res.status !== 200)
					navigate('/404');
				setProducts(res.data.map((item) => {
					return { ...item, cart_id: item.id }
				}));
			});
		} else if (productId !== null && option !== null) {
			// const productId option
			dispatch(getFeatureProduct([
				{
					productId: productId,
					optionId: option,
				}
			])).unwrap().then((res) => {
				if (res.status !== 200)
					navigate('/404');
				setProducts([{
					...res.data[0],
					quantity: quantity,
					productOptionId: option,
					image: res.data[0].thumbnailUrl,
					productId: res.data[0].id
				}])
			});
		} else {
			navigate('/404');
		}
		return () => {
		};
	}, []);

	return (
		<Container my="1.5rem">
			<Grid container spacing={6}>
				<Grid key={`checkout-alter-`} item lg={8} md={8} xs={12}>
					<CheckoutForm2
						products={products}
						vouchers={vouchers}
						setVouchers={setVouchers}
						setListDeliveries={setListDeliveries}
						listDeliveries={listDeliveries}
						key='checkout-form'
					/>
				</Grid>
				<Grid item lg={4} md={4} xs={12}>
					<CheckoutSummary2
						products={products}
						vouchers={vouchers}
						listDeliveries={listDeliveries}
						key='checkout-summary'
					/>
				</Grid>
			</Grid>
		</Container>
	);
};

CheckoutAlternative.layout = GroceryLayout;

export default CheckoutAlternative;
