import { AppThunkDispatch, RootState, useAppSelector } from '@stores/store';
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
	Grid,
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
import Pagination from "@components/pagination/Pagination";
import { ChevronDownIcon, ChevronUpIcon, WarningIcon } from '@chakra-ui/icons';
import FlexBox from '@components/FlexBox';

// import { DiscountData, ItemVoucher, VoucherRequire } from '../../../api/interface/promotion';
import { createVoucher, getAllPromotion, updateStatusVoucher } from '@stores/slices/promotions-slice';
import { convertDateTimeYYYYMMDD, handleApiCallWithToast } from "../../../utils/utils";
import { Chip } from '@components/Chip';
import { Small } from '@components/Typography';
import { Action, ContentToast, DiscountType, PaymentMethodName, TitleToast, VoucherStatus, VoucherType } from '@/utils/constants';
import { ItemVoucher } from '../../../api/interface/promotion';

// type ErrorProps = {
// 	voucher_code?: string
// 	voucher_type?: number
// 	voucher_counts?: number
// 	detail?: string
// 	discount_data?: DiscountData
// 	voucher_require?: VoucherRequire
// 	stated_time?: string
// 	ended_time?: string
// }

const PromotionsAdmin = () => {

	const templateVoucher: ItemVoucher = {
		id: null,
		voucher_code: '',
		voucher_type: 1,
		voucher_counts: 0,
		detail: '',
		discount_data: {
			discount_type: 0,
			shipping_value: 0
		},
		voucher_require: {
			min_require: 0,
			payment_method: 0,
			max_voucher_per_user: 1,
		},
		created_at: null,
		updated_at: null,
		stated_time: new Date().toISOString().slice(0, 10),
		ended_time: new Date().toISOString().slice(0, 10),
		status: 0,
	}

	const promotions = useAppSelector((state: RootState) => state.promotions);
	const [currentPage, setCurrentPage] = useState(1);
	const [size] = useState(10);
	const dispatch = useDispatch<AppThunkDispatch>();
	const [showModalPromotion, setShowModalPromotion] = useState(false);
	const toast = useToast();

	const [startDateError, setStartDateError] = useState('');
	const [endDateError, setEndDateError] = useState('');

	const [promotion, setPromotion] = useState<ItemVoucher>(templateVoucher);

	const [filters, setFilters] = useState(0);
	const [expired, setExpired] = useState(0);
	const [modalConfirm, setModalConfirm] = useState(null);
	const [modalAfterAdd, setModalAfterAdd] = useState(null);
	// const [errors, setErrors] = useState<ErrorProps>();

	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
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
				Header: 'Còn lại',
				accessor: 'voucher_counts',
				width: 100,
			},
			{
				Header: 'Đã sử dụng',
				accessor: 'total_counts',
				width: 100,
				Cell: ({ row }) => {
					const item = row.original;
					return <div>{item.total_counts - item.voucher_counts}</div>;
				},
			},
			{
				Header: 'Giảm giá',
				accessor: 'discount_value',
				Cell: ({ row }) => {
					const item = row.original;
					if (item.voucher_type === VoucherType.DELIVERY) {
						return <div>{item.discount_data.shipping_value.toLocaleString('vi-VN')}₫</div>;
					}
					else {
						if (item.discount_data.discount_type === DiscountType.FIXED_DISCOUNT)
							return <div>{item.discount_data.discount_value.toLocaleString('vi-VN')}₫</div>;
						else
							return <div>{item.discount_data.discount_percent}%</div>;
					}
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
						<Button colorScheme={item.status === VoucherStatus.PENDING ? 'green' : 'red'} onClick={() => {
							item.status === VoucherStatus.PENDING ? handleUpdate(item.voucher_code, 1) : setModalConfirm(item.voucher_code);
						}}>
							{item.status === VoucherStatus.PENDING ? 'Kích hoạt' : 'Vô hiệu hóa'}
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
									{Action.VIEW}
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
		const req = { ...promotion }
		if (req.voucher_require.payment_method === 0) {
			req.voucher_require = {
				...req.voucher_require,
				payment_method: null
			}
		}

		handleApiCallWithToast(dispatch,
			createVoucher,
			req,
			null,
			TitleToast.ADD_VOUCHER,
			TitleToast.SUCCESS,
			ContentToast.ADD_VOUCHER_SUCCESS,
			TitleToast.ERROR,
			ContentToast.ADD_VOUCHER_ERROR,
			null,
			toast,
			<Spinner />,
			() => {
				setModalAfterAdd(promotion.voucher_code)
				setShowModalPromotion(false);
				setPromotion(templateVoucher);
			})

	}

	const handleUpdate = (code: string, status: number) => {
		handleApiCallWithToast(dispatch,
			updateStatusVoucher,
			{
				code,
				status
			},
			null,
			TitleToast.ADD_VOUCHER,
			TitleToast.SUCCESS,
			ContentToast.ADD_VOUCHER_SUCCESS,
			TitleToast.ERROR,
			ContentToast.ADD_VOUCHER_ERROR,
			null,
			toast,
			<Spinner />,
			() => {
				setModalAfterAdd(null);
			})

		setShowModalPromotion(false);
		setPromotion(templateVoucher);
		setModalConfirm(null);
	}

	const checkAddVoucher = (): boolean => {
		const statedTime = new Date(promotion.stated_time);
		const endedTime = new Date(promotion.ended_time);
		console.log(statedTime === endedTime);
		return (promotion.voucher_code.trim() === '' ||
			promotion.voucher_counts <= 0 ||
			promotion.detail.trim() === '' ||
			!promotion.voucher_require.min_require ||
			promotion.voucher_require.min_require <= 0 ||
			!promotion.voucher_require.max_voucher_per_user ||
			promotion.voucher_require.max_voucher_per_user <= 0 ||
			promotion.stated_time === null ||
			promotion.ended_time === null ||
			statedTime >= endedTime ||
			(promotion.voucher_type ===
				VoucherType.DELIVERY ?
				promotion.discount_data.shipping_value <= 0 :
				(promotion.discount_data.discount_type ===
					DiscountType.FIXED_DISCOUNT ?
					promotion.discount_data.discount_value < 0 :
					(promotion.discount_data.discount_percent <= 0 ||
						promotion.discount_data.discount_percent > 1 ||
						promotion.discount_data.maximum_value < 0
					)
				)))
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
							setPromotion(templateVoucher);
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
							window.scrollTo(0, 0);
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
					<ModalContent maxW={'1200px'} border="3px solid DeepSkyBlue">
						<ModalHeader style={{
							fontWeight: 'bold',
							fontSize: '50px',
							color: 'gray.800',
							textAlign: "center",
							marginTop: '20px'
						}}>
							Voucher
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Grid templateColumns="repeat(2, 1fr)" gap={6}>
								<FormControl my={4} isRequired>
									<FormLabel>Mã</FormLabel>
									<Input
										value={promotion.voucher_code}
										min="100"
										onChange={(e) => setPromotion({ ...promotion, voucher_code: e.target.value })}
									/>
								</FormControl>
								<FormControl my={4} isRequired>
									<FormLabel>Loại voucher</FormLabel>
									<Select defaultValue="1"
										value={promotion.voucher_type}
										onChange={(e) => setPromotion({ ...promotion, voucher_type: parseInt(e.target.value) })}>
										<option value="1">Vận chuyển</option>
										<option value="2">Đơn hàng</option>
									</Select>
								</FormControl>
								<FormControl id="description" isRequired>
									<FormLabel>Mô tả</FormLabel>
									<Textarea
										required
										value={promotion.detail}
										onChange={(e) => setPromotion({ ...promotion, detail: e.target.value })}
										resize="none"
									/>
								</FormControl>
								<FormControl my={4} isRequired>
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
								<FormControl my={4} isInvalid={!!startDateError} isRequired>
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
												setStartDateError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
											}
										}}
									/>
									<FormErrorMessage>
										{startDateError}
									</FormErrorMessage>
								</FormControl>

								<FormControl my={4} isInvalid={!!endDateError} isRequired>
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

								<FormControl >
									{promotion.voucher_type === VoucherType.DELIVERY && (
										<Box mb={4}>
											<Text fontSize="xl" fontWeight="bold">Giảm giá</Text>
											<FormControl>
												<Input
													type='number'
													value={promotion.discount_data.shipping_value}
													min="1"
													onChange={(e) => setPromotion({
														...promotion,
														discount_data: {
															...promotion.discount_data,
															shipping_value: parseInt(e.target.value)
														}
													})}
												/>
											</FormControl>
										</Box>
									)}

									{promotion.voucher_type === VoucherType.PRODUCT && (
										<Box mb={4}>
											<Text fontSize="xl" fontWeight="bold">Giảm giá</Text>
											<FormControl>
												<FormLabel>Loại thanh toán</FormLabel>
												<Select defaultValue="0"
													value={promotion.discount_data.discount_type}
													onChange={(e) => setPromotion({
														...promotion, discount_data: {
															discount_type: parseInt(e.target.value)
														}
													})}>
													<option value="0">Cố định</option>
													<option value="1">Phần trăm</option>
												</Select>
											</FormControl>

											{promotion.discount_data.discount_type === DiscountType.FIXED_DISCOUNT ?
												<FormControl my={4} isRequired>
													<FormLabel>Giảm giá trực tiếp</FormLabel>
													<Input
														type='number'
														value={promotion.discount_data.discount_value}
														min={promotion.discount_data.discount_type
															=== DiscountType.FIXED_DISCOUNT ? "1" : "0.01"}
														max={promotion.discount_data.discount_type
															=== DiscountType.FIXED_DISCOUNT ? "1000000000" : "1"}
														onChange={(e) => setPromotion({
															...promotion, discount_data: {
																...promotion.discount_data,
																discount_value: parseInt(e.target.value)
															}
														})}
													/>
												</FormControl> :
												<>
													<FormControl my={4} isRequired>
														<FormLabel>Tỉ lệ</FormLabel>
														<Input
															type='number'
															value={promotion.discount_data.discount_percent}
															min="0.01"
															max="1"
															onChange={(e) => setPromotion({
																...promotion, discount_data: {
																	...promotion.discount_data,
																	discount_percent: parseInt(e.target.value)
																}
															})}
														/>
													</FormControl>
													<FormControl my={4} isRequired>
														<FormLabel>Giảm tối đa</FormLabel>
														<Input
															type='number'
															value={promotion.discount_data.maximum_value}
															min="1"
															onChange={(e) => setPromotion({
																...promotion,
																discount_data: {
																	...promotion.discount_data,
																	maximum_value: parseInt(e.target.value)
																}
															})}
														/>
													</FormControl>
												</>
											}
										</Box>
									)}

								</FormControl>

								<FormControl isRequired>
									<Text fontSize="xl" fontWeight="bold">Yêu cầu</Text>
									<FormControl isRequired>
										<FormLabel>Giá tối thiểu</FormLabel>
										<Input
											type='number'
											value={promotion.voucher_require.min_require}
											min="1"
											onChange={(e) => setPromotion({
												...promotion,
												voucher_require: { ...promotion.voucher_require, min_require: parseInt(e.target.value) }
											})}
										/>
									</FormControl>
									<FormControl isRequired my={4}>
										<FormLabel>Số luợng voucher cho mỗi khách hàng</FormLabel>
										<Input
											type='number'
											value={promotion.voucher_require.max_voucher_per_user}
											min="1"
											onChange={(e) => setPromotion({
												...promotion,
												voucher_require: { ...promotion.voucher_require, max_voucher_per_user: parseInt(e.target.value) }
											})}
										/>
									</FormControl>
									<FormControl isRequired my={4}>
										<FormLabel>Loại thanh toán</FormLabel>
										<Select defaultValue="0"
											value={promotion.voucher_require.payment_method}
											onChange={(e) => setPromotion({
												...promotion,
												voucher_require: {
													...promotion.voucher_require, payment_method: parseInt(e.target.value)
												}
											})}>
											<option value="0">Không</option>
											<option value="2">{PaymentMethodName.PayPal}</option>
											<option value="3">{PaymentMethodName.Wallet}</option>
										</Select>
									</FormControl>
								</FormControl>
							</Grid>
						</ModalBody>
						<ModalFooter>
							<Flex justifyContent="center" alignItems="center" mt={4}>
								<Button colorScheme="teal" mr={4} onClick={() => {
									setShowModalPromotion(false);
									setEndDateError('');
									setStartDateError('');
									setPromotion(templateVoucher);
								}}>
									{Action.CANCEL}
								</Button>
								{!promotion.id && < Button colorScheme="red" onClick={handleCreate}
									isDisabled={checkAddVoucher()}
								>
									{Action.ADD}
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
										onClick={() => handleUpdate(promotion.voucher_code, VoucherStatus.INACTIVE)}>
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
										{Action.CANCEL}
									</Button>
									<Button colorScheme="green"
										onClick={() => handleUpdate(modalAfterAdd, VoucherStatus.ACTIVE)}>
										{Action.CONFIRM}
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
