import { useNavigate } from "react-router-dom";
import Button from "../../../components/buttons/Button";
import DashboardPageHeader from "../../../components/layout/DashboardPageHeader";
import ProductReview from "../../../components/products/ProductReview";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../../store/store";
import { getMyStore } from "../../../store/slices/stores-slice";
import { useEffect, useState } from "react";
import { GetMyStoreResponse } from "../../../api/interface/store";

const RatingVendor = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [store, setStore] = useState<GetMyStoreResponse>();
	const [selectedStar, setSelectedStar] = useState(0);

	useEffect(() => {
		dispatch(getMyStore()).unwrap().then(
			(res) => {
				if (res.status !== 200) {
					navigate("/401");
					return;
				}
				setStore(res.data);
			}
		);
	}, []);

	return (
		<div>
			<DashboardPageHeader
				title="Đánh giá cửa hàng"
				iconName="bag_filled"
				button={
					<a href="/vendor/orders">
						<Button color="primary" bg="primary.light" px="2rem">
							Quay lại
						</Button>
					</a>
				}
			/>
			{store && <ProductReview
				selectedStar={selectedStar}
				setSelectedStar={setSelectedStar}
				rating={store.ratings}
				isStore={true}
				storeId={store.id}
			/>}
		</div>
	);
};


export default RatingVendor;
