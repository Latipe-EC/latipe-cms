import React, { useEffect, useState } from "react";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import ProductCard1 from "../product-cards/ProductCard1";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { searchProduct } from "@stores/slices/search-slice";

const Section11: React.FC = () => {
	const [resultList, setResultList] = useState([]);

	const dispatch = useDispatch<AppThunkDispatch>();

	useEffect(() => {
		dispatch(searchProduct({
			sortType: "COUNT_SALE_DESC",
			page: 0,
			size: 12
		})).unwrap().then((res) => {
			setResultList(res.data.products);
			return;
		});
	}, []);


	return (
		<Container mb="70px">
			<CategorySectionHeader title="Dành cho bạn" seeMoreLink="/search" />
			<Grid container spacing={6}>
				{resultList.map((item, ind) => (
					<Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
						<ProductCard1 price={23} off={25} hoverEffect {...item} />
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default Section11;
