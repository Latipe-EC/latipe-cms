import React, { useEffect, useState } from "react";
import { getDateDifference } from "../../utils/utils";
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";
import { H5, H6, Paragraph, SemiSpan } from "../Typography";
import { AppThunkDispatch, RootState, useAppSelector } from "../../store/store";
import Pagination from "../pagination/Pagination";
import { useDispatch } from "react-redux";
import { getgetRatingProduct } from "../../store/slices/ratings-slice";
import { useParams } from "react-router-dom";
import { GetRatingFilterStarEnum } from "../../api/AxiosClient";
import { Text } from "@chakra-ui/react";
export interface ProductCommentProps {
	star: number;
}

const ProductComment: React.FC<ProductCommentProps> = ({ star }) => {
	const rating = useAppSelector((state: RootState) => state.ratings);
	const { id } = useParams<{ id: string }>();
	const [currentPage, setCurrentPage] = useState(0);
	const dispatch = useDispatch<AppThunkDispatch>();

	useEffect(() => {
		dispatch(
			getgetRatingProduct({
				size: 5, skip: currentPage * 5, productId: id,
				filterStar: getStarFilter()
			})
		);
	}, [star]);

	const getStarFilter = () => {
		switch (star) {
			case 1:
				return GetRatingFilterStarEnum.One;
			case 2:
				return GetRatingFilterStarEnum.Two;
			case 3:
				return GetRatingFilterStarEnum.Three;
			case 4:
				return GetRatingFilterStarEnum.Four;
			case 5:
				return GetRatingFilterStarEnum.Five;
			default:
				return GetRatingFilterStarEnum.All;
		}
	}
	return (
		<Box m={"2"} >
			{rating.ratingProducts.length > 0 && rating.ratingProducts.map((item) =>
			(<Box mb="32px" border="1px solid black">
				<FlexBox alignItems="center" mb="1rem">
					<Avatar src={"/assets/images/faces/7.png"} />
					<Box ml="1rem">
						<H5 mb="4px">{item.userName}</H5>
						<FlexBox alignItems="center">
							<Rating value={item.rating} color="warn" readonly />
							<H6 mx="10px">{item.rating}</H6>
							<SemiSpan>{getDateDifference(item.createdDate)}</SemiSpan>
						</FlexBox>
					</Box>
				</FlexBox>
				<Paragraph ml={2} fontSize={"xxl"} color="gray.700">{item.content}</Paragraph>
			</Box>))

			}

			{rating.ratingProducts.length > 0 &&
				< FlexBox justifyContent="center" mt="2.5rem" >
					<Pagination
						pageCount={Math.ceil(rating.paginationProduct.total / 10)}
						onChange={(data) => {
							dispatch(
								getgetRatingProduct({ size: 5, skip: (+data) * 5, productId: id, filterStar: getStarFilter() })
							);
							setCurrentPage(+data);
						}}
					/>
				</FlexBox>}

			{rating.ratingProducts.length === 0 &&
				<Box height="100px" display="flex" alignItems="center" justifyContent="center">
					<Text fontSize="2xl" fontWeight="bold" textAlign="center">
						Sản phẩm chưa có đánh giá nào.
					</Text>
				</Box>
			}
		</Box >
	);
};

export default ProductComment;
