import React from "react";
import Box from "../Box";
import Button from "../buttons/Button";
import { H2 } from "../Typography";
import ProductComment from "./ProductComment";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export interface ProductReviewProps {
	rating: Array<number>;
	setSelectedStar: (star: number) => void;
	selectedStar: number;
}

const ProductReview: React.FC<ProductReviewProps> = ({ rating, selectedStar, setSelectedStar }) => {

	// {ratting.reduce((a, b) => a + b, 0)} / 5


	const averageStar = rating ? rating.reduce((a, b) => a + b, 0) / rating.length : 0;
	const fullStars = Math.floor(averageStar);
	const hasHalfStar = averageStar - fullStars >= 0.5;

	const formatNumber = (number: number): string => {
		if (number > 1000) {
			return (number / 1000).toFixed(1) + "k";
		} else {
			return number.toString();
		}
	};
	return (
		<Box p={2}>
			<H2 fontWeight={"bold"} mb="1rem">Đánh giá sản phẩm</H2>
			<Flex alignItems="center" mb="1rem">
				{Array.from({ length: 5 }).map((_, index) => {
					if (index < fullStars) {
						return <Icon key={index} as={FaStar} color="yellow.500" mr="0.5rem" />;
					} else if (hasHalfStar && index === fullStars) {
						return <Icon key={index} as={FaStarHalfAlt} color="yellow.500" mr="0.5rem" />;
					} else {
						return <Icon key={index} as={FaStar} color="gray.300" mr="0.5rem" />;
					}
				})}
				<Text fontSize="2xl" fontWeight="bold" mr="1rem">
					{averageStar.toFixed(1)} trên 5
				</Text>
			</Flex>
			<Box display="flex" alignItems="center">
				<Button
					variant="outline"
					mr="1rem"
					border="2px solid"
					borderColor={selectedStar === null ? "orange.500" : "gray.300"}
					color={selectedStar === null ? "red" : "black"}
					onClick={() => setSelectedStar(null)}
				>
					Tất cả
				</Button>
				{[5, 4, 3, 2, 1].map((star) => (
					<Button
						key={star}
						variant="outline"
						mr="1rem"
						border="2px solid"
						borderColor={selectedStar === star ? "orange.500" : "gray.300"}
						color={selectedStar === star ? "red" : "black"}
						onClick={() => setSelectedStar(star)}
					>
						{star} sao ({formatNumber(rating[star - 1])})
					</Button>
				))}
			</Box>
			<ProductComment star={selectedStar} />
		</Box>
	);
};

export default ProductReview;