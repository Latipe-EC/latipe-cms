import Card from "../Card";
import React, { useEffect, useState } from "react";
import CategorySectionCreator from "../CategorySectionCreator";
import Grid from "../grid/Grid";
import ProductCard2 from "../product-cards/ProductCard2";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { searchProduct } from "@stores/slices/search-slice";

const Section5: React.FC = () => {
	const [resultList, setResultList] = useState([]);

	const dispatch = useDispatch<AppThunkDispatch>();

	useEffect(() => {
		dispatch(searchProduct({
			sortType: "COUNT_SALE_DESC",
			page: 0,
			size: 5
		})).unwrap().then((res) => {
			return setResultList(res.data.products);
		});
		return () => {
			resultList
		};
	}, []);


	return (
		<CategorySectionCreator
			iconName="new-product-1"
			title="Sản phẩm mới"
			seeMoreLink="/search?sortType=DEFAULT"
		>
			<Card p="1rem">
				<Grid container spacing={6}>
					{resultList && resultList.map((item) => (
						<Grid item lg={3} md={3} sm={6} xs={6} key={item.id}>
							<ProductCard2 {...item} />
						</Grid>
					))}
				</Grid>
			</Card>
		</CategorySectionCreator>
	);
};


export default Section5;
