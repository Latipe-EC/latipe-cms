import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppThunkDispatch } from "@stores/store";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CapturePayment } from "../../api/interface/payment";
import { payByPaypal, totalAmount } from "@stores/slices/payment-slice";

export default function Paypal() {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [total, setTotal] = useState<number>();
	const params = new URLSearchParams(location.search);
	const ids: string = params.get('ids');
	useEffect(() => {

		params
		dispatch(totalAmount({
			orderIds: ids.split(',')
		})).unwrap().then((res) => {
			if (res.status !== 200) {
				setTotal(res.data.amount)
			} else
				navigate('/404');
		});
	}, []);

	const onCreateOrder = (_, actions) => actions.order.create({
		purchase_units: [
			{
				amount: {
					value: (total / 25000).toFixed(2),
					currency: "USD",
					breakdown: {
						item_total: {
							currency_code: "USD",
							value: (total / 25000).toFixed(2), // This should be the total cost of all items
						},
					},
				},
			},
		],
	});

	const onApproveOrder = (_, actions) =>
		actions.order.capture().then((response: CapturePayment) => {
			if (response.status === "COMPLETED") {
				dispatch(payByPaypal({
					orderIds: ids.split(','),
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

