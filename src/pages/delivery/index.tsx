// Chakra imports
// Layout components
import {
	Box,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Tab,
	TabIndicator,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useMediaQuery
} from '@chakra-ui/react';
import { AppThunkDispatch } from '@stores/store';
import { useDispatch } from 'react-redux';
import { searchOrderDelivery } from '../../stores/slices/orders-slice';
import { searchStoreOrderResponse } from '@interfaces/order';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import FlexBox from '@components/FlexBox';
import Pagination from '@components/pagination/Pagination';
import { SearchIcon } from "@chakra-ui/icons";
import { debounce } from 'lodash';

import OrderRowDelivery from '@components/orders/OrderRowDelivery';
import { useEffect, useState } from 'react';
import DashboardPageHeader from '@components/layout/DashboardPageHeader';
import { getParamStatusOrder } from '@/utils/utils';
import { MdCancel, MdCheckCircle, MdDoneAll, MdList, MdLocalShipping, MdMoneyOff, MdPendingActions } from 'react-icons/md';
import { LoadingOverlay } from '@/components/loading/LoadingOverlay';

export default function DeliveryPage() {
	const user = JSON.parse(localStorage.getItem('REACT_STARTER_AUTH'));

	const dispatch = useDispatch<AppThunkDispatch>();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const navigate = useNavigate();
	const [indexTab, setTabIndex] = useState(0);
	const [orderList, setOrderList] = useState<searchStoreOrderResponse>();
	const [currentPage, setCurrentPage] = useState(params.get('page') ? params.get('page') : "1");
	const filter = params.get('filter');
	const [search, setSearch] = useState("");
	const [isMobile] = useMediaQuery('(max-width: 768px)');
	const [loading, setLoading] = useState(false);

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
		setLoading(true);

		dispatch(searchOrderDelivery({
			"size": "7",
			"page": currentPage,
			"keyword": search,
			...paramFilter
		})).unwrap().then((res) => {
			setOrderList(res.data);
		}).catch(() => {
			navigate("/502")
		}).finally(() => {
			setLoading(false);
		});
	}

	if (!user || user.role !== 'DELIVERY') {
		localStorage.clear();
		return <Navigate to="/login" state={{ from: location }} />;
	}

	document.documentElement.dir = 'ltr';
	return (
		<Box
			px={8}
			py={4}
		>
			<DashboardPageHeader title="Trang chủ đơn vị vận chuyển" iconName="bag_filled" />
			<Box
			>
				<FlexBox flexDirection="column" justifyContent="flex-start" mb={0} height="80vh">

					<InputGroup mt={2} ml={4} w={"40%"} mb={4}>
						<InputLeftElement
							pointerEvents="none"
							children={<SearchIcon color="gray.300" />}
						/>
						<Input type="search" placeholder="Tìm kiếm"
							maxLength={30}
							value={search}
							onChange={(e) => {
								setSearch(e.target.value)
							}} />
					</InputGroup>

					<Tabs onChange={(index) => setTabIndex(index)}
						position="relative" variant="unstyled">
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
										<OrderRowDelivery order={item} key={ind} />
									))}
								</TabPanel>
							))}

						</TabPanels>
					</Tabs>

					{loading && <LoadingOverlay isLoading={loading} />}

					{!loading && orderList && orderList.data.items.length === 0 &&
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
				{!loading && orderList && orderList.data.items.length > 0 &&
					<FlexBox justifyContent="center" mt="auto">
						<Pagination
							pageCount={Math.ceil(orderList.data.total)}
							onChange={(data) => {
								setCurrentPage((data + 1).toString());
							}}
						/>
					</FlexBox>}

			</Box>
		</Box>
	);
}
