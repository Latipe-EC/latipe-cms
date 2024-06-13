import Card from "../Card";
import { Span } from "../Typography";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Box from "../Box";
import Icon from "../icon/Icon";
import MenuItem from "../MenuItem";
import TextField from "../text-field/TextField";
import StyledSearchBox from "./SearchBoxStyle";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "@stores/store";
import { autoComplete } from "@stores/slices/search-slice";
import { useNavigate } from "react-router-dom";
import { Action, Content } from "@/utils/constants";
import { Button, Heading, Image, Input, Text, VStack } from "@chakra-ui/react";
import styled from "styled-components";

export interface SearchBoxProps {
}

const Modal = styled.div`
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
`;

const SearchBox: React.FC<SearchBoxProps> = () => {
	const [resultList, setResultList] = useState([]);
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState("");
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [image, setImage] = useState(null);
	const [products, setProducts] = useState([]);

	const search = debounce((e) => {
		const value = e.target?.value;

		dispatch(autoComplete({ keyword: value })).unwrap().then((res) => {
			return setResultList(res.data.productNames);
		});
	}, 200);

	const hanldeSearch = useCallback((event) => {
		setKeyword(event.target.value);
		event.persist();
		search(event);
	}, []);

	const handleDocumentClick = () => {
		setResultList([]);
	};

	useEffect(() => {
		window.addEventListener("click", handleDocumentClick);
		return () => {
			window.removeEventListener("click", handleDocumentClick);
		};
	}, []);

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			setImage(reader.result);
			// Call your API to get the product after the image is uploaded

		};

		if (file) {
			reader.readAsDataURL(file);
		} else {
			setImage(null);
		}
	};

	return (
		<Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
			<StyledSearchBox>
				<Icon className="search-icon" size="18px">
					search
				</Icon>
				<TextField
					className="search-field"
					placeholder={Content.SEARCH_NOW}
					fullwidth
					onChange={hanldeSearch}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							navigate(`/search?keyword=${keyword}`)
						}
					}}
				/>
				<Icon className="camera" size="18px" onClick={() => setModalOpen(true)}>
					camera
				</Icon>
			</StyledSearchBox>

			{modalOpen && (
				<Modal>
					<ModalContent>
						<VStack spacing={4} align="stretch">
							<Heading size="lg">Sản phẩm tương tự</Heading>
							<Input type="file" accept="image/*" onChange={handleImageUpload} />
							{image && <Image src={image} alt="Preview" boxSize="200px" objectFit="cover" />}
							<Button onClick={() => setModalOpen(false)}>{Action.CLOSE}</Button>
							{products.length > 0 ? (
								products.map(product => (
									<Box key={product.id} p={5} shadow="md" borderWidth="1px">
										{/* <Text>{product.name}</Text> */}
										{/* Render your product data here */}
									</Box>
								))
							) : (
								<Text>Không tìm thấy sản phẩm tương tự nào</Text>
							)}
						</VStack>
					</ModalContent>
				</Modal>
			)}

			{!!resultList.length && (
				<Card
					position="absolute"
					top="100%"
					py="0.5rem"
					width="100%"
					boxShadow="large"
					zIndex={99}
				>
					{resultList.map((item) => (
						<a href={`/search?keyword=${item.name}`} key={item.name}>
							<MenuItem key={item}>
								<Span fontSize="14px">{item.name}</Span>
							</MenuItem>
						</a>
					))}
				</Card>
			)}
		</Box>
	);
};


export default SearchBox;
