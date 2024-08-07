import { ThemeProvider } from 'styled-components';
import './App.css'
import { GlobalStyles } from './utils/globalStyles';
import { AppProvider } from './contexts/app/AppContext';
import AppLayout from '@components/layout/AppLayout';
import { theme } from './utils/theme';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VendorDashboardLayout from '@components/layout/VendorDashboardLayout';
import CustomerDashboardLayout from '@components/layout/CustomerDashboardLayout';
import NavbarLayout from '@components/layout/NavbarLayout';
import { ChakraProvider } from '@chakra-ui/react';
import AddProductLayout from '@components/layout/AddProductLayout';
import { AppThunkDispatch } from './stores/store';
import { useDispatch } from 'react-redux';
import { getMyCart } from './stores/slices/carts-slice';
import { getChildsCategory } from './stores/slices/categories-slice';

// home pages
const Address = lazy(() => import('@pages/address'));
const AddressUpdater = lazy(() => import('@pages/address/[id]'));
const OrderDetails = lazy(() => import('@pages/orders/[id]'));
const Orders = lazy(() => import('@pages/orders/index'));
const AddressList = lazy(() => import('@pages/payment-methods/index'));
const PaymentMethodEditor = lazy(() => import('@pages/payment-methods/[id]'));
const ProductDetails = lazy(() => import('@pages/product/[id]'));
const ProductSearchResult = lazy(() => import('@pages/product/search/[id]'));
const ProfileEditor = lazy(() => import('@pages/profile/edit'));
const Profile = lazy(() => import('@pages/profile/index'));
const Shop = lazy(() => import('@pages/shop/[id]'));
const SupportTicketDetails = lazy(() => import('@pages/support-tickets/[id]'));
const TicketList = lazy(() => import('@pages/support-tickets/index'));
const Paypal = lazy(() => import('@pages/paypal/Paypal'));
const Notificaions = lazy(() => import('@/pages/notifications'));
const RequireRegisterVendor = lazy(() => import('@pages/require-register-vendor'));

// vendor pages
const DashboardVendor = lazy(() => import('@pages/vendor/dashboard/index'));
const AccountSettings = lazy(() => import('@pages/vendor/account-settings/index'));
const AddProduct = lazy(() => import('@pages/vendor/add-product/index'));
const OrderDetailsVendor = lazy(() => import('@pages/vendor/orders/[id]'));
const OrdersVendor = lazy(() => import('@pages/vendor/orders/index'));
const ProductDetailsVendor = lazy(() => import('@pages/vendor/products/[id]'));
const ProductsVendor = lazy(() => import('@pages/vendor/products/index'));
const BanProductsVendor = lazy(() => import('@pages/vendor/products/BanProduct'));
const RatingVendor = lazy(() => import('@pages/vendor/ratings/[id]'));
const StatisticVendor = lazy(() => import('@pages/vendor/statistic/statistic'));
const AnalyzeVendor = lazy(() => import('@pages/vendor/analyze-vendor/index'));
const BankVendor = lazy(() => import('@pages/vendor/bank/index'));
const ValidWithdraw = lazy(() => import('@pages/vendor/bank/valid_withdraw'));
const WithdrawSuccess = lazy(() => import('@pages/vendor/bank/withdraw-success'));
const RegisterStore = lazy(() => import('@pages/vendor/register'));
const VoucherVendor = lazy(() => import('@pages/vendor/voucher/[id]'));

// admin pages
const DashboardAdmin = lazy(() => import('@components/layout/admin/AdminLayout'));
const CategoriesAdmin = lazy(() => import('@pages/admin/category/AdminCategories'));
const ProductsAdmin = lazy(() => import('@pages/admin/product/AdminProduct'));
const StoresAdmin = lazy(() => import('@pages/admin/store/AdminStore'));
const UsersAdmin = lazy(() => import('@pages/admin/user/AdminUser'));
const CommissionAdmin = lazy(() => import('@pages/admin/commission/AdminCommission'));
const PaymentAdmin = lazy(() => import('@pages/admin/transactions/AdminTransaction'));
const OrdersAdmin = lazy(() => import('@pages/admin/order/AdminOrder'));
const OrderDetailAdmin = lazy(() => import('@pages/admin/order/OrderDetailAdmin'));
const StatisticAdmin = lazy(() => import('@pages/admin/statistic/AdminStatistic'));
const HomeAdmin = lazy(() => import('@pages/admin/home/AdminHome'));
const DeliveryAdmin = lazy(() => import('@pages/admin/delivery/AdminDelivery'));
const PromotionsAdmin = lazy(() => import('@pages/admin/promotion/AdminPromotion'));
const CampaignsAdmin = lazy(() => import('@pages/admin/campaigns/AdminCampaigns'));

