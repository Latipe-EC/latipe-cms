import { ItemVoucher } from "@/api/interface/promotion";
import { Chip } from "@/components/Chip";
import FlexBox from "@/components/FlexBox";
import Typography, { H5, Small } from "@/components/Typography";
import Hidden from "@/components/hidden/Hidden";
import Pagination from "@/components/pagination/Pagination";
import { createVoucherVendor, getAllVendorPromotion, updateVendorStatusVoucher } from "@/stores/slices/promotions-slice";
import { AppThunkDispatch, RootState, useAppSelector } from "@/stores/store";
import { Action, ContentToast, DiscountType, PaymentMethodName, TitleToast, VoucherStatus, VoucherType } from "@/utils/constants";
import { checkContainSpace, convertDateTimeYYYYMMDDHHMM, handleApiCallWithToast, parseNumericValue } from "@/utils/utils";
import { ViewIcon, WarningIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Grid, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Table, Tbody, Td, Text, Textarea, Thead, Tr, useToast } from "@chakra-ui/react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const templateVoucher: ItemVoucher = {
	id: null,
	voucher_code: '',
	voucher_type: 3,
	voucher_counts: 0,
	detail: '',
	discount_data: {
		discount_type: 0,
		shipping_value: 0,
		discount_percent: 0
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

const VoucherList = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const [currentPage, setCurrentPage] = useState(1);
	const [size] = useState(10);
	const [startDateError, setStartDateError] = useState('');
	const [endDateError, setEndDateError] = useState('');
	const [showModalPromotion, setShowModalPromotion] = useState(false);
	const [promotion, setPromotion] = useState<ItemVoucher>(templateVoucher);
	const [expired, setExpired] = useState(0);
	const [modalConfirm, setModalConfirm] = useState(null);
	const toast = useToast();
	const promotions = useAppSelector((state: RootState) => state.promotions);
	const [modalAfterAdd, setModalAfterAdd] = useState(null);
	const [discount_percent, setDiscountPercent] = useState(0);

	useEffect(() => {
		dispatch(getAllVendorPromotion({
			page: currentPage.toString(), size: size.toString()
			, "filters[is_expired][$eq]": expired.toString()
		}));
		return () => {
		}
	}, [expired]);

	const handleCreate = () => {
		const startDate = new Date(promotion.stated_time);
		const endDate = new Date(promotion.ended_time);
		const discount_data = {
			...promotion.discount_data,
			discount_value: parseNumericValue(promotion.discount_data.discount_value),
			maximum_value: parseNumericValue(promotion.discount_data.maximum_value)
		}
		const voucher_require = {
			...promotion.voucher_require,
			min_require: parseNumericValue(promotion.voucher_require.min_require)
		}

		if (checkContainSpace(promotion.voucher_code)) {
			toast({
				title: TitleToast.ERROR,
				description: "Mã voucher không được chứa khoảng trắng",
				status: "error",
				duration: 2000,
				isClosable: true,
				position: "top-right",
			})
			return;
		}

		const req = {
			...promotion,
			voucher_type: VoucherType.STORE,
			stated_time: startDate.toISOString().slice(0, 16),
			ended_time: endDate.toISOString().slice(0, 16),
			voucher_require,
			discount_data
		}

		if (req.voucher_require.payment_method === 0) {
			req.voucher_require = {
				...req.voucher_require,
				payment_method: null
			}
		}

		handleApiCallWithToast(dispatch,
			createVoucherVendor,
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
				setShowModalPromotion(false);
				setPromotion(templateVoucher);
				setDiscountPercent(0);
				setModalAfterAdd(req.voucher_code);
			})

	}

	const handleUpdate = (code: string, status: number) => {
		handleApiCallWithToast(dispatch,
			updateVendorStatusVoucher,
			{
				code,
				status
			},
			null,
			TitleToast.UPDATE_VOUCHER,
			TitleToast.SUCCESS,
			ContentToast.UPDATE_VOUCHER_SUCCESS,
			TitleToast.ERROR,
			ContentToast.UPDATE_VOUCHER_ERROR,
			null,
			toast,
			<Spinner />)

		setShowModalPromotion(false);
		setPromotion(templateVoucher);
		setDiscountPercent(0);
		setModalConfirm(null);
	}

	const checkAddVoucher = (): boolean => {
		const statedTime = new Date(promotion.stated_time);
		const endedTime = new Date(promotion.ended_time);
		return (promotion.voucher_code.trim() === '' ||
			promotion.voucher_counts <= 0 ||
			promotion.detail.trim() === '' ||
			!promotion.voucher_require.min_require ||
			parseNumericValue(promotion.voucher_require.min_require) <= 0 ||
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
					parseNumericValue(promotion.discount_data.discount_value) < 0 :
					(promotion.discount_data.discount_percent <= 0 ||
						promotion.discount_data.discount_percent > 1 ||
						parseNumericValue(promotion.discount_data.maximum_value) < 0
					)
				)))
	}

	const handleShowDetail = (voucher: ItemVoucher) => {
		setPromotion(voucher);
		setShowModalPromotion(true);
		setDiscountPercent(voucher.discount_data.discount_percent);
	}

	return (
		<Box p={2} mt={2} >
			<Flex
				borderRadius="6px"
				justifyContent="space-between"
				my={4}
			>
				<Flex>
					<Box mr={4}>
						<FormLabel>Hạn sử dụng</FormLabel>
						<Select
							defaultValue="1"
							value={expired}
							onChange={(e) => setExpired(parseInt(e.target.value))}
						>
							<option value="0">Tất cả</option>
							<option value="1">Còn hạn</option>
							<option value="2">Hết hạn</option>
						</Select>
					</Box>
				</Flex>
				<Box>
					<Button
						colorScheme="teal"
						onClick={() => {
							setPromotion(templateVoucher);
							setDiscountPercent(0);
							setShowModalPromotion(true);
						}}
					>
						Thêm voucher
					</Button>
				</Box>
			</Flex>
			<Box alignItems="center">
				<Table variant="simple">
					<Thead>
						<Tr>
							<Td>Mã Voucher</Td>
							<Td>Số lượng</Td>
							<Td>Còn lại</Td>
							<Td>Hết hạn</Td>
							<Td>Trạng thái</Td>
							<Td>Chi tiết</Td>
						</Tr>
					</Thead>
					<Tbody>
						{promotions.data && promotions.data.map((voucher) => (
							<Tr onClick={() => { handleShowDetail(voucher) }}>
								<Td  >
									<H5 m="6px" textAlign="left">
										{voucher.voucher_code}
									</H5>
								</Td>
								<Td>
									<Flex justifyContent="center" alignItems="center">
										<Chip p="0.25rem 1rem" bg={`success.light`}>
											<Small textAlign="center" color={`success.main`}>{voucher.voucher_counts}</Small>
										</Chip>
									</Flex>
								</Td>
								<Td>
									<Flex justifyContent="center" alignItems="center">
										<Chip p="0.25rem 1rem" bg={`success.light`}>
											<Small textAlign="center" color={`success.main`}>{voucher.total_counts - voucher.voucher_counts}</Small>
										</Chip>
									</Flex>
								</Td>
								<Td>
									<Typography className="flex-grow pre" m="6px" textAlign="left">
										{format(new Date(voucher.ended_time), "dd, MMM yyyy hh:mm:ss", { locale: vi })}
									</Typography>
								</Td>
								<Td>
									<Flex justifyContent="center" alignItems="center">
										<Chip p="0.25rem 1rem" bg={`${voucher.status === VoucherStatus.ACTIVE ? 'success' : 'error'}.light`}>
											<Small textAlign="center" color={`${voucher.status === VoucherStatus.ACTIVE ? 'success' : 'error'}.main`}>{voucher.status === VoucherStatus.ACTIVE ? "hoạt động" : "vô hiệu"}</Small>
										</Chip>
									</Flex>
								</Td>
								<Td>
									<Hidden flex="0 0 0 !important" down={769}>
										<Typography textAlign="center" color="text.muted">
											<IconButton size="small" aria-label="View details" icon={<ViewIcon />}>
											</IconButton>
										</Typography>
									</Hidden>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
				{promotions.data && promotions.data.length > 0 &&
					<FlexBox justifyContent="center" my={4}>
						<Pagination
							pageCount={Math.ceil(promotions.pagination.total)}
							onChange={(data) => {
								setCurrentPage(+data + 1);
								window.scrollTo(0, 0);
							}}
						/>
					</FlexBox>}

				{promotions.data && promotions.data.length === 0 &&
					<FlexBox justifyContent="center" alignItems="center"
						mt="2.5rem" height={"xl"}>
						<Text
							fontSize="x-large"
							textAlign="center"
							fontWeight="bold"
						>Không có voucher nào</Text>
					</FlexBox>
				}
			</Box>
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
								<Select defaultValue="3"
									value={promotion.voucher_type}
									onChange={(e) => setPromotion({ ...promotion, voucher_type: parseInt(e.target.value) })}>
									<option value="3">Đơn hàng</option>
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
									onChange={(e) => {
										if (parseInt(e.target.value) < 0 || parseInt(e.target.value) > 1000)
											return;
										setPromotion({
											...promotion,
											voucher_counts: parseInt(e.target.value)
										})
									}}
								/>
							</FormControl>
							<FormControl my={4} isInvalid={!!startDateError} isRequired>
								<FormLabel>Ngày bắt đầu</FormLabel>
								<Input
									type='datetime-local'
									value={
										convertDateTimeYYYYMMDDHHMM(promotion.stated_time)
									}
									onChange={(e) => {
										setPromotion({
											...promotion,
											stated_time: e.target.value
										});
										const selectedDate = new Date(e.target.value);
										const currentDate = new Date();
										currentDate.setMinutes(currentDate.getMinutes() + 15);
										if (!promotion.ended_time || (selectedDate > currentDate && selectedDate < new Date(promotion.ended_time))) {
											setEndDateError('');
											setStartDateError('');
										} else if (selectedDate <= currentDate) {
											setStartDateError('Ngày và giờ bắt đầu phải lớn hơn ngày và giờ hiện tại ít nhất 15 phút');
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
									type='datetime-local'
									value={convertDateTimeYYYYMMDDHHMM(promotion.ended_time)}
									onChange={(e) => {
										const selectedDate = new Date(e.target.value);
										if (!promotion.stated_time || selectedDate > new Date(promotion.stated_time)) {
											setPromotion({
												...promotion,
												ended_time: e.target.value
											});
											setEndDateError('');
											setStartDateError('');
										} else {
											setEndDateError('Ngày kết thúc phải lớn hơn ngày bắt đầu');
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

								{promotion.voucher_type === VoucherType.STORE && (
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
													type='text'
													value={promotion.discount_data.discount_value}
													min={promotion.discount_data.discount_type
														=== DiscountType.FIXED_DISCOUNT ? "1" : "0.01"}
													max={promotion.discount_data.discount_type
														=== DiscountType.FIXED_DISCOUNT ? "1000000000" : "1"}
													onChange={(e) => {
														let { value } = e.target;
														value = value.replace(/\./g, '');
														const pattern = /^[0-9]+$/;
														const real_value = parseFloat(value)
														if (real_value > 100000000)
															return;
														if (pattern.test(value) || value === '') {
															setPromotion({
																...promotion, discount_data: {
																	...promotion.discount_data,
																	discount_value: !isNaN(real_value) ? real_value.toLocaleString('vi-VN') : 0
																}
															})
														} else {
															setPromotion({
																...promotion, discount_data: {
																	...promotion.discount_data,
																	discount_value: 0
																}
															})

														}
													}}
												/>
											</FormControl> :
											<>
												<FormControl my={4} isRequired>
													<FormLabel>Tỉ lệ</FormLabel>
													<Input
														type='number'
														value={discount_percent}
														onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
															if (parseFloat(e.target.value) > 1 || parseFloat(e.target.value) < 0)
																return;
															setDiscountPercent(parseFloat(e.target.value));
															setPromotion({
																...promotion,
																discount_data: {
																	...promotion.discount_data,
																	discount_percent: parseFloat(e.target.value)
																}
															});
														}}
													/>
												</FormControl>
												<FormControl my={4} isRequired>
													<FormLabel>Giảm tối đa</FormLabel>
													<Input
														type='text'
														value={promotion.discount_data.maximum_value}
														min="1"
														onChange={(e) => {
															let { value } = e.target;
															value = value.replace(/\./g, '');
															const pattern = /^[0-9]+$/;
															const real_value = parseFloat(value)
															if (real_value > 100000000)
																return;
															if (pattern.test(value) || value === '') {
																setPromotion({
																	...promotion,
																	discount_data: {
																		...promotion.discount_data,
																		maximum_value: isNaN(real_value) ? real_value.toLocaleString('vi-VN') : 0
																	}
																})
															} else {
																setPromotion({
																	...promotion,
																	discount_data: {
																		...promotion.discount_data,
																		maximum_value: 0
																	}
																})
															}
														}}
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
										type='text'
										value={promotion.voucher_require.min_require}
										min="1"
										onChange={(e) => {
											let { value } = e.target;
											value = value.replace(/\./g, '');
											const pattern = /^[0-9]+$/;
											const real_value = parseFloat(value)
											if (real_value > 100000000)
												return;
											if (pattern.test(value) || value === '') {
												setPromotion({
													...promotion,
													voucher_require: { ...promotion.voucher_require, min_require: !isNaN(real_value) ? real_value.toLocaleString('vi-VN') : 0 }
												})
											} else {
												setPromotion({
													...promotion,
													voucher_require: { ...promotion.voucher_require, min_require: 0 }
												})
											}
										}}
									/>
								</FormControl>
								<FormControl isRequired my={4}>
									<FormLabel>Số luợng voucher cho mỗi khách hàng</FormLabel>
									<Input
										type='number'
										value={promotion.voucher_require.max_voucher_per_user}
										min="1"
										max="1000"
										onChange={(e) => {
											const value = parseInt(e.target.value);
											if (value <= 1000) {
												setPromotion({
													...promotion,
													voucher_require: { ...promotion.voucher_require, max_voucher_per_user: value }
												});
											}
										}}
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
							{promotion.id && promotion.status === VoucherStatus.ACTIVE && < Button colorScheme="red"
								onClick={() => { setModalConfirm(true) }}
							>
								{Action.RECALL}
							</Button>}

							{promotion.id && promotion.status === VoucherStatus.PENDING && < Button colorScheme="red"
								onClick={() => {
									handleUpdate(promotion.voucher_code, VoucherStatus.ACTIVE)
									setShowModalPromotion(false);
								}}
							>
								{Action.ACTIVE}
							</Button>}
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
									onClick={() => {
										handleUpdate(modalAfterAdd, VoucherStatus.ACTIVE);
										setModalAfterAdd(null)
									}}>
									{Action.CONFIRM}
								</Button>
							</Flex>
						</ModalFooter>
					</ModalContent>
				</Modal>}
		</Box>
	);
};

export default VoucherList;