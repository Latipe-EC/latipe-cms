import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../stores/slices/orders-slice";
import { AppThunkDispatch } from "../../stores/store";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Spinner } from "@chakra-ui/react";

const style = { layout: 'vertical' as 'vertical' | 'horizontal', };


export default function Paypal() {
	const paypal = useRef();
	const { orderId } = useParams();
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();


	useEffect(() => {
		dispatch(getOrderById(orderId)).unwrap().then((res) => {
			if (!res.data.error_code) {
				window.paypal
					.Buttons({
						createOrder: (_, actions) => {
							return actions.order.create({
								intent: "CAPTURE",
								purchase_units: [
									{
										description: "Thanh toán đơn hàng",
										amount: {
											currency_code: "VND",
											value: res.data.data.order.amount.toString(),
										},
									},
								],
							});
						},
						onApprove: async (_, actions) => {
							const order = await actions.order.capture();
							console.log(order);
						},
						onError: (err) => {
							console.log(err);
						},
					})
					.render(paypal.current);
			} else
				navigate('/404');
		});


	}, []);

	return (
		<div style={{ maxWidth: "750px", minHeight: "200px" }}>
			<PayPalScriptProvider options={{
				clientId: "AaRyHTbiuujPUm3OnRzxaLpq_AEd1amZZ0faxsZA307puscnRCacHVHGd4LHU3ATYfK9F5JrJQ4bEL_c",
				components: "buttons",
				currency: "USD",
				intent: "capture",
			}}>
				<ButtonWrapper showSpinner={false} />
			</PayPalScriptProvider>
		</div>
	);
}


function createOrder() {
	// replace this url with your server
	return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/create-order", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		// use the "body" param to optionally pass additional order information
		// like product ids and quantities
		body: JSON.stringify({
			cart: [
				{
					sku: "1blwyeo8",
					quantity: 2,
				},
			],
		}),
	})
		.then((response) => response.json())
		.then((order) => {
			// Your code here after create the order
			return order.id;
		});
}

function onApprove(data) {
	// replace this url with your server
	return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			orderID: data.orderID,
		}),
	})
		.then((response) => response.json())
	// .then((orderData) => {
	// 	// Your code here after capture the order
	// });
}

const ButtonWrapper = ({ showSpinner }) => {
	const [{ isPending }] = usePayPalScriptReducer();

	return (
		<>
			{(showSpinner && isPending) && <Spinner />}
			<PayPalButtons
				style={style}
				disabled={false}
				forceReRender={[style]}
				fundingSource={undefined}
				createOrder={createOrder}
				onApprove={onApprove}
			/>
		</>
	);
}
