import { Icon } from '@chakra-ui/react';
import CategoriesAdmin from '../../../pages/admin/category/AdminCategories';
import {
	MdCategory,
	MdDeliveryDining,
	MdHome,
	MdMoney,
	MdPayment,
	MdPerson,
	MdProductionQuantityLimits,
	MdReport,
	MdStarRate,
	MdStore
} from 'react-icons/md';
import { IoMdCart } from 'react-icons/io';
import { IoGift } from 'react-icons/io5';

const routes = [
	{
		name: 'Home',
		layout: '/admin',
		path: '/home',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Users',
		layout: '/admin',
		path: '/users',
		icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
		component: '',
		secondary: true
	},
	{
		name: 'Categories',
		layout: '/admin',
		icon: <Icon as={MdCategory} width='20px' height='20px' color='inherit' />,
		path: '/categories',
		component: <CategoriesAdmin />
	},
	{
		name: 'Store',
		layout: '/admin',
		path: '/stores',
		icon: <Icon as={MdStore} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Commissions',
		layout: '/admin',
		path: '/commissions',
		icon: <Icon as={MdMoney} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Products',
		layout: '/admin',
		path: '/products',
		icon: <Icon as={MdProductionQuantityLimits} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Delivery',
		layout: '/admin',
		path: '/deliveries',
		icon: <Icon as={MdDeliveryDining} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Orders',
		layout: '/admin',
		path: '/orders',
		icon: <Icon as={IoMdCart} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Promotions',
		layout: '/admin',
		path: '/promotions',
		icon: <Icon as={IoGift} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Transactions',
		layout: '/admin',
		path: '/transactions',
		icon: <Icon as={MdPayment} width='20px' height='20px' color='inherit' />,
		component: ''
	},
	{
		name: 'Statistics',
		layout: '/admin',
		path: '/statistics',
		icon: <Icon as={MdStarRate} width='20px' height='20px' color='inherit' />,
		component: ''
	}
	,
	{
		name: 'Ticket',
		layout: '/admin',
		path: '/ticket',
		icon: <Icon as={MdReport} width='20px' height='20px' color='inherit' />,
		component: ''
	}

];

export default routes;