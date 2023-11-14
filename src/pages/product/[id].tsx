import { useNavigate, useParams } from "react-router-dom";
import Box from "../../../src/components/Box";
import FlexBox from "../../../src/components/FlexBox";
import NavbarLayout from "../../../src/components/layout/NavbarLayout";
import AvailableShops from "../../../src/components/products/AvailableShops";
import ProductDescription from "../../../src/components/products/ProductDescription";
import ProductIntro from "../../../src/components/products/ProductIntro";
import ProductReview from "../../../src/components/products/ProductReview";
import RelatedProducts from "../../../src/components/products/RelatedProducts";
import { H5 } from "../../../src/components/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "store/store";
import { getProductById } from "../../store/slices/products-slice";

const ProductDetails = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	const [product, setProduct] = useState(null);

	useEffect(() => {
		if (id) {
			dispatch(getProductById(id)).unwrap().then((res) => {
				if (res.status.toString().startsWith('2')) {
					const product = res.data;
					setProduct(product);
				}
				else {
					navigate('/404');
				}
			});
		}
	}, []);


	return (
		<Box bg={"gray.200"}>
			<Box bg="white">
				{product && <ProductIntro product={product} />}
			</Box>
			<Box bg="white">
				<Box mb="50px">
					{product && <ProductDescription
						description={product.description}
						attributes={product.detailsProduct}
						categories={product.categories}
					/>}
				</Box>
				{/* <FrequentlyBought /> */}
			</Box>
			{product && <ProductReview />}


		</Box>
	);
};

ProductDetails.layout = NavbarLayout;

export default ProductDetails;