// Delivery Page
const DeliveryPage = lazy(() => import('@pages/delivery'));
const OrderDetailDelivery = lazy(() => import('@pages/delivery/delivery-order-detail'));

const AboutPage = lazy(() => import('@pages/about'));
const Cart = lazy(() => import('@pages/cart'));
const CheckoutAlternative = lazy(() => import('@pages/checkout-alternative'));
const OrderSuccess = lazy(() => import('@pages/order-success'));
const IndexPage = lazy(() => import('@pages/index'));
const LoginPage = lazy(() => import('@pages/login'));
const CheckoutPage = lazy(() => import('@pages/payment'));
const SignUpPage = lazy(() => import('@pages/signup'));
const WishList = lazy(() => import('@pages/wish-list'));
const PaymentSuccess = lazy(() => import('@pages/payment-success'));
const SuccessForgotPassword = lazy(() => import('@pages/success-forgot-password'));
const ForgotPassword = lazy(() => import('@pages/forgot-password'));
const ResetPassword = lazy(() => import('@pages/reset-password'));
const VerifyAccount = lazy(() => import('@pages/verify-account'));
const RequestVerifyAccount = lazy(() => import('@pages/request-verify-account'));
const Promotion = lazy(() => import('@pages/promotion'));
const Error404 = lazy(() => import('@pages/404'));

