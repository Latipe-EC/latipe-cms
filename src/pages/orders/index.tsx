import CustomerDashboardLayout from "../../../src/components/layout/CustomerDashboardLayout";
import CustomerOrderList from "../../../src/components/orders/CustomerOrderList";

const Orders = () => {
  return <CustomerOrderList />;
};

Orders.layout = CustomerDashboardLayout;

export default Orders;
