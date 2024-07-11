import { useNavigate } from "react-router-dom";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { useEffect, useState } from "react";
import {
	DataGetTotalCommissionAdmin,
	GetTotalOrderInMonthResponse,
	GetTotalOrderInYear,
	StatisticRevenueDistributionAdminResponse,
} from "@interfaces/order";
import {
	getBusinessReportByAdmin,
	getRevenueDistributionByAdmin,
	getTotalCommissionAdmin,
	getTotalOrderInMonthAdmin,
	getTotalOrderInYearAdmin
} from "@stores/slices/orders-slice";
import { convertDateYYYYMM, convertDateYYYYMMDD, downloadFile } from "../../../utils/utils";
import { Box, Button, Flex, Heading, Input, Text, useToast } from "@chakra-ui/react";
import MonthChart from "@components/chart/MonthChart";
import YearChart from "@components/chart/YearChart";
import CommissionAdminChart from "@components/chart/CommissionAdminChart";
import PieChartDistribution from "@/pages/admin/statistic/PieChartDistribution";
import { DownloadIcon } from "@chakra-ui/icons";
import { LoadingOverlay } from "@/components/loading/LoadingOverlay";

const StatisticAdmin = () => {

	const date = new Date();

	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();

	const [statisticMonth, setStatisticMonth] = useState<GetTotalOrderInMonthResponse>();
	const [statisticYear, setStatisticYear] = useState<GetTotalOrderInYear>();
	const [statisticCommission, setStatisticCommission] = useState<DataGetTotalCommissionAdmin>();
	const [dateMonth, setDateMonth] = useState(date);
	const [dateYear, setDateYear] = useState(date);
	const [revenueDate, setRevenueDate] = useState(date);

	const [commissionStartMonth, setCommissionStartMonth] = useState(date);
	const [revenueDistribution, setRevenueDistribution] = useState<StatisticRevenueDistributionAdminResponse>();
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	useEffect(() => {
		dispatch(getTotalOrderInMonthAdmin(
			{ date: convertDateYYYYMMDD(dateMonth) }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			if (!res.data.data.items) {
				setStatisticMonth({
					"code": 0,
					"error_code": "",
					"message": "success",
					"data": {
						"filter_date": "2023-12-01",
						"items": [
						]
					}
				})
				return;
			}
			setStatisticMonth(res.data);
		});
	}, [dateMonth]);

	useEffect(() => {

		dispatch(getRevenueDistributionByAdmin({ date: convertDateYYYYMM(dateYear) })).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setRevenueDistribution(res.data);
		});
	}, [revenueDate]);

	useEffect(() => {

		dispatch(getTotalOrderInYearAdmin({ date: convertDateYYYYMMDD(dateYear) })).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}

			if (!res.data.data.items) {
				setStatisticYear({
					"code": 0,
					"error_code": "",
					"message": "success",
					"data": {
						"items": []
					}
				})
				return;
			}
			setStatisticYear(res.data);
		});
	}, [dateYear]);

	useEffect(() => {
		dispatch(getTotalCommissionAdmin(
			{ date: convertDateYYYYMMDD(commissionStartMonth) }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			console.log(res.data.data);
			setStatisticCommission(res.data.data);
		});
	}, [commissionStartMonth]);

	const handleExportData = (e) => {
		e.preventDefault();
		setIsLoading(true);
		dispatch(getBusinessReportByAdmin(
			{ date: convertDateYYYYMM(commissionStartMonth) }
		)).unwrap()
			.then((response) => {
				if (response.status !== 200) {
					navigate("/401");
					return;
				}
				const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
				downloadFile(blob, `business-report-${convertDateYYYYMM(commissionStartMonth)}.xlsx`);
				setIsLoading(false);
			})
			.catch(() => {
				toast({
					title: "Lỗi",
					description: "Có lỗi xảy ra khi xuất dữ liệu",
					status: "error",
					duration: 2000,
					isClosable: true,
					position: "top-right",
				})
				setIsLoading(false);
			});
	}

	return (
		<div>
			<DashboardPageHeader
				title="Doanh thu"
				iconName="bag_filled"
				button={
					<a href="/vendor/orders">
						<Button color="white" backgroundColor="red" px="2rem">
							Quay lại
						</Button>
					</a>
				}
			/>

			<LoadingOverlay isLoading={isLoading} />
			<Box p={5}>
				<Heading mb={5}>Phân bổ doanh thu</Heading>
				<Flex justify="space-between">
					<Input
						w="10%"
						type="date"
						value={revenueDate.toISOString().slice(0, 10)}
						onChange={(e) => {
							setRevenueDate(new Date(e.target.value))
						}}
					/>
					<Button
						onClick={handleExportData}
						backgroundColor="blue.500" // Đặt màu nền cụ thể
						color="white" // Đặt màu chữ
						_hover={{ bg: "blue.600" }} // Màu khi hover
						variant="solid"
						leftIcon={<DownloadIcon />}
						isDisabled={!(revenueDistribution && revenueDistribution.data)}
					>
						Xuất dữ liệu
					</Button>
				</Flex>
				{revenueDistribution && revenueDistribution.data ?
					<PieChartDistribution data={revenueDistribution.data} /> : (
						<Text color="gray.500" fontSize="lg" mt={5} textAlign="center">Không có dữ liệu để hiển thị</Text>
					)}
			</Box>
			<Box p={5}>
				<Heading mb={5}>Doanh thu theo tháng</Heading>
				<Input
					w="10%"
					type="date"
					value={revenueDate.toISOString().slice(0, 10)}
					onChange={(e) => {
						setDateMonth(new Date(e.target.value))
					}}
				></Input>
				{statisticMonth && statisticMonth.data.items && statisticMonth.data.items.length > 0 ?
					<MonthChart statisticMonth={statisticMonth} /> : (
						<Text color="gray.500" fontSize="lg" mt={5} textAlign="center">Không có dữ liệu để hiển thị</Text>
					)}
			</Box>
			<Box p={5}>
				<Heading mb={5}>Doanh thu theo năm</Heading>
				<Input
					w="10%"
					type="date"
					value={dateYear.toISOString().slice(0, 10)}
					onChange={(e) => {
						setDateYear(new Date(e.target.value))
					}}
				></Input>
				{statisticYear && statisticYear.data.items.length > 0 ? (
					<YearChart statisticYear={statisticYear} />
				) : (
					<Text color="gray.500" fontSize="lg" mt={5} textAlign="center">Không có dữ liệu để hiển thị</Text>
				)}
			</Box>
			<Box p={5}>
				<Heading mb={5}>Hoa hồng</Heading>
				<Input
					w="10%"
					type="date"
					value={commissionStartMonth.toISOString().slice(0, 10)}
					onChange={(e) => {
						setCommissionStartMonth(new Date(e.target.value))
					}}
				></Input>
				{statisticCommission && statisticCommission.items && statisticCommission.items.length > 0 ?
					<CommissionAdminChart statisticCommission={statisticCommission} /> : (
						<Text color="gray.500" fontSize="lg" mt={5} textAlign="center">Không có dữ liệu để hiển thị</Text>
					)}
			</Box>
		</div>
	);
};


export default StatisticAdmin;