function App() {

	const dispatch = useDispatch<AppThunkDispatch>();
	const user = JSON.parse(localStorage.getItem('REACT_STARTER_AUTH'));
	const allowRouteAdmin = ["/admin", "/products", "shop"]

	if (user && user.role === 'ADMIN' &&
		!allowRouteAdmin.some(route => window.location.pathname.includes(route))
	) {
		window.location.href = '/admin';
	}



	if (!window.location.pathname.includes('/admin') && !window.location.pathname.includes('/delivery'))
		dispatch(getChildsCategory(null));
	const auth = JSON.parse(localStorage.getItem('REACT_STARTER_AUTH'));
	if (auth && auth.isAuthenticated && !window.location.pathname.includes('/admin') && !window.location.pathname.includes('/delivery')) {
		dispatch(getMyCart({ skip: 0, limit: 10 }))
	}

	return (
		<ThemeProvider theme={theme}>
			<ChakraProvider>
				<GlobalStyles />
				<AppProvider>
					<Router>
						<Suspense
							fallback={
								<div className="latipe-preloader-wrapper">
									<div className="latipe-preloader">
										<span></span>
										<span></span>
									</div>
								</div>
							}
						>
							<Routes>
								{/* <AppLayout> */}
								<Route path="/" element={<AppLayout />}>
									<Route index element={<IndexPage />} />
									<Route path="about" element={<AboutPage />} />
									<Route path="checkout" element={<CheckoutAlternative />} />
									{/* <Route path="checkout" element={<Checkout />} /> */}
									<Route path="promotions" element={<Promotion />} />
									<Route path="notifications" element={<Notificaions />} />

									<Route path="login" element={<LoginPage />} />
									<Route path="payment" element={<CheckoutPage />} />
									{/* <Route path="shops" element={<ShopList />} /> */}
									<Route path="signup" element={<SignUpPage />} />
									<Route path="orders/success" element={<OrderSuccess />} />
									<Route path="require-register-vendor" element={<RequireRegisterVendor />} />
									<Route path="payment-success" element={<PaymentSuccess />} />
									<Route path="valid-withdraw" element={<ValidWithdraw />} />
									<Route path="withdraw-success/:token" element={<WithdrawSuccess />} />
									<Route path="success-forgot-password" element={<SuccessForgotPassword />} />
									<Route path="forgot-password" element={<ForgotPassword />} />
									<Route path="auth/reset-password/:token" element={<ResetPassword />} />
									<Route path="auth/verify-account/:token" element={<VerifyAccount />} />
									<Route path="auth/verify-account" element={<RequestVerifyAccount />} />
									<Route path="*" element={<Error404 />} />
								</Route>
								<Route path="/register-store" element={<RegisterStore />} />
								{/* Navbar */}
								<Route path="/" element={
									<NavbarLayout />
								}>
									<Route path="products/:id" element={<ProductDetails />} />
									<Route path="search" element={<ProductSearchResult />} />
									<Route path="shop/:id" element={<Shop />} />
								</Route>
								<Route path="/cart" element={<Cart />} />

								{/* Support Ticket */}
								<Route path="/support-tickets/" element={
									<CustomerDashboardLayout />
								}>
									<Route path=":id" element={<SupportTicketDetails />} />
									<Route path="" element={<TicketList />} />
								</Route>


								{/* Profile */}
								<Route path="/profile/" element={<CustomerDashboardLayout />}>
									<Route index element={<Profile />} />
									<Route path="edit" element={<ProfileEditor />} />
								</Route>

								<Route path="/" element={
									<CustomerDashboardLayout />
								}>
									<Route path="address" element={<Address />} />
									<Route path="address/:id" element={<AddressUpdater />} />
									<Route path="orders" element={<Orders />} />
									<Route path="orders/:id" element={<OrderDetails />} />
									<Route path="payment-paypal" element={<Paypal />} />
									<Route path="payment-methods" element={<AddressList />} />
									<Route path="payment-methods/add" element={<PaymentMethodEditor />} />
									<Route path="wish-list" element={<WishList />} />

								</Route>

								{/* Vendor */}
								<Route path="/vendor/" element={
									<VendorDashboardLayout />
								}>
									<Route path="dashboard" element={
										<DashboardVendor />
									}
									/>
									<Route path="" element={<OrdersVendor />} />
									<Route path="profile" element={<AccountSettings />} />
									<Route path="orders/:id" element={<OrderDetailsVendor />} />
									<Route path="orders" element={<OrdersVendor />} />
									<Route path="ratings" element={<RatingVendor />} />
									<Route path="revenues" element={<StatisticVendor />} />
									<Route path="products" element={<ProductsVendor />} />
									<Route path="analysis" element={<AnalyzeVendor />} />
									<Route path="bank" element={<BankVendor />} />
									<Route path="products/ban" element={<BanProductsVendor />} />
									<Route path="vouchers" element={<VoucherVendor />} />
								</Route>

								<Route path="/vendor/" element={
									<AddProductLayout />
								}>
									<Route path="/vendor/products/:id" element={<ProductDetailsVendor />} />
									<Route path="/vendor/products/add" element={<AddProduct />} />
								</Route>
								{/* Admin */}
								<Route path="/admin/" element={<DashboardAdmin />}>
									<Route path="" element={<HomeAdmin />} />
									<Route path="home" element={<HomeAdmin />} />
									<Route path="categories" element={<CategoriesAdmin />} />
									<Route path="products" element={<ProductsAdmin />} />
									<Route path="stores" element={<StoresAdmin />} />
									<Route path="users" element={<UsersAdmin />} />
									<Route path="commissions" element={<CommissionAdmin />} />
									<Route path="transactions" element={<PaymentAdmin />} />
									<Route path="orders" element={<OrdersAdmin />} />
									<Route path="orders/:id" element={<OrderDetailAdmin />} />
									<Route path="statistics" element={<StatisticAdmin />} />
									<Route path="deliveries" element={<DeliveryAdmin />} />
									<Route path="promotions" element={<PromotionsAdmin />} />
									<Route path="campaigns" element={<CampaignsAdmin />} />
								</Route>

								<Route path="/delivery" element={<DeliveryPage />} />
								<Route path="/delivery/orders/:id" element={<OrderDetailDelivery />} />
							</Routes>
						</Suspense>
					</Router>
				</AppProvider>
			</ChakraProvider>
		</ThemeProvider>
	)
}

export default App
