import { Icon } from '@chakra-ui/react';
import CategoriesAdmin from '../../../pages/admin/category/AdminCategories';
import { MdCategory, MdHome, MdPayment, MdPerson, MdProductionQuantityLimits, MdReport, MdStarRate, MdStore } from 'react-icons/md';

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
		name: 'Products',
		layout: '/admin',
		path: '/products',
		icon: <Icon as={MdProductionQuantityLimits} width='20px' height='20px' color='inherit' />,
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
		path: '/admin/statistics',
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