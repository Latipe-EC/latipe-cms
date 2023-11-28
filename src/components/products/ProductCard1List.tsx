import React from "react";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Pagination from "../pagination/Pagination";
import ProductCard1 from "../product-cards/ProductCard1";
import { SemiSpan } from "../Typography";
import { ProductListGetVm } from "../../api/interface/search";
import { Box, Text } from "@chakra-ui/react";

export interface ProductCard1ListProps {
	data?: ProductListGetVm;
	onChange?: (data: { selected: number }) => void;
}

const ProductCard1List: React.FC<ProductCard1ListProps> = ({ data, onChange }) => {

	return (
		<div>
			{data.products.length === 0 ? (
				<Box>
					<Text fontSize="xl" fontWeight="bold" textAlign="center" my={5}>
						Không tìm thấy sản phẩm nào
					</Text>
				</Box>
			) :
				(
					<Box>
						<Grid container spacing={6}>
							{data.products.map((item, ind) => (
								<Grid item lg={4} sm={6} xs={12} key={ind}>
									<ProductCard1 {...item} />
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
								Đang xem {`${data.pageNo * data.pageSize + 1} - ${data.pageNo * data.pageSize + data.products.length}`} sản phẩm</SemiSpan>
							<Pagination pageCount={data.totalPages} onChange={onChange} />
						</FlexBox>
					</Box>
				)
			}

		</div>
	);
};

export default ProductCard1List;
