import { Fragment, useEffect, useState } from 'react';
import {
	Input,
	InputGroup,
	InputLeftElement,
	Tab,
	TabIndicator,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text
} from "@chakra-ui/react";
import { AppThunkDispatch } from '@stores/store';
import { useDispatch } from 'react-redux';
import { searchOrderAdmin } from '@stores/slices/orders-slice';
import { searchStoreOrderResponse } from '@interfaces/order';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBox from '@components/FlexBox';
import Pagination from '@components/pagination/Pagination';
import { SearchIcon } from "@chakra-ui/icons";
import { debounce } from 'lodash';
import OrderRowAdmin from '@components/orders/OrderRowAdmin';
import { getParamStatusOrder } from '@/utils/utils';

const OrdersAdmin = () => {

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
		const paramFilter = getParamStatusOrder(indexTab);

		dispatch(searchOrderAdmin({
			"size": "7",
			"page": currentPage,
			"filters[order_id][$search]": search,
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

				<InputGroup mt={2} ml={4} w={"40%"} mb={4}>
					<InputLeftElement
						pointerEvents="none"
						children={<SearchIcon color="gray.300" />}
					/>
					<Input type="search" placeholder="Search"
						maxLength={30}
						value={search}
						onChange={(e) => {
							setSearch(e.target.value)
						}} />
				</InputGroup>

				<Tabs onChange={(index) => setTabIndex(index)}
					position="relative" variant="unstyled">
					<TabList display="flex">
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
									<OrderRowAdmin order={item} key={ind} />
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
				<FlexBox justifyContent="center">
					<Pagination
						pageCount={Math.ceil(orderList.data.total)}
						onChange={(data) => {
							setCurrentPage((data + 1).toString());
						}}
					/>
				</FlexBox>}

		</Fragment>
	);
}

export default OrdersAdmin;
