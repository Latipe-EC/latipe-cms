import React, { useEffect, useState } from 'react';
import DashboardPageHeader from "../layout/DashboardPageHeader";
import OrderRow from "./OrderRow";
import { Box, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { AppThunkDispatch } from '@stores/store';
import { useDispatch } from 'react-redux';
import { getMyOrder } from '../../stores/slices/orders-slice';
import { GetMyOrderResponse } from '@interfaces/order';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBox from '@components/FlexBox';
import Pagination from '@components/pagination/Pagination';
import { getParamStatusOrder } from '@/utils/utils';
import { Content } from '@/utils/constants';

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

		dispatch(getMyOrder({
			"size": "5",
			"page": currentPage,
			...paramFilter
		})).unwrap().then((res) => {
			setOrderList(res.data);
		}).catch(() => {
			navigate("/502")
		});
	}

	return (
		<Box minHeight={"xl"} display="flex" flexDirection="column" justifyContent="space-between">
			<FlexBox flexDirection="column" justifyContent="flex-start">
				<DashboardPageHeader title="Đơn hàng của tôi" iconName="bag_filled" />
				<Tabs onChange={(index) => setTabIndex(index)} position="relative" variant="unstyled">
					<TabList display="flex">
						<Tab flex="1">{Content.ALL}</Tab>
						<Tab flex="1">{Content.WAIT_FOR_PAY}</Tab>
						<Tab flex="1">{Content.SHIPPING}</Tab>
						<Tab flex="1">{Content.WAIT_FOR_DELIVERY}</Tab>
						<Tab flex="1">{Content.COMPLETE}</Tab>
						<Tab flex="1">{Content.CANCLED}</Tab>
						<Tab flex="1">{Content.REFUND}</Tab>
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
				{orderList && orderList.data.items.length === 0 &&
					<FlexBox justifyContent="center" alignItems="center" mt="2.5rem" height={"xl"}>
						<Text
							fontSize="x-large"
							textAlign="center"
							fontWeight="bold"
						>Không có đơn hàng nào</Text>
					</FlexBox>
				}
			</FlexBox>
			{orderList && orderList.data.items.length > 0 &&
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
