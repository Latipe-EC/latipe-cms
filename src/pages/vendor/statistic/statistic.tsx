import { useNavigate } from "react-router-dom";
import Button from "../../../components/buttons/Button";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import ProductReview from "../../../components/products/ProductReview";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../store/store";
import { getMyStore } from "../../../store/slices/stores-slice";
import { useEffect, useState } from "react";
import { GetMyStoreResponse } from "../../../api/interface/store";
import { GetTotalCommissionResponse, GetTotalOrderInMonthResponse, GetTotalOrderInYear } from "api/interface/order";
import { getTotalCommission, getTotalOrderInMonth, getTotalOrderInYear } from "../../../store/slices/orders-slice";
import { convertDateYYYYMMDD, getMonthDifference } from "../../../utils/utils";
import { set } from "lodash";
import MonthChart from "./MonthChart";

const StatisticVendor = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();

	const [statisticMonth, setStatisticMonth] = useState<GetTotalOrderInMonthResponse>();
	const [statisticYear, setStatisticYear] = useState<GetTotalOrderInYear>();
	const [statisticCommission, setStatisticCommission] = useState<GetTotalCommissionResponse>();
	const [dateMonth, setDateMonth] = useState(new Date());
	const [dateYear, setDateYear] = useState(new Date());
	const [commissionStartMonth, setCommissionStartMonth] = useState(new Date());

	useEffect(() => {
		dispatch(getTotalOrderInMonth(
			{ date: convertDateYYYYMMDD(dateMonth) }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			if (res.data.data.items.length === 0) {
				setStatisticMonth({
					"code": 0,
					"error_code": "",
					"message": "success",
					"data": {
						"filter_date": "2023-12-01",
						"items": [
							{
								"day": 7,
								"amount": 163944000,
								"count": 4
							},
							{
								"day": 5,
								"amount": 301083156000,
								"count": 7346
							}
						]
					}
				})
				return;
			}
			setStatisticMonth(res.data);
		});

		dispatch(getTotalOrderInYear({ date: convertDateYYYYMMDD(dateYear) })).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			if (res.data.data.items.length === 0) {
				setStatisticYear({
					"code": 0,
					"error_code": "",
					"message": "success",
					"data": {
						"items": [
							{
								"month": 12,
								"amount": 301165128000,
								"count": 7348
							},
							{
								"month": 11,
								"amount": 81972000,
								"count": 2
							}
						]
					}
				})
				return;
			}
			setStatisticYear(res.data);
		});

		dispatch(getTotalCommission(
			{ date: convertDateYYYYMMDD(commissionStartMonth) }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			if (res.data.data.items.length === 0) {
				setStatisticCommission({
					"code": 0,
					"error_code": "",
					"message": "success",
					"data": {
						"filter_date": "2023-11-01",
						"items": [
							{
								"month": 12,
								"total_received": 77900000,
								"total_fee": 4100000,
								"total_orders": 2
							}
						]
					}
				})
				return;
			}
			setStatisticCommission(res.data);
		});

	}, []);

	return (
		<div>
			<DashboardPageHeader
				title="Doanh thu"
				iconName="bag_filled"
				button={
					<a href="/vendor/orders">
						<Button color="primary" bg="primary.light" px="2rem">
							Quay lại
						</Button>
					</a>
				}
			/>
			{statisticMonth && <MonthChart statisticMonth={statisticMonth} />}
		</div>
	);
};



export default StatisticVendor;
