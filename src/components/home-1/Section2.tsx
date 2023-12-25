import Box from "../Box";
import React, { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Carousel from "../carousel/Carousel";
import CategorySectionCreator from "../CategorySectionCreator";
import ProductCard1 from "../product-cards/ProductCard1";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "../../store/store";
import { searchProduct } from "../../store/slices/search-slice";

const Section2: React.FC = () => {
	const [visibleSlides, setVisibleSlides] = useState(4);
	const [resultList, setResultList] = useState([]);

	const { width } = useWindowSize();
	const dispatch = useDispatch<AppThunkDispatch>();

	useEffect(() => {
		if (width && typeof width === 'number') {
			if (width < 500) setVisibleSlides(1);
			else if (width < 650) setVisibleSlides(2);
			else if (width < 950) setVisibleSlides(3);
			else setVisibleSlides(4);
		}
	}, [width]);

	useEffect(() => {
		dispatch(searchProduct({
			sortType: "COUNT_SALE_DESC",
			page: 0,
			size: 5
		})).unwrap().then((res) => {
			setResultList(res.data.products);
			return;
		});
	}, []);
	return (
		<CategorySectionCreator
			iconName="light"
			title="Ưu đãi chớp nhoáng
					"
			seeMoreLink="/search?sortType=COUNT_SALE_DESC"
		>
			<Box mt="-0.25rem" mb="-0.25rem">
				<Carousel totalSlides={10} visibleSlides={visibleSlides}>
					{resultList.length > 0 && resultList.map((item, ind) => (
						<Box py="0.25rem" key={ind}
							height="100%"
						>
							<ProductCard1
								id={item.id}
								images={item.images}
								name={item.name}
								ratings={item.ratings}
								price={250}
								// off={56}
								key={ind}
							/>
						</Box>
					))}
				</Carousel>
			</Box>
		</CategorySectionCreator>
	);
};

export default Section2;
