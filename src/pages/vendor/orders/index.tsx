import { LoginResponse } from "@/api/interface/auth";
import { LoadingOverlay } from "@/components/loading/LoadingOverlay";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import VendorDashboardLayout from "@components/layout/VendorDashboardLayout";
import VendorOrderList from "@components/orders/VendorOrderList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	useEffect(() => {

		const REACT_STARTER_AUTH: LoginResponse = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));
		if (!REACT_STARTER_AUTH) {
			navigate("/login");
			return;
		}
		if (REACT_STARTER_AUTH.role !== "VENDOR") {
			navigate("/require-register-vendor");
			return;
		}
		setLoading(false);
		return () => {
		};
	}, []);

	return (
		<div>
			{loading ? <LoadingOverlay isLoading={loading} /> : <>
				<DashboardPageHeader title="Đơn hàng của shop" iconName="bag_filled" />
				<VendorOrderList />
			</>}
		</div>
	);
};

Orders.layout = VendorDashboardLayout;

export default Orders;
