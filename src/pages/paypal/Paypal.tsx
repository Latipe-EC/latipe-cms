import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../stores/slices/orders-slice";
import { AppThunkDispatch } from "../../stores/store";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { DataGetOrderById } from "../../api/interface/order";
import { CapturePayment } from "../../api/interface/payment";
import { payByPaypal } from "../../stores/slices/payment-slice";

export default function Paypal() {
	const { id } = useParams();
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [orderDetail, setOrderDetail] = useState<DataGetOrderById>();


	useEffect(() => {
		dispatch(getOrderById(id)).unwrap().then((res) => {
			if (!res.data.error_code) {
				setOrderDetail(res.data.data)
			} else
				navigate('/404');
		});
	}, []);

	const onCreateOrder = (_, actions) => actions.order.create({
		purchase_units: [
			{
				amount: {
					value: (orderDetail.order.amount / 25000).toFixed(2),
					currency: "USD",
					breakdown: {
						item_total: {
							currency_code: "USD",
							value: (orderDetail.order.amount / 25000).toFixed(2), // This should be the total cost of all items
						},
					},
				},
				shipping: {
					name: {
						full_name: orderDetail.order.delivery.shipping_name,
					},
					address: {
						address_line_1: orderDetail.order.delivery.shipping_address,
						country_code: "VN",
						admin_area_2: 'City',
						admin_area_1: 'State',
						postal_code: '12345',
					},
				},
				// items: [
				// 	...orderDetail.order.order_items.map((item) => {
				// 		return {
				// 			name: item.product_name,
				// 			quantity: item.quantity,
				// 			unit_amount: {
				// 				currency_code: 'USD',
				// 				value: (item.price / 25000).toFixed(2),
				// 			},
				// 		}
				// 	}),
				// 	{
				// 		name: "shipping fee",
				// 		quantity: 1,
				// 		unit_amount: {
				// 			currency_code: 'USD',
				// 			value: ((orderDetail.order.amount -
				// 				orderDetail.order.order_items.reduce((total, item) => total + (item.price * item.quantity), 0)
				// 			) / 25000).toFixed(2),
				// 		},
				// 	}
				// ]
			},
		],
	});

	const onApproveOrder = (_, actions) =>
		actions.order.capture().then((response: CapturePayment) => {
			if (response.status === "COMPLETED") {
				console.log(response);
				dispatch(payByPaypal({
					orderId: orderDetail.order.order_uuid,
					id: response.id,
					status: response.status,
					email: response.payer.email_address,
				})).unwrap().then((res) => {
					if (res.status === 200) {
						navigate('/payment-success');
					} else
						navigate('/404');
				});
			}
		})

	return (
		<div>
			<PayPalScriptProvider options={{
				clientId: "AaRyHTbiuujPUm3OnRzxaLpq_AEd1amZZ0faxsZA307puscnRCacHVHGd4LHU3ATYfK9F5JrJQ4bEL_c",
				components: "buttons",
				currency: "USD",
				intent: "capture",
			}}>
				<PayPalButtons
					style={{ layout: "vertical" }}
					createOrder={(data, actions) => onCreateOrder(data, actions)}
					onApprove={(data, actions) => onApproveOrder(data, actions)}
				/>
			</PayPalScriptProvider>
		</div>
	);
}

