import React from "react";
import Box from "../Box";
import { AttributeValue, CategoryResponse } from "@interfaces/product";
import { Text } from "@chakra-ui/react";
import FlexBox from "../FlexBox";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


export interface ProductDescriptionProps {
	description: string;
	attributes: AttributeValue[];
	categories?: CategoryResponse[];
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
	description,
	attributes, categories
}) => {
	const navigate = useNavigate();
	const handleClickCate = (category: CategoryResponse) => {
		navigate(`/search?category=${category.name}`)
	}

	const editorConfiguration = {
		toolbar: {
			items: []
		}
	};

	const categoryString = categories.map((category, index) => {
		const categoryName = category.name;
		const separator = index === categories.length - 1 ? "" : " > ";
		return (
			<Text
				key={category.id}
				as="span"
				cursor="pointer"
				color={"#63C9FA"}
				fontWeight={"bold"}
				onClick={() => handleClickCate(category)}
			>
				{categoryName}
				{separator}
			</Text>
		);
	});

	return (
		<Box>
			<Text p={"2"} fontSize={"2xl"} mb="0.2rem" textTransform="uppercase">Danh Mục
				:</Text>
			{" "}
			<Box ml={3}>
				{categoryString}
			</Box>

			<Text p={"2"} fontSize={"2xl"} mb="0.2rem" textTransform="uppercase">Chi tiết sản
				phẩm:</Text>

			{
				attributes.map((attribute) => (
					<FlexBox key={attribute.name} mb="0.5rem" ml={3}>
						<Text fontWeight="bold" mr="0.5rem">{attribute.name}</Text>
						<Text>{attribute.value}</Text>
					</FlexBox>
				))
			}
			<Text p={"2"} fontSize={"2xl"} mb="0.5rem" textTransform="uppercase">Mô tả sản phẩm:</Text>
			<Box ml={3}>
				<CKEditor
					editor={ClassicEditor}
					config={editorConfiguration}
					data={description}
					onReady={editor => {
						console.log('Editor is ready to use!', editor);
					}}
					disabled={true}
				/>
			</Box>
		</Box>
	);
};

export default ProductDescription;
