import Button from "@components/buttons/Button";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import VoucherList from "@/pages/vendor/voucher/VoucherList";

const RatingVendor = () => {
	return (
		<div>
			<DashboardPageHeader
				title="Khuyến mãi cửa hàng"
				iconName="bag_filled"
				button={
					<a href="/vendor">
						<Button color="primary" bg="primary.light" px="2rem">
							Quay lại
						</Button>
					</a>
				}
			/>
			<VoucherList />
		</div>
	);
};


export default RatingVendor;
