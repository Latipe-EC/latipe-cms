import { AppThunkDispatch, RootState, useAppSelector } from '../../../store/store';
import React, { useEffect, useState } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { useDispatch } from 'react-redux';
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
	Input,
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
	Textarea,
	Th,
	Thead,
	Tr,
	useToast
} from '@chakra-ui/react';
import Pagination from "../../../components/pagination/Pagination";
import { ChevronDownIcon, ChevronUpIcon, WarningIcon } from '@chakra-ui/icons';
import FlexBox from '../../../components/FlexBox';

import { ItemVoucher } from '../../../api/interface/promotion';
import { createVoucher, getAllPromotion, updateStatusVoucher } from '../../../store/slices/promotions-slice';
import { convertDateTimeYYYYMMDD } from "../../../utils/utils";
import { Chip } from '../../../components/Chip';
import { Small } from '../../../components/Typography';

const PromotionsAdmin = () => {

	const promotions = useAppSelector((state: RootState) => state.promotions);
	const [currentPage, setCurrentPage] = useState(1);
	const [size] = useState(10);
	const dispatch = useDispatch<AppThunkDispatch>();
	const [showModalPromotion, setShowModalPromotion] = useState(false);
	const toast = useToast();

	const [startDateError, setStartDateError] = useState('');
	const [endDateError, setEndDateError] = useState('');


	const [promotion, setPromotion] = useState<ItemVoucher>({
		_id: null,
		voucher_code: null,
		voucher_type: 1,
		voucher_counts: 0,
		discount_percent: 0,
		detail: null,
		discount_value: 0,
		voucher_require: {
			min_require: 0,
		},
		created_at: null,
		updated_at: null,
		stated_time: new Date().toISOString().slice(0, 10),
		ended_time: new Date().toISOString().slice(0, 10),
		status: 0,
	});

	const [filters, setFilters] = useState(0);
	const [expired, setExpired] = useState(0);
	const [modalConfirm, setModalConfirm] = useState(null);
	const [modalAfterAdd, setModalAfterAdd] = useState(null);

	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: '_id',
				Cell: ({ row }) => {
					const rowIndex = row.index + 1 + (currentPage - 1) * size;
					return <div>{rowIndex}</div>;
				},
			},
			{
				Header: 'Code',
				accessor: 'voucher_code',
			},
			{
				Header: 'Số lượng',
				accessor: 'voucher_counts',
				width: 100,
			},
			{
				Header: 'Giảm giá',
				accessor: 'discount_value',
				Cell: ({ value }) => {
					return <div>{value.toLocaleString('vi-VN')}₫</div>;
				},
				width: 100,
			},
			{
				Header: 'Loại',
				accessor: 'voucher_type',
				width: 100,
				Cell: ({ value }) => {
					return (
						<Box m="6px">
							<Chip p="0.25rem 1rem" bg={`${value === 2 ? "secondary" : "success"}.light`}>
								<Small textAlign="center"
									color={`${value === 2 ? "secondary" : "success"}.main`}>	{value === 2 ? 'Sản phẩm' : 'Vận chuyển'}</Small>
							</Chip>
						</Box>

					);
				},
			},
			{
				Header: 'Trạng thái',
				accessor: 'status',
				width: 100,
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Button colorScheme={item.status === 0 || item.status === 2 ? 'green' : 'red'} onClick={() => {
							item.status === 0 || item.status === 2 ? handleUpdate(item.voucher_code, 1) : setModalConfirm(item.voucher_code);
						}}>
							{item.status === 0 || item.status === 2 ? 'Kích hoạt' : 'Vô hiệu hóa'}
						</Button>
					);
				},
			},
			{
				Header: 'Ngày bắt đầu',
				accessor: 'stated_time',
				width: 100,
				Cell: ({ value }) => convertDateTimeYYYYMMDD(value)

			},
			{
				Header: 'Ngày kết thúc',
				accessor: 'ended_time',
				width: 100,
				Cell: ({ value }) => convertDateTimeYYYYMMDD(value)

			},
			{
				Header: 'Chi tiết',
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Flex justifyContent={'center'}>
							<ButtonGroup spacing="4">
								<Button colorScheme="green" onClick={() => {
									setPromotion(item), setShowModalPromotion(true)
								}}>
									Xem
								</Button>
							</ButtonGroup>
						</Flex>
					);
				},
			},
		],
		[promotions]
	);

	useEffect(() => {
		dispatch(getAllPromotion({
			page: currentPage.toString(), size: size.toString(), "filters[voucher_type][$eq]": filters.toString(),
			"filters[is_expired][$eq]": expired.toString()
		}));
		return () => {
		}
	}, [filters, expired]);


	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
		{
			columns,
			data: promotions.data,
			initialState: { pageIndex: 1 },
			manualPagination: true,
			pageCount: promotions.pagination.total,
			manualSortBy: true,
		},
		useSortBy,
		usePagination
	);

	const handleCreate = () => {
		const loadingToastId = toast({
			title: 'Đang thêm...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(createVoucher(promotion)).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status !== 200) {
				toast({
					title: 'Có lỗi xảy ra',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			} else {
				setModalAfterAdd(promotion.voucher_code)
				toast({
					title: 'Thêm voucher thành công',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				setShowModalPromotion(false);
				setPromotion({
					_id: null,
					voucher_code: null,
					voucher_type: 1,
					voucher_counts: 0,
					discount_percent: 0,
					detail: null,
					discount_value: 0,
					voucher_require: {
						min_require: 0,
					},
					created_at: null,
					updated_at: null,
					stated_time: new Date().toISOString().slice(0, 10),
					ended_time: new Date().toISOString().slice(0, 10),
					status: 0,
				});
			}

		});

	}

	const handleUpdate = (code: string, status: number) => {
		const loadingToastId = toast({
			title: 'Đang cập nhật...',
			description: <Spinner />,
			status: 'info',
			duration: null,
			isClosable: true,
			position: "top-right",
		})
		dispatch(updateStatusVoucher({
			code,
			status
		})).unwrap().then((res) => {
			toast.close(loadingToastId);
			if (res.status !== 200) {
				toast({
					title: 'Có lỗi xảy ra',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			} else {
				toast({
					title: 'Cập nhật voucher thành công',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				setModalAfterAdd(null);
			}

		});
		setShowModalPromotion(false);
		setPromotion({
			_id: null,
			voucher_code: null,
			voucher_type: 1,
			voucher_counts: 0,
			discount_percent: 0,
			detail: null,
			discount_value: 0,
			voucher_require: {
				min_require: 0,
			},
			created_at: null,
			updated_at: null,
			stated_time: new Date().toISOString().slice(0, 10),
			ended_time: new Date().toISOString().slice(0, 10),
			status: 0,
		});
		setModalConfirm(null);
	}

	return (
		<div>
			<Flex
				borderRadius="6px"
				justifyContent="space-between"
				my={4}
			>
				<Box>
					<Button colorScheme="teal" onClick={
						() => {
							setPromotion({
								_id: null,
								voucher_code: null,
								voucher_type: 1,
								voucher_counts: 0,
								discount_percent: 0,
								detail: null,
								discount_value: 0,
								voucher_require: {
									min_require: 0,
								},
								created_at: null,
								updated_at: null,
								stated_time: new Date().toISOString().slice(0, 10),
								ended_time: new Date().toISOString().slice(0, 10),
								status: 0,
							});
							setShowModalPromotion(true)
						}
					}> Thêm voucher</Button>
				</Box>
				<Box>
					<FormLabel>Loại</FormLabel>
					<Select defaultValue="1"
						value={filters}
						onChange={(e) => setFilters(parseInt(e.target.value))}>
						<option value="0">Tất cả</option>
						<option value="1">Vận chuyển</option>
						<option value="2">Đơn hàng</option>
					</Select>
				</Box>
				<Box>
					<FormLabel>Hạn sử dụng</FormLabel>
					<Select defaultValue="1"
						value={expired}
						onChange={(e) => setExpired(parseInt(e.target.value))}>
						<option value="0">Tất cả</option>
						<option value="1">Còn hạn</option>
						<option value="2">Hết hạn</option>
					</Select>
				</Box>
			</Flex>
			{promotions.data.length === 0 ? (
				<Flex
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					height="50vh"
				>
					<Box>
						<Text fontSize="xl" fontWeight="bold" textAlign="center" my={10}>
							Không tìm thấy voucher nào
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
						pageCount={promotions.pagination.total}
						onChange={(data) => {
							dispatch(getAllPromotion({
								page: (+data + 1).toString(),
								size: size.toString(),
								"filters[voucher_type][$eq]": filters.toString()
								,
								"filters[is_expired][$eq]": expired.toString()
							}));
							setCurrentPage(+data + 1);
						}}
					/>
				</FlexBox>
				<Modal isOpen={showModalPromotion} onClose={() => {
					setEndDateError('');
					setStartDateError('');
					setShowModalPromotion(false)
				}} isCentered >
					<ModalOverlay />
					<ModalContent>
						<ModalHeader style={{
							fontWeight: 'bold',
							fontSize: '20px',
							color: 'gray.800',
							textAlign: "center",
							marginTop: '20px'
						}}>
							Voucher
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody
						>
							<FormControl my={4}>
								<FormLabel>Mã</FormLabel>
								<Input
									value={promotion.voucher_code}
									min="100"
									onChange={(e) => setPromotion({ ...promotion, voucher_code: e.target.value })}
								/>
							</FormControl>
							<FormControl my={4}>
								<FormLabel>Loại voucher</FormLabel>
								<Select defaultValue="1"
									value={promotion.voucher_type}
									onChange={(e) => setPromotion({ ...promotion, voucher_type: parseInt(e.target.value) })}>
									<option value="1">Vận chuyển</option>
									<option value="2">Đơn hàng</option>
								</Select>
							</FormControl>

							<FormControl id="description">
								<FormLabel>Mô tả</FormLabel>
								<Textarea
									required
									value={promotion.detail}
									onChange={(e) => setPromotion({ ...promotion, detail: e.target.value })}
									resize="none"
								/>
							</FormControl>

							<FormControl my={4}>
								<FormLabel>Giảm giá</FormLabel>
								<Input
									type='number'
									value={promotion.discount_value}
									min="1"
									onChange={(e) => setPromotion({
										...promotion,
										discount_value: parseInt(e.target.value)
									})}
								/>
							</FormControl>
							<FormControl my={4}>
								<FormLabel>Giá tối thiểu</FormLabel>
								<Input
									type='number'
									value={promotion.voucher_require.min_require}
									min="1"
									onChange={(e) => setPromotion({
										...promotion,
										voucher_require: { min_require: parseInt(e.target.value) }
									})}
								/>
							</FormControl>
							<FormControl my={4}>
								<FormLabel>Số lượng</FormLabel>
								<Input
									type='number'
									value={promotion.voucher_counts}
									min="1"
									onChange={(e) => setPromotion({
										...promotion,
										voucher_counts: parseInt(e.target.value)
									})}
								/>
							</FormControl>
							<FormControl my={4} isInvalid={!!startDateError}>
								<FormLabel>Ngày bắt đầu</FormLabel>
								<Input
									type='date'
									value={new Date(promotion.stated_time).toISOString().slice(0, 10)}
									onChange={(e) => {
										if (new Date(e.target.value) < new Date(promotion.ended_time)) {
											setPromotion({
												...promotion,
												stated_time: e.target.value
											});
											setEndDateError('');
											setStartDateError('');
										} else {
											setStartDateError('Start date must be smaller than end date');
										}
									}}
								/>
								<FormErrorMessage>
									{startDateError}
								</FormErrorMessage>
							</FormControl>
							<FormControl my={4} isInvalid={!!endDateError}>
								<FormLabel>Ngày kết thúc</FormLabel>
								<Input
									type='date'
									value={new Date(promotion.ended_time).toISOString().slice(0, 10)}
									onChange={(e) => {
										if (new Date(e.target.value) > new Date(promotion.stated_time)) {
											setPromotion({
												...promotion,
												ended_time: e.target.value
											});
											setEndDateError('');
											setStartDateError('');
										} else {
											setEndDateError('End date must be greater than start date');
										}
									}}
								/>
								<FormErrorMessage>
									{endDateError}
								</FormErrorMessage>
							</FormControl>
						</ModalBody>
						<ModalFooter>
							<Flex justifyContent="center" alignItems="center" mt={4}>
								<Button colorScheme="teal" mr={4} onClick={() => {
									setShowModalPromotion(false);
									setEndDateError('');
									setStartDateError('');
									setPromotion({
										_id: null,
										voucher_code: null,
										voucher_type: 1,
										voucher_counts: 0,
										discount_percent: 0,
										detail: null,
										discount_value: 0,
										voucher_require: {
											min_require: 0,
										},
										created_at: null,
										updated_at: null,
										stated_time: new Date().toISOString().slice(0, 10),
										ended_time: new Date().toISOString().slice(0, 10),
										status: 0,
									});
								}}>
									Hủy
								</Button>
								{!promotion._id && < Button colorScheme="red" onClick={handleCreate}
									isDisabled={
										promotion.voucher_code === '' ||
										promotion.voucher_type === null ||
										promotion.voucher_counts === null ||
										promotion.detail === null ||
										promotion.discount_value <= 0 ||
										promotion.voucher_require.min_require < 0 ||
										promotion.stated_time === null ||
										promotion.ended_time === null
									}
								>
									Thêm
								</Button>}
							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>
				{modalConfirm &&
					<Modal isOpen={modalConfirm !== null} onClose={() => {
						setModalConfirm(null)
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
								<Icon as={WarningIcon} mr={2} /> Cảnh báo
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Text textAlign='center' fontSize={'x-large'}>Bạn có chắc chắn muốn vô hiệu hóa voucher này?</Text>
							</ModalBody>
							<ModalFooter>
								<Flex justifyContent="center" alignItems="center" mt={4}>
									<Button colorScheme="red" mr={4} onClick={() => {
										setModalConfirm(null)
									}}>
										Hủy
									</Button>
									<Button colorScheme="green"
										onClick={() => handleUpdate(modalConfirm, 2)}>
										Xác nhận
									</Button>
								</Flex>
							</ModalFooter>
						</ModalContent>
					</Modal>}


				{modalAfterAdd &&
					<Modal isOpen={modalAfterAdd !== null} onClose={() => {
						setModalAfterAdd(null)
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
								Thông báo
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Text textAlign='center' fontSize={'x-large'}>Bạn có muốn kích hoạt voucher này luôn không?</Text>
							</ModalBody>
							<ModalFooter>
								<Flex justifyContent="center" alignItems="center" mt={4}>
									<Button colorScheme="red" mr={4} onClick={() => {
										setModalAfterAdd(null)
									}}>
										Hủy
									</Button>
									<Button colorScheme="green"
										onClick={() => handleUpdate(modalAfterAdd, 1)}>
										Xác nhận
									</Button>
								</Flex>
							</ModalFooter>
						</ModalContent>
					</Modal>}

			</>}
		</div >
	);
}

export default PromotionsAdmin;
