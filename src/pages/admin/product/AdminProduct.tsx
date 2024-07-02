import { AppThunkDispatch, RootState, useAppSelector } from '@stores/store';
import React, { useEffect, useRef, useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	Image,
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
	Select,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast
} from '@chakra-ui/react';
import { ProductAdminResponse } from '@interfaces/product';
import { MdSearch } from 'react-icons/md';
import Pagination from "@components/pagination/Pagination";
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FlexBox from '@components/FlexBox';
import defaultImage from '../../../assets/default.jpg';
import { getAdminProduct, updateBanProduct } from '@stores/slices/products-slice';
import { Chip } from '@components/Chip';
import { Small } from '@components/Typography';
import { Content } from '@/utils/constants';

const ProductsAdmin = () => {

	const products = useAppSelector((state: RootState) => state.products);

	const dispatch = useDispatch<AppThunkDispatch>();
	const initialized = useRef(false);
	const [filterBanner, setFilterBanner] = useState("ALL");
	const [showModalBan, setShowModalBan] = useState<ProductAdminResponse>(null);
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const [size] = useState(10);

	const [isloaded, setLoaded] = useState(false)
	const [reasonBan, setReasonBan] = useState("");

	const toast = useToast();
	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				Cell: ({ row }) => {
					const rowIndex = row.index + 1 + currentPage * size;
					return <div>{rowIndex}</div>;
				},
			},
			{
				Header: 'Tên sản phẩm',
				accessor: 'name',
				width: 100,
			},
			{
				Header: 'Ảnh',
				accessor: 'image',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Image
								src={value}
								alt="Hình ảnh sản phẩm"
								height="200px"
								minWidth="200px"
								objectFit='cover'
								fallbackSrc={defaultImage}
							/>
						</div>
					);
				},
			},
			{
				Header: 'Số lượng phân loại',
				accessor: 'countProductVariants',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							{value}
						</div>
					);
				},
			},
			{
				Header: 'Đã bán',
				accessor: 'countSale',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Box m="6px">
								<Chip p="0.25rem 1rem" bg="green">
									<Small textAlign="center" color="white" fontWeight="bold">{value}</Small>
								</Chip>
							</Box>
						</div>
					);
				},
			},
			{
				Header: 'Đã xóa',
				accessor: 'isDeleted',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Box m="6px">
								<Chip p="0.25rem 1rem" bg={value ? "green" : "red"}>
									<Small textAlign="center" color="white"
										fontWeight="bold">{value ? "Có" : "Không"}</Small>
								</Chip>
							</Box>
						</div>
					);
				},
			},
			{
				Header: 'Đánh giá',
				accessor: 'rating',
				Cell: ({ value }) => {
					return (
						<Box m="6px">
							<Chip p="0.25rem 1rem" bg="green">
								<Small textAlign="center" color="white" fontWeight="bold">{value.toFixed(1)}⭐
								</Small>
							</Chip>
						</Box>
					);
				}
			},
			{
				Header: 'Cấm bán',
				accessor: 'isBanned',
				Cell: ({ value, row }) => {
					const item = row.original;
					return (
						<Flex justifyContent={'center'}>
							{value ? <Button colorScheme="green" onClick={() => {
								setReasonBan(item.reasonBan);
								setShowModalBan(item)
							}}>
								Xem lý do
							</Button> :
								<Button colorScheme="green" onClick={() => setShowModalBan(item)}>
									{value ? "Hủy cấm bán" : "Cấm bán"}
								</Button>
							}
						</Flex>
					);
				}
			},
			{
				Header: 'xem',
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Flex justifyContent={'center'}>
							<ButtonGroup spacing="4">
								<Button colorScheme="green"
									onClick={() => window.open(`/products/${item.id}`, '_blank')}>
									Xem chi tiết
								</Button>
							</ButtonGroup>
						</Flex>
					);
				},
			},
		],
		[products]
	);

	useEffect(() => {
		if (!initialized.current && !isloaded) {
			initialized.current = true
			setLoaded(true)
			dispatch(getAdminProduct({
				skip: currentPage * size,
				size,
				name: searchText,
				statusBan: filterBanner,
				orderBy: "createdAt"
			}));
		}
		return () => {
		}
	}, []);

	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
		{
			columns,
			data: products.data,
			initialState: { pageIndex: 0 },
			manualPagination: true,
			pageCount: products.pagination ? Math.ceil(products.pagination.total / size) : 0,
			manualSortBy: true,
		},
		useSortBy,
		usePagination
	);

	const debouncedGetAdminProduct = debounce((searchText) => {
		dispatch(getAdminProduct({
			skip: currentPage * size,
			size,
			name: searchText,
			statusBan: filterBanner,
			orderBy: "createdAt"
		}));
	}, 500);

	const handleSearchChange = (event) => {
		setSearchText(event.target.value);
		debouncedGetAdminProduct(event.target.value);
	};

	const handleUpdateStatusBan = () => {
		const loadingToastId = toast({
			title: 'Adding new category...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(updateBanProduct({
			id: showModalBan.id,
			isBanned: !showModalBan.isBanned,
			reason: reasonBan
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status !== 200) {
				toast({
					title: 'Thất bại',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			} else {
				products.data = products.data.map((item) => {
					if (item.id === showModalBan.id) {
						item.isBanned = !showModalBan.isBanned;
					}
					return item;
				})
				toast({
					title: `Thành công`,
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
			}
		}).catch(() => {
			toast.close(loadingToastId);
			toast({
				title: 'Thành công',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
		});
		setReasonBan("");
		setShowModalBan(null);
	}

	const handleFilterChange = (event) => {
		setFilterBanner(event.target.value);
		dispatch(getAdminProduct({
			skip: currentPage * size,
			size,
			name: searchText,
			statusBan: event.target.value
		}));
	}

	return (
		<div>
			<Flex
				borderRadius="6px"
				justifyContent="space-between"
				my={4}
			>
				<Box>
					<InputGroup>
						<InputLeftElement pointerEvents="none" children={<MdSearch />} />
						<Input type="text" placeholder="Tìm kiếm" onChange={handleSearchChange} max="100" />
					</InputGroup>
				</Box>
				<Box>
					<Select placeholder="Lọc cấm" onChange={handleFilterChange}>
						<option value="ALL">ALL</option>
						<option value="TRUE">TRUE</option>
						<option value="FALSE">FALSE</option>
					</Select>
				</Box>
			</Flex>
			{products.data.length === 0 ? (
				<Flex
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					height="50vh"
				>
					<Box>
						<Text fontSize="xl" fontWeight="bold" textAlign="center" my={10}>
							{Content.PRODUCT_NOT_FOUND}
						</Text>
					</Box>
				</Flex>
			) : <>
				<Table {...getTableProps()} variant="striped" borderWidth="1px" borderRadius="md">
					<Thead>
						{headerGroups.map((headerGroup) => (
							<Tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<Th textAlign="center"
										{...column.getHeaderProps(column.getSortByToggleProps())}
										onClick={(e) => {
											column.getSortByToggleProps().onClick(e);
										}}
										className={`${column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''} ${column.id === 'action' ? 'action-column' : ''
											}`}
									>
										{column.render('Header')}
										<span>{column.isSorted ? (column.isSortedDesc ? <ChevronDownIcon /> :
											<ChevronUpIcon />) : ''}</span>
									</Th>
								))}
							</Tr>
						))}
					</Thead>
					<Tbody {...getTableBodyProps()}>
						{page.map((row) => {
							prepareRow(row);
							return (
								<Tr {...row.getRowProps()} textAlign="center">
									{row.cells.map((cell) => {
										return (
											<Td textAlign="center" {...cell.getCellProps()}
												className={cell.column.id === 'action' ? 'action-column' : ''}>
												{cell.render('Cell')}
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				</Table>
				<FlexBox justifyContent="center" mt="2.5rem">
					<Pagination
						pageCount={products.pagination ? Math.ceil(products.pagination.total / 10) : 0}
						onChange={(data) => {
							window.scrollTo(0, 0);
							dispatch(getAdminProduct({
								skip: currentPage * size,
								size,
								name: searchText,
								statusBan: filterBanner,
								orderBy: "createdAt"
							}));
							setCurrentPage(+data);
						}}
					/>
				</FlexBox>
				<Modal isOpen={showModalBan !== null} onClose={() => {
					setShowModalBan(null)
					setReasonBan("");
				}} isCentered>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader style={{
							fontWeight: 'bold',
							fontSize: '20px',
							color: 'gray.800',
							textAlign: "center",
							marginTop: '20px'
						}}>
							Lý do
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Input
								value={reasonBan}
								min="100"
								onChange={(e) => setReasonBan(e.target.value)}
								readOnly={showModalBan && showModalBan.isBanned}
							>
							</Input>
						</ModalBody>
						<ModalFooter>
							<Flex justifyContent="center" alignItems="center" mt={4}>
								<Button colorScheme="teal" mr={4} onClick={() => {
									setShowModalBan(null)
									setReasonBan("");
								}}>
									Hủy
								</Button>
								<Button colorScheme="red" onClick={handleUpdateStatusBan}>
									{showModalBan && showModalBan.isBanned ? "Hủy cấm	bán" : "Cấm bán"}
								</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>}
		</div>
	);
}

export default ProductsAdmin;
