import { useEffect, useState } from "react";
import Avatar from "@components/avatar/Avatar";
import IconButton from "@components/buttons/IconButton";
import FlexBox from "@components/FlexBox";
import Hidden from "@components/hidden/Hidden";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import Pagination from "@components/pagination/Pagination";
import TableRow from "@components/TableRow";
import Typography, { H5 } from "@components/Typography";
import { AppThunkDispatch, RootState, useAppSelector } from '@stores/store';
import { useDispatch } from 'react-redux';
import { getMyProductBanStore } from "@stores/slices/stores-slice";
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tooltip
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, Search2Icon, ViewIcon } from "@chakra-ui/icons";
import { debounce } from "lodash";

const Products = () => {
	const [currentPage, setCurrentPage] = useState(0);
	const [searchText, setSearchText] = useState("");
	const [orderBy, setOrderBy] = useState("createdDate");
	const [showReason, setShowReason] = useState(false);
	const [reason, setReason] = useState<string>();
	const dispatch = useDispatch<AppThunkDispatch>();
	const stores = useAppSelector((state: RootState) => state.stores);

	useEffect(() => {
		dispatch(getMyProductBanStore({ skip: currentPage * 10, limit: 10, name: searchText, orderBy }));
	}, []);

	useEffect(() => {
		dispatch(getMyProductBanStore({ skip: currentPage * 10, limit: 10, name: searchText, orderBy }));
	}, [currentPage, searchText, orderBy]);

	const handleSearch = debounce((searchText: string) => {
		setSearchText(searchText);
	}, 500);

	const handleSeeReasonBan = (reason: string) => {
		setShowReason(true);
		setReason(reason);
	}

	return (
		<Box>
			<DashboardPageHeader title="Products" iconName="delivery-box" />
			<FlexBox alignItems="center" mb="1rem">
				<InputGroup width={'xl'}>
					<InputLeftElement pointerEvents="none">
						<Search2Icon></Search2Icon>
					</InputLeftElement>
					<Input placeholder="Tìm kiếm sản phẩm"
						onChange={(e) => {
							handleSearch(e.target.value);
						}}
					/>
				</InputGroup>
				<FlexBox alignItems="center" ml={4} onClick={() => {
					setOrderBy(orderBy === "createdDate" ? "-createdDate" : "createdDate");
				}} cursor="pointer">
					<Typography mr="0.25rem"
					>Sort by date</Typography>
					<IconButton
						variant="contained"
					>
						{orderBy !== "createdDate" ? <ChevronDownIcon /> : <ChevronUpIcon />}
					</IconButton>
				</FlexBox>
			</FlexBox>
			<Hidden down={769}>
				<TableRow padding="0px 18px" mb="-0.125rem" boxShadow="none" bg="none">
					<FlexBox my="0px" mx="6px" flex="2 2 220px !important">
						<H5 ml="56px" color="text.muted" textAlign="center">
							Tên sản phẩm
						</H5>
					</FlexBox>
					<H5 color="text.muted" my="0px" mx="6px" textAlign="center">
						Phân loại hàng
					</H5>
					<H5 color="text.muted" my="0px" mx="6px" textAlign="center">
						Doanh số
					</H5>
					<H5
						flex="0 0 0 !important"
						color="text.muted"
						px="22px"
						my="0px"
					></H5>
				</TableRow>
			</Hidden>

			{stores.banProducts.length > 0 && stores.banProducts.map((item, index) => (
				<TableRow as="a" href={item.href} my="1rem" padding="6px 18px" key={index}>
					<FlexBox alignItems="center" m="6px" flex="2 2 220px !important">
						<Avatar src={item.image} size={36} />
						<Typography textAlign="center" ml="20px">
							{item.name}
						</Typography>
					</FlexBox>
					<H5
						m="6px"
						textAlign="center"
						fontWeight="600"
						color={item.stock < 6 ? "error.main" : "inherit"}
					>
						{item.countProductVariants}
					</H5>
					<H5 m="6px" textAlign="center" fontWeight="400">
						{item.countSale}
					</H5>
					<Hidden flex="0 0 0 !important" down={769}
						onClick={() => handleSeeReasonBan(item.reasonBan)}>
						<Tooltip label="Xem lý do">
							<Typography textAlign="center" color="text.muted">
								<IconButton variant="contained">
									<ViewIcon />
								</IconButton>
							</Typography>
						</Tooltip>
					</Hidden>
				</TableRow>
			))}

			<FlexBox justifyContent="center" mt="2.5rem">
				<Pagination
					pageCount={Math.ceil(stores.paginationBan.total / 10)}
					onChange={(data) => {
						setCurrentPage(+data);
					}}
				/>
			</FlexBox>

			<Modal isOpen={showReason} onClose={() => {
				setShowReason(false)
			}} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Lý do</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Alert status='error'>
							<AlertIcon />
							{reason}
						</Alert>

					</ModalBody>
					<ModalFooter>
						<Button colorScheme='red' mr={3} onClick={() => {
							setShowReason(false)
						}}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};


export default Products;
