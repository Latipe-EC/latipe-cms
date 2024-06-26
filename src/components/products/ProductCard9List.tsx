import React from "react";
import FlexBox from "../FlexBox";
import Pagination from "../pagination/Pagination";
import ProductCard9 from "../product-cards/ProductCard9";
import { SemiSpan } from "../Typography";
import { ProductListGetVm } from "../../api/interface/search";
import { Box, Text } from "@chakra-ui/react";
import { Content } from "@/utils/constants";

export interface ProductCard9ListProps {
	forgePage?: number;
	data?: ProductListGetVm;
	onChange?: (data: number) => void;
}

const ProductCard9List: React.FC<ProductCard9ListProps> = ({ forgePage, data, onChange }) => {
	console.log(1232);
	return (
		<div>
			{data.products.length === 0 ? (
				<Box>
					<Text fontSize="xl" fontWeight="bold" textAlign="center" my={5}>
						{Content.PRODUCT_NOT_FOUND}
					</Text>
				</Box>
			) : (
				<Box>
					{data.products.map((item, ind) => (
						<ProductCard9 mb="1.25rem" key={ind} {...item} />
					))}

					<FlexBox
						flexWrap="wrap"
						justifyContent="space-between"
						alignItems="center"
						mt="32px"
					>
						<SemiSpan>
							Đang
							xem {`${data.pageNo * data.pageSize + 1} - ${data.pageNo * data.pageSize + data.products.length}`} sản
							phẩm</SemiSpan>
						<Pagination currentPage={forgePage} pageCount={data.totalPages} onChange={onChange} />
					</FlexBox>
				</Box>
			)}
		</div>
	);
};

export default ProductCard9List;
