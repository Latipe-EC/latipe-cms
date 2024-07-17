import { Icon } from '@chakra-ui/react';
import CategoriesAdmin from '../../../pages/admin/category/AdminCategories';
import {
	MdCampaign,
	MdCategory,
	MdDeliveryDining,
	MdHome,
	MdMoney,
	MdPayment,
	MdPerson,
	MdProductionQuantityLimits,
	MdSettings,
	MdStarRate,
	MdStore
} from 'react-icons/md';
import { IoMdCart } from 'react-icons/io';
import { IoGift } from 'react-icons/io5';

const routes = [
	{
		name: 'Trang chủ',
		layout: '/admin',
		path: '/home',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Người dùng',
		layout: '/admin',
		path: '/users',
		icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
		component: '',
		secondary: true
	},
	{
		name: 'Danh mục',
		layout: '/admin',
		icon: <Icon as={MdCategory} width='20px' height='20px' color='inherit' />,
		path: '/categories',
		component: <CategoriesAdmin />
	},
	{
		name: 'Cửa hàng',
		layout: '/admin',
		path: '/stores',
		icon: <Icon as={MdStore} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Hoa hồng',
		layout: '/admin',
		path: '/commissions',
		icon: <Icon as={MdMoney} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Sản phẩm',
		layout: '/admin',
		path: '/products',
		icon: <Icon as={MdProductionQuantityLimits} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Vận chuyển',
		layout: '/admin',
		path: '/deliveries',
		icon: <Icon as={MdDeliveryDining} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Đơn hàng',
		layout: '/admin',
		path: '/orders',
		icon: <Icon as={IoMdCart} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Voucher',
		layout: '/admin',
		path: '/promotions',
		icon: <Icon as={IoGift} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Giao dịch',
		layout: '/admin',
		path: '/transactions',
		icon: <Icon as={MdPayment} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Thống kê',
		layout: '/admin',
		path: '/statistics',
		icon: <Icon as={MdStarRate} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Chiến dịch',
		layout: '/admin',
		path: '/campaigns',
		icon: <Icon as={MdCampaign} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Cấu hình',
		layout: '/admin',
		path: '/campaigns',
		icon: <Icon as={MdSettings} width='20px' height='20px' color='inherit' />,
		component: ''
	}
	,
	// {
	// 	name: 'Ticket',
	// 	layout: '/admin',
	// 	path: '/ticket',
	// 	icon: <Icon as={MdReport} width='20px' height='20px' color='inherit' />,
	// 	component: ''
	// }

];

export default routes;