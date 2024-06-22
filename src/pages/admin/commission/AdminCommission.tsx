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
	FormControl,
	FormErrorMessage,
	FormLabel,
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
import { MdSearch } from 'react-icons/md';
import Pagination from "@components/pagination/Pagination";
import { ChevronDownIcon, ChevronUpIcon, WarningTwoIcon } from '@chakra-ui/icons';
import FlexBox from '@components/FlexBox';
import {
	createCommission,
	deleteCommission,
	getPaginateCommission,
	updateCommission
} from '@stores/slices/commissions-slice';
import { CommissionResponse } from '../../../api/interface/commission';
import { Action, Content, ContentToast, Title, TitleToast } from '@/utils/constants';
import { handleApiCallWithToast } from '@/utils/utils';

const CommissionsAdmin = () => {

	const commissions = useAppSelector((state: RootState) => state.commissions);
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const [size] = useState(10);
	const dispatch = useDispatch<AppThunkDispatch>();
	const initialized = useRef(false);
	const [showModalCommission, setShowModalCommission] = useState(false);
	const [commission, setCommission] = useState<CommissionResponse>({
		id: null,
		name: '',
		feeOrder: null,
		minPoint: null
	});
	const toast = useToast();
	const [deleteCommissionId, setDeleteCommissionId] = useState<string>(null);

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
				Header: Content.NAME_COMMISSION,
				accessor: 'name',
			},
			{
				Header: Content.COMMISSION_FEE,
				accessor: 'feeOrder',
				width: 100,
			},
			{
				Header: Content.COMMISSION_POINT,
				accessor: 'minPoint',
				width: 100,
			},
			{
				Header: Content.VIEW,
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Flex justifyContent={'center'}>
							<ButtonGroup spacing="4">
								<Button colorScheme="green" onClick={() => {
									setCommission(item), setShowModalCommission(true)
								}}>
									{Action.VIEW_DETAIL}
								</Button>
								<Button colorScheme="red" onClick={() => {
									setDeleteCommissionId(item.id)
								}}>
									{Action.DELETE}
								</Button>
							</ButtonGroup>
						</Flex>
					);
				},
			},
		],
		[commissions]
	);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true
			dispatch(getPaginateCommission({ skip: currentPage * size, size, keyword: searchText }));
		}
		return () => {
		}
	}, []);


	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
		{
			columns,
			data: commissions.data,
			initialState: { pageIndex: 0 },
			manualPagination: true,
			pageCount: commissions.pagination ? Math.ceil(commissions.pagination.total / size) : 0,
			manualSortBy: true,
		},
		useSortBy,
		usePagination
	);

	const debouncedGetAdminCommission = debounce((searchText) => {
		dispatch(getPaginateCommission({ skip: currentPage * size, size, keyword: searchText }));
	}, 500);

	const handleSearchChange = (event) => {
		setSearchText(event.target.value);
		debouncedGetAdminCommission(event.target.value);
	};

	const handleCreate = () => {

		handleApiCallWithToast(dispatch,
			createCommission,
			commission,
			null,
			TitleToast.ADD_COMMISSION,
			TitleToast.SUCCESS,
			ContentToast.ADD_COMMISSION_SUCCESS,
			TitleToast.ERROR,
			ContentToast.ADD_COMMISSION_ERROR,
			null,
			toast,
			<Spinner />,
			() => {
				setShowModalCommission(false);
				setCommission({
					id: null,
					name: '',
					feeOrder: null,
					minPoint: null
				});
			})

	}

	const handleUpdate = () => {

		handleApiCallWithToast(dispatch,
			updateCommission,
			{
				id: commission.id,
				name: commission.name,
				feeOrder: commission.feeOrder,
				minPoint: commission.minPoint
			},
			null,
			TitleToast.UPDATE_COMMISSION,
			TitleToast.SUCCESS,
			ContentToast.UPDATE_COMMISSION_SUCCESS,
			TitleToast.ERROR,
			ContentToast.UPDATE_COMMISSION_ERROR,
			null,
			toast,
			<Spinner />,
			() => {
				setShowModalCommission(false);
				setCommission({
					id: null,
					name: '',
					feeOrder: null,
					minPoint: null
				});
			})

	}

	const handleDelete = () => {

		handleApiCallWithToast(dispatch,
			deleteCommission,
			deleteCommissionId,
			null,
			TitleToast.DELETE_COMMISSION,
			TitleToast.SUCCESS,
			ContentToast.DELETE_COMMISSION_SUCCESS,
			TitleToast.ERROR,
			ContentToast.DELETE_COMMISSION_ERROR,
			null,
			toast,
			<Spinner />,
			() => {
				setDeleteCommissionId(null);
			})

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
						<Input type="text" placeholder="Search" onChange={handleSearchChange} max="100" />
					</InputGroup>
				</Box>
				<Box>
					<Button colorScheme="teal" onClick={
						() => {
							setCommission({
								id: null,
								name: '',
								feeOrder: null,
								minPoint: null
							});
							setShowModalCommission(true)
						}
					}> {Title.ADD_COMMISSION}</Button>
				</Box>
			</Flex>
			{commissions.data.length === 0 ? (
				<Flex
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					height="50vh"
				>
					<Box>
						<Text fontSize="xl" fontWeight="bold" textAlign="center" my={10}>
							{Content.NOT_FOUND}
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
						pageCount={commissions.pagination ? Math.ceil(commissions.pagination.total / 10) : 0}
						onChange={(data) => {
							dispatch(getPaginateCommission({ skip: +data * size, size, name: searchText }));
							setCurrentPage(+data);
							window.scrollTo(0, 0);
						}}
					/>
				</FlexBox>

				{/* ADD OR EDIT COMMISSION */}
				<Modal isOpen={showModalCommission} onClose={() => {
					setShowModalCommission(false)
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
							{Title.COMMISSION}
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<FormControl my={4}>
								<FormLabel>{Content.NAME_COMMISSION}</FormLabel>
								<Input
									value={commission.name}
									min="100"
									onChange={(e) => setCommission({ ...commission, name: e.target.value })}
								/>
							</FormControl>

							<FormControl my={4}
								isInvalid={commission.feeOrder !== null && (commission.feeOrder >= 1 || commission.feeOrder <= 0)}>
								<FormLabel>{Content.COMMISSION_FEE}</FormLabel>
								<Input
									value={commission.feeOrder}
									type='number'
									min="0"
									max="1"
									onChange={(e) => {
										let value = parseFloat(e.target.value);
										if (value < 0) value = 0;
										if (value > 1) value = 1;
										setCommission({ ...commission, feeOrder: value });
									}}
								/>
								<FormErrorMessage>
									{commission.feeOrder !== null && (commission.feeOrder >= 1 || commission.feeOrder <= 0) && "Phí hoa hồng phải nằm trong khoảng từ 0 đến 1"}
								</FormErrorMessage>
							</FormControl>

							<FormControl my={4}>
								<FormLabel>{Content.COMMISSION_POINT}</FormLabel>
								<Input
									type='number'
									value={commission.minPoint}
									min="1"
									onChange={(e) => setCommission({
										...commission,
										minPoint: parseInt(e.target.value)
									})}
								/>
							</FormControl>
						</ModalBody>
						<ModalFooter>
							<Flex justifyContent="center" alignItems="center" mt={4}>
								<Button colorScheme="teal" mr={4} onClick={() => {
									setShowModalCommission(false);
									setCommission({
										id: null,
										name: '',
										feeOrder: null,
										minPoint: null
									});
								}}>
									{Action.CANCEL}
								</Button>
								{commission && commission.id ? <Button
									isDisabled={commission.name === '' || commission.feeOrder === null || commission.minPoint === null || commission.feeOrder > 1 || commission.feeOrder < 0}
									colorScheme="red" onClick={handleUpdate}>
									{Action.EDIT}
								</Button> : <Button colorScheme="red" onClick={handleCreate}
									isDisabled={commission.name === '' || commission.feeOrder === null || commission.minPoint === null || commission.feeOrder > 1 || commission.feeOrder < 0}
								>
									{Action.ADD}
								</Button>}

							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>
				{/* DELETE COMMISSION  */}
				<Modal isOpen={deleteCommissionId !== null} onClose={() => {
					setDeleteCommissionId(null)
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
							{Title.DELETE_COMMISSION}!
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<WarningTwoIcon boxSize={6} color="red.500" />
							<Text fontSize="md" color="gray.600" textAlign="center">
								{Content.CONFIRM_DELETE_COMMISSION}
							</Text>
						</ModalBody>
						<ModalFooter>
							<Flex justifyContent="center" alignItems="center" mt={4}>
								<Button colorScheme="teal" mr={4} onClick={() => {
									setDeleteCommissionId(null);
								}}>
									{Action.CANCEL}
								</Button>
								<Button colorScheme="red" onClick={handleDelete}>
									{Action.DELETE}
								</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>}
		</div>
	);
}

export default CommissionsAdmin;
