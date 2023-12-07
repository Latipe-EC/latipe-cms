import { useDispatch } from "react-redux";
import FlexBox from "../../../src/components/FlexBox";
import Grid from "../../../src/components/grid/Grid";
import Hidden from "../../../src/components/hidden/Hidden";
import Icon from "../../../src/components/icon/Icon";
import NavbarLayout from "../../../src/components/layout/NavbarLayout";
import ProductFilterCard from "../../../src/components/products/ProductFilterCard";
import ShopIntroCard from "../../../src/components/shop/ShopIntroCard";
import Sidenav from "../../../src/components/sidenav/Sidenav";
import useWindowSize from "../../hooks/useWindowSize";
import { AppThunkDispatch } from "store/store";
import { useEffect, useState } from "react";
import { getProductStore, getStoreById } from "../../store/slices/stores-slice";
import { PagedResultResponse } from "../../api/interface/PagedResultResponse";
import { ProductStoreResponse, StoreResponse } from "../../api/interface/store";
import StoreProductListCard from "../../components/products/StoreProductCardList";
import { useParams } from "react-router-dom";

const Shop = () => {
	const size = useWindowSize();
	const isTablet = size.width < 1025;

	const dispatch = useDispatch<AppThunkDispatch>();
	const [result, setResult] = useState<PagedResultResponse<ProductStoreResponse>>();
	const [currentPage, setCurrentPage] = useState(0);
	const [profileStore, setProfileStore] = useState<StoreResponse>(null);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		dispatch(getProductStore(
			{
				id,
				params: {
					page: currentPage,
					size: 12,
				}
			})).unwrap().then((res) => {
				if (res.status.toString().startsWith('2')) {
					setResult(res.data);
					return;
				}

			});
		dispatch(getStoreById(id)).unwrap().then((res) => {
			if (res.status.toString().startsWith('2')) {
				setProfileStore(res.data);
				return;
			}

		});
	}, []);

	const handlePageChange = (data: number) => {
		setCurrentPage(data);
	};

	return (
		<div>
			{profileStore && <ShopIntroCard store={profileStore} />}
			<Grid container spacing={6}>
				<Grid item md={9} xs={12}>
					{result && <StoreProductListCard
						data={result}
						onChange={handlePageChange}
					/>}
				</Grid>
			</Grid>
		</div>
	);
};

Shop.layout = NavbarLayout;

export default Shop;
