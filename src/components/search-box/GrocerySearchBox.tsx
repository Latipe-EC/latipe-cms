import Button from "../buttons/Button";
import Card from "../Card";
import MenuItem from "../MenuItem";
import { Span } from "../Typography";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Box from "../Box";
import Icon from "../icon/Icon";
import TextField from "../text-field/TextField";
import SearchBoxStyle from "./SearchBoxStyle";
import { Content } from "@/utils/constants";

export interface GrocerySearchBoxProps {
}

const GrocerySearchBox: React.FC<GrocerySearchBoxProps> = () => {
	const [resultList, setResultList] = useState([]);

	const search = debounce((e) => {
		const value = e.target?.value;

		if (!value) setResultList([]);
		else setResultList(dummySearchResult);
	}, 200);

	const hanldeSearch = useCallback((event) => {
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

	return (
		<Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
			<SearchBoxStyle>
				<Icon className="search-icon" size="18px">
					search
				</Icon>
				<TextField
					className="search-field"
					placeholder={Content.SEARCH_NOW}
					fullwidth
					onChange={hanldeSearch}
				/>
				<Button className="search-button" variant="contained" color="primary">
					Search
				</Button>
				<Box className="menu-button" ml="14px" cursor="pointer">
					<Icon color="primary">menu</Icon>
				</Box>
			</SearchBoxStyle>

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
						<a href={`/search/${item}`} key={item}>
							<MenuItem key={item}>
								<Span fontSize="14px">{item}</Span>
							</MenuItem>
						</a>
					))}
				</Card>
			)}
		</Box>
	);
};

const dummySearchResult = [
	"Macbook Air 13",
	"Ksus K555LA",
	"Acer Aspire X453",
	"iPad Mini 3",
];

export default GrocerySearchBox;
