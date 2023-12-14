import { AppThunkDispatch } from '../../../store/store';
import { useDispatch } from 'react-redux';
import {
	Box, Flex, Icon,
	Input,
	Select,
	SimpleGrid, Text, useColorModeValue
} from '@chakra-ui/react';
import { MdAccountBox, MdStorage, MdStore, MdTask } from 'react-icons/md';
import MiniStatistics from '../../../components/card/MiniStatistics';
import Card from '../../../components/card/Card';
import IconBox from '../../../components/icons/IconBox';
import PieChartListProduct from '../../../components/chart/PieChartListProduct';
import Grid from '../../../components/grid/Grid';
import { useEffect, useState } from 'react';
import { countAllOrder, getOrderDaysAdmin, getProductBestSellerAdmin } from '../../../store/slices/orders-slice';
import { convertDateYYYYMMDD } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { GetOrderDaysResponse, GetProductBestSellerResponse } from 'api/interface/order';
import BarChartOrder from '../../../components/chart/LineChartOrder';
import { countAllUser } from '../../../store/slices/user-slice';
import { countAllProduct } from '../../../store/slices/products-slice';
import { countAllStore } from '../../../store/slices/stores-slice';

const HomeAdmin = () => {

	const date = new Date();
	const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	const brandColor = useColorModeValue('brand.500', 'white');

	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [responseOrder, setResponseOrder] = useState<GetOrderDaysResponse>();
	const [responseProduct, setResponseProduct] = useState<GetProductBestSellerResponse>();
	const [dateProuct, setDateProduct] = useState(firstDayOfMonth);
	const [dateOrder, setDateOrder] = useState(firstDayOfMonth);
	const [countProductFilter, setCountProductFilter] = useState(10);
	const options = [...Array(10)].map((_, i) => i + 1);

	const [countUser, setCountUser] = useState(0);
	const [countStore, setCountStore] = useState(0);
	const [countOrder, setCountOrder] = useState(0);
	const [countProduct, setCountProduct] = useState(0);

	const handleDateChange = (e) => {
		const { value } = e.target;
		setDateProduct(new Date(value));
	};

	useEffect(() => {
		dispatch(countAllOrder()).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setCountOrder(res.data.data.count);
		});

		dispatch(countAllUser()).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setCountUser(res.data);
		});

		dispatch(countAllProduct()).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setCountProduct(res.data);
		});


		dispatch(countAllStore()).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setCountStore(res.data);
		});


		dispatch(getOrderDaysAdmin(
			{ date: convertDateYYYYMMDD(dateOrder) }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setResponseOrder(res.data);
		});
		dispatch(getProductBestSellerAdmin(
			{ date: convertDateYYYYMMDD(dateProuct), count: countProductFilter }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setResponseProduct(res.data);
		});
	}, []);

	useEffect(() => {
		dispatch(getOrderDaysAdmin(
			{ date: convertDateYYYYMMDD(dateOrder) }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setResponseOrder(res.data);
		});
	}, [dateOrder]);

	useEffect(() => {
		dispatch(getProductBestSellerAdmin(
			{ date: convertDateYYYYMMDD(dateProuct), count: countProductFilter }
		)).unwrap().then(res => {
			if (res.status !== 200) {
				navigate("/401");
				return;
			}
			setResponseProduct(res.data);
		});
	}, [dateProuct, countProductFilter]);

	return (
		<Box>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }} gap='20px' mb='20px'>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg="#FFFFFF"
							icon={<Icon w='32px' h='32px' as={MdAccountBox} />}
						/>
					}
					name='Người dùng'
					value={countUser}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg="#FFFFFF"
							icon={<Icon w='32px' h='32px' as={MdStorage} color={brandColor} />}
						/>
					}
					name='Sản phẩm'
					value={countProduct}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg="#FFFFFF"
							icon={<Icon w='32px' h='32px' as={MdStore} color={brandColor} />}
						/>
					}
					name='Cửa hàng'
					value={countStore}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg="#FFFFFF"
							icon={<Icon w='32px' h='32px' as={MdTask} color={brandColor} />}
						/>
					}
					name='Đơn hàng'
					value={countOrder}
				/>
			</SimpleGrid>
			<Grid container alignItems="stretch" style={{ width: '100%', minHeight: '700px' }}>
				<Grid item lg={6} md={6} xs={12} style={{ display: 'flex' }}>
					<Card p='20px' alignItems='center' flexDirection='column' w='100%' >
						<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
							<Text color='secondaryGray.900' fontSize='22px' mb="4px" fontWeight='700' lineHeight='100%'>
								Sản phẩm bán chạy
							</Text>
							<Select width="20%" value={countProductFilter} onChange={(e) => setCountProductFilter(Number(e.target.value))}>
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
						{responseProduct && responseProduct.data.items && <PieChartListProduct data={responseProduct.data.items} />}
					</Card>
				</Grid>
				<Grid item lg={6} md={6} xs={12} style={{ display: 'flex' }}>
					<Card p='20px' alignItems='center' flexDirection='column' w='100%' >
						<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
							<Text color={'secondaryGray.900'} fontSize='22px' mb="4px" fontWeight='700' lineHeight='100%'>
								Doanh thu theo ngày
							</Text>
							<Input
								w="10%"
								type="date"
								value={dateOrder.toISOString().slice(0, 10)}
								onChange={(e) => { setDateOrder(new Date(e.target.value)) }}
							></Input>
						</Flex>
						{responseOrder && responseOrder.data.items && <BarChartOrder items={responseOrder.data.items} />}
					</Card>
				</Grid>
			</Grid>
		</Box >
	);
}

export default HomeAdmin;
