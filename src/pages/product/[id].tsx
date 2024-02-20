import { useNavigate, useParams } from "react-router-dom";
import Box from "@components/Box";
import NavbarLayout from "@components/layout/NavbarLayout";
import ProductDescription from "@components/products/ProductDescription";
import ProductIntro from "@components/products/ProductIntro";
import ProductReview from "@components/products/ProductReview";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { getProductById } from "@stores/slices/products-slice";

const ProductDetails = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [selectedStar, setSelectedStar] = useState(0);

	const [product, setProduct] = useState(null);

	useEffect(() => {
		if (id) {
			dispatch(getProductById(id)).unwrap().then((res) => {
				if (res.status.toString().startsWith('2')) {
					const product = res.data;
					setProduct(product);
				} else {
					navigate('/404');
				}
			});
		}
	}, []);


	return (
		<Box>
			<Box bg="white">
				{product && <ProductIntro product={product} />}
			</Box>
			<Box bg="white">
				<Box mb="0.5rem">
					{product && <ProductDescription
						description={product.description}
						attributes={product.detailsProduct}
						categories={product.categories}
					/>}
				</Box>
				{/* <FrequentlyBought /> */}
			</Box>
			{product && <ProductReview
				selectedStar={selectedStar}
				setSelectedStar={setSelectedStar}
				rating={product.ratings}
			/>}


		</Box>
	);
};

ProductDetails.layout = NavbarLayout;

export default ProductDetails;
