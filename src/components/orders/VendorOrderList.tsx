import React, { Fragment, useEffect, useState } from 'react';
import { Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { AppThunkDispatch } from 'store/store';
import { useDispatch } from 'react-redux';
import { searchStoreOrder } from '../../store/slices/orders-slice';
import { searchStoreOrderResponse } from 'api/interface/order';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBox from '../../components/FlexBox';
import Pagination from '../../components/pagination/Pagination';
import OrderRowVendor from '../../components/orders/OrderRowVendor';
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { debounce } from 'lodash';

export interface VendorOrderListProps { }

const VendorOrderList: React.FC<VendorOrderListProps> = () => {

	const dispatch = useDispatch<AppThunkDispatch>();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const navigate = useNavigate();

	const [indexTab, setTabIndex] = useState(0);
	const [orderList, setOrderList] = useState<searchStoreOrderResponse>();
	const [currentPage, setCurrentPage] = useState(params.get('page') ? params.get('page') : "1");
	const filter = params.get('filter');
	const [search, setSearch] = useState("");

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

	const handleSearch = () => {

		if (currentPage !== "1")
			setCurrentPage("1");
		else {
			handleGetListOrder();
		}
	}

	const debouncedHandleGetListOrder = debounce(handleSearch, 500);

	useEffect(() => {
		if (search) {
			debouncedHandleGetListOrder();
		} else {
			handleGetListOrder();
		}
	}, [search]);

	const handleGetListOrder = () => {
		const paramFilter = {}
		switch (indexTab) {
			case 1:
				paramFilter["filters[status][$eq]"] = 1;
				break;
			case 2:
				paramFilter["filters[status][$eq]"] = 2;
				break;
			case 3:
				paramFilter["filters[status][$eq]"] = 3;
				break;
			case 4:
				paramFilter["filters[status][$in][0]"] = 4;
				paramFilter["filters[status][$in][1]"] = 5;
				break;
			case 5:
				paramFilter["filters[status][$in][0]"] = 7;
				paramFilter["filters[status][$in][1]"] = -1;
				break;
			case 6:
				paramFilter["filters[status][$eq]"] = 6;
				break;
		}
		dispatch(searchStoreOrder({
			"size": "5",
			"page": currentPage,
			"keyword": search,
			...paramFilter
		})).unwrap().then((res) => {
			setOrderList(res.data);
		}).catch(() => {
			navigate("/502")
		});
	}

	return (
		<Fragment>
			<FlexBox flexDirection="column" justifyContent="flex-start" mb={0}>
				<InputGroup mt={2} ml={4} w={"40%"}>
					<InputLeftElement
						pointerEvents="none"
						children={<SearchIcon color="gray.300" />}
					/>
					<Input type="search" placeholder="Search"
						maxLength={30}
						value={search}
						onChange={(e) => {
							console.log(e.target.value);
							setSearch(e.target.value)
						}} />
				</InputGroup>
				<Tabs onChange={(index) => setTabIndex(index)}
					position="relative" variant="unstyled">
					<TabList display="flex" >
						<Tab flex="1">Tất cả</Tab>
						<Tab flex="1">Chờ xác nhận</Tab>
						<Tab flex="1">Đã xác nhận</Tab>
						<Tab flex="1">Chờ giao hàng</Tab>
						<Tab flex="1">Hoàn thành</Tab>
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
						{Array.from({ length: 7 }).map((_, index) => (
							<TabPanel key={`tab-index${index}`}>
								{orderList && orderList.data.items.map((item, ind) => (
									<OrderRowVendor order={item} key={ind} />
								))}
							</TabPanel>
						))}

					</TabPanels>
				</Tabs>
				{orderList && orderList.data.items.length === 0 &&
					<FlexBox justifyContent="center" alignItems="center"
						mt="2.5rem" height={"xl"}>
						<Text
							fontSize="x-large"
							textAlign="center"
							fontWeight="bold"
						>Không có đơn hàng nào</Text>
					</FlexBox>
				}
			</FlexBox>
			{orderList && orderList.data.items.length > 0 &&
				<FlexBox justifyContent="center" >
					<Pagination
						pageCount={Math.ceil(orderList.data.total)}
						onChange={(data) => {
							setCurrentPage((data + 1).toString());
						}}
					/>
				</FlexBox>}

		</Fragment>
	);
};

export default VendorOrderList;
