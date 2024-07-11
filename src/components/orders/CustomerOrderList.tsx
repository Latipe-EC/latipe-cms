import React, { useEffect, useState } from 'react';
import DashboardPageHeader from "../layout/DashboardPageHeader";
import OrderRow from "./OrderRow";
import { Box, Icon, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text, useMediaQuery } from "@chakra-ui/react";
import { AppThunkDispatch } from '@stores/store';
import { useDispatch } from 'react-redux';
import { getMyOrder } from '../../stores/slices/orders-slice';
import { GetMyOrderResponse } from '@interfaces/order';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBox from '@components/FlexBox';
import Pagination from '@components/pagination/Pagination';
import { getParamStatusOrder } from '@/utils/utils';
import { MdCancel, MdCheckCircle, MdDoneAll, MdList, MdLocalShipping, MdMoneyOff, MdPendingActions } from 'react-icons/md';
import { LoadingOverlay } from '@/components/loading/LoadingOverlay';

export interface CustomerOrderListProps {
}

const CustomerOrderList: React.FC<CustomerOrderListProps> = () => {
	const [indexTab, setTabIndex] = useState(0);
	const dispatch = useDispatch<AppThunkDispatch>();
	const [orderList, setOrderList] = useState<GetMyOrderResponse>();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const filter = params.get('filter');
	const navigate = useNavigate();
	const [isMobile] = useMediaQuery('(max-width: 768px)');
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(params.get('page') ? params.get('page') : "1");

	useEffect(() => {
		handleGetListOrder();
	}, [currentPage, filter]);


	useEffect(() => {
		if (currentPage !== "1")
			setCurrentPage("1");
		else {
			handleGetListOrder();
		}
	}, [indexTab]);


	const handleGetListOrder = () => {
		const paramFilter = getParamStatusOrder(indexTab);
		setLoading(true);
		dispatch(getMyOrder({
			"size": "5",
			"page": currentPage,
			...paramFilter
		})).unwrap().then((res) => {
			setOrderList(res.data);
		}).catch(() => {
			navigate("/502")
		}).finally(() => {
			setLoading(false);
		});
	}

	return (
		<Box minHeight={"xl"} display="flex" flexDirection="column" justifyContent="space-between">
			<FlexBox flexDirection="column" justifyContent="flex-start">
				<DashboardPageHeader title="Đơn hàng của tôi" iconName="bag_filled" />
				<Tabs onChange={(index) => setTabIndex(index)} position="relative" variant="unstyled">
					<TabList display="flex">
						<Tab flex="1">{isMobile ? <Icon as={MdList} /> : 'Tất cả'}</Tab>
						<Tab flex="1">{isMobile ? <Icon as={MdPendingActions} /> : 'Chờ xác nhận'}</Tab>
						<Tab flex="1">{isMobile ? <Icon as={MdCheckCircle} /> : 'Đã xác nhận'}</Tab>
						<Tab flex="1">{isMobile ? <Icon as={MdLocalShipping} /> : 'Chờ giao hàng'}</Tab>
						<Tab flex="1">{isMobile ? <Icon as={MdDoneAll} /> : 'Hoàn thành'}</Tab>
						<Tab flex="1">{isMobile ? <Icon as={MdCancel} /> : 'Đã hủy'}</Tab>
						<Tab flex="1">{isMobile ? <Icon as={MdMoneyOff} /> : 'Trả hàng/hoàn tiền'}</Tab>
					</TabList>
					<TabIndicator
						mt="-1.5px"
						height="2px"
						bg="blue.500"
						borderRadius="1px"
					/>
					<TabPanels>
						{Array.from({ length: 7 }).map((_, index) => (
							<TabPanel key={`tab-index${index}`}>
								{orderList && orderList.data.items.map((item, ind) => (
									<OrderRow order={item} key={ind} />
								))}
							</TabPanel>
						))}

					</TabPanels>
				</Tabs>

				{loading && <LoadingOverlay isLoading={loading} />}

				{!loading && orderList && orderList.data.items.length === 0 &&
					<FlexBox justifyContent="center" alignItems="center" mt="2.5rem" height={"xl"}>
						<Text
							fontSize="x-large"
							textAlign="center"
							fontWeight="bold"
						>Không có đơn hàng nào</Text>
					</FlexBox>
				}
			</FlexBox>

			{!loading && orderList && orderList.data.items.length > 0 &&
				<FlexBox justifyContent="center" mt="2.5rem">
					<Pagination
						pageCount={Math.ceil(orderList.data.total)}
						onChange={(data) => {
							setCurrentPage((data + 1).toString());
						}}
					/>
				</FlexBox>}

		</Box>
	);
};

export default CustomerOrderList;
