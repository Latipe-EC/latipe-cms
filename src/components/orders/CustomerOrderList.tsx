import React, { useEffect, useState } from 'react';
import DashboardPageHeader from "../layout/DashboardPageHeader";
import OrderRow from "./OrderRow";
import { Box, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export interface CustomerOrderListProps { }

const CustomerOrderList: React.FC<CustomerOrderListProps> = () => {
	const [indexTab, setTabIndex] = useState(0);
	useEffect(() => {
	}, [indexTab]);
	return (
		<Box>
			<DashboardPageHeader title="Đơn hàng của tôi" iconName="bag_filled" />
			<Tabs onChange={(index) => setTabIndex(index)} position="relative" variant="unstyled">
				<TabList display="flex" >
					<Tab flex="1">Tất cả</Tab>
					<Tab flex="1">Chờ thanh toán</Tab>
					<Tab flex="1">Vận chuyển</Tab>
					<Tab flex="1">Chờ giao hàng</Tab>
					<Tab flex="1">Đã hủy</Tab>
					<Tab flex="1">Trả hàng/hoàn tiền</Tab>
				</TabList>
				<TabIndicator
					mt="-1.5px"
					height="2px"
					bg="blue.500"
					borderRadius="1px"
				/>
				<TabPanels>
					<TabPanel>
						{orderList.map((item, ind) => (
							<OrderRow item={item} key={ind} />
						))}
					</TabPanel>
					<TabPanel>
						{orderList.map((item, ind) => (
							<OrderRow item={item} key={ind} />
						))}
					</TabPanel>
					<TabPanel>
						{orderList.map((item, ind) => (
							<OrderRow item={item} key={ind} />
						))}
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

const orderList = [
	{
		orderNo: "1050017AS",
		status: "Pending",
		purchaseDate: new Date(),
		price: 350,
		href: "/orders/5452423",
	},
	{
		orderNo: "1050017AS",
		status: "Processing",
		purchaseDate: new Date(),
		price: 500,
		href: "/orders/5452423",
	},
	{
		orderNo: "1050017AS",
		status: "Delivered",
		purchaseDate: "2020/12/23",
		price: 700,
		href: "/orders/5452423",
	},
	{
		orderNo: "1050017AS",
		status: "Delivered",
		purchaseDate: "2020/12/23",
		price: 700,
		href: "/orders/5452423",
	},
	{
		orderNo: "1050017AS",
		status: "Cancelled",
		purchaseDate: "2020/12/15",
		price: 300,
		href: "/orders/5452423",
	},

];

export default CustomerOrderList;
