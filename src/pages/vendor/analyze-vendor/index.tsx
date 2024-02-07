import { useNavigate } from "react-router-dom";
import Button from "@components/buttons/Button";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { useEffect, useState } from "react";
import {
	getProductBestSeller
} from "@stores/slices/orders-slice";
import { convertDateYYYYMMDD } from "../../../utils/utils";
import { GetProductBestSellerResponse } from "@interfaces/order";
import PieChartListProduct from "@components/chart/PieChartListProduct";
import { Box, Flex, Input, Select, Text } from "@chakra-ui/react";

const date = new Date();
const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
const AnalyzeVendor = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [responseProduct, setResponseProduct] = useState<GetProductBestSellerResponse>();

	const [countProductFilter, setCountProductFilter] = useState(2);
	const [dateProuct, setDateProduct] = useState(firstDayOfMonth);

	const handleDateChange = (e) => {
		const { value } = e.target;
		setDateProduct(new Date(value));
	};

	useEffect(() => {
		dispatch(getProductBestSeller(
			{ date: convertDateYYYYMMDD(dateProuct), count: countProductFilter }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setResponseProduct(res.data);
		});

	}, [dateProuct, countProductFilter]);
	const options = [...Array(10)].map((_, i) => i + 1);
	return (
		<div>
			<DashboardPageHeader
				title="Phân tích bán hàng"
				iconName="bag_filled"
				button={
					<a href="/vendor/orders">
						<Button color="primary" bg="primary.light" px="2rem">
							Quay lại
						</Button>
					</a>
				}
			/>

			<Flex direction="row" align="center" justify="space-between">
				<Text color='secondaryGray.900' fontSize='22px' mb="4px" fontWeight='700'
					lineHeight='100%'>
					Sản phẩm bán chạy
				</Text>
				<Select width="20%" value={countProductFilter}
					onChange={(e) => setCountProductFilter(Number(e.target.value))}>
					{options.map((option) => (
						<option value={option} key={option}>
							{option}
						</option>
					))}
				</Select>
				<Input
					w="10%"
					type="date"
					value={dateProuct.toISOString().slice(0, 10)}
					onChange={handleDateChange}
				/>
			</Flex>
			{responseProduct && responseProduct.data.items &&
				<Box width={'100%'} minHeight={'600px'}>
					<PieChartListProduct data={responseProduct.data.items} /></Box>}
		</div>
	);
};


export default AnalyzeVendor;
