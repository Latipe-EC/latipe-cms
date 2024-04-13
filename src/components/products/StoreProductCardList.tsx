import React from "react";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Pagination from "../pagination/Pagination";
import ProductCard1 from "../product-cards/ProductCard1";
import { SemiSpan } from "../Typography";
import { Box, Text } from "@chakra-ui/react";
import { ProductStoreResponse } from "@interfaces/store";
import { PagedResultResponse } from "@interfaces/PagedResultResponse";
import { Content } from "@/utils/constants";

export interface StoreProductListCardProps {
	data?: PagedResultResponse<ProductStoreResponse>;
	onChange?: (data: number) => void;
}

const StoreProductListCard: React.FC<StoreProductListCardProps> = ({ data, onChange }) => {
	return (
		<div>
			{data.data.length === 0 ? (
				<Box>
					<Text fontSize="xl" fontWeight="bold" textAlign="center" my={5}>
						{Content.PRODUCT_NOT_FOUND}
					</Text>
				</Box>
			) :
				(
					<Box width={'100%'}>
						<Grid container spacing={12}>
							{data.data.map((item, ind) => (
								<Grid item lg={4} sm={6} xs={12} key={ind}>
									<ProductCard1 id={item.id}
										images={[item.image]}
										name={item.name}
										price={item.price}
										ratings={item.rating}
									/>
								</Grid>
							))}
						</Grid>

						<FlexBox
							flexWrap="wrap"
							justifyContent="space-between"
							alignItems="center"
							mt="32px"
						>
							<SemiSpan>
								Đang
								xem {`${data.pagination.limit * data.pagination.skip + 1} - ${data.pagination.skip * data.pagination.limit + data.data.length}`} sản
								phẩm</SemiSpan>
							<Pagination pageCount={Math.ceil(data.pagination.total / 12)}
								onChange={onChange} />
						</FlexBox>
					</Box>
				)
			}

		</div>
	);
};

export default StoreProductListCard;
