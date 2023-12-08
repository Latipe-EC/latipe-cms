import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import VendorDashboardLayout from "../../../components/layout/VendorDashboardLayout";
import VendorOrderList from "../../../components/orders/VendorOrderList";

const Orders = () => {
	return (
		<div>
			<DashboardPageHeader title="Đơn hàng của shop" iconName="bag_filled" />
			<VendorOrderList />
		</div>
	);
};

Orders.layout = VendorDashboardLayout;

export default Orders;
