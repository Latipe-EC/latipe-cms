import React from "react";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";
import TextArea from "../textarea/TextArea";
import { H2, H5 } from "../Typography";
import ProductComment from "./ProductComment";
import { useFormik } from "formik";
import * as yup from "yup";

export interface ProductReviewProps { }

const ProductReview: React.FC<ProductReviewProps> = () => {



	return (
		<Box>
			{commentList.map((item, ind) => (
				<ProductComment {...item} key={ind} />
			))}
		</Box>
	);
};

const commentList = [
	{
		name: "Jannie Schumm",
		imgUrl: "/assets/images/faces/7.png",
		rating: 4.7,
		date: "2021-02-14",
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
	},
	{
		name: "Joe Kenan",
		imgUrl: "/assets/images/faces/6.png",
		rating: 4.7,
		date: "2019-08-10",
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
	},
	{
		name: "Jenifer Tulio",
		imgUrl: "/assets/images/faces/8.png",
		rating: 4.7,
		date: "2021-02-05",
		comment:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
	},
];

const initialValues = {
	rating: "",
	comment: "",
	date: new Date().toISOString(),
};

const reviewSchema = yup.object().shape({
	rating: yup.number().required("required"),
	comment: yup.string().required("required"),
});

export default ProductReview;
