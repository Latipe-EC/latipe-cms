import { ItemVoucher } from "@/api/interface/promotion";
import FlexBox from "@/components/FlexBox";
import Pagination from "@/components/pagination/Pagination";
import VoucherRoww from "@/pages/vendor/voucher/VoucherRow";
import { createVoucherVendor, getAllVendorPromotion, updateVendorStatusVoucher } from "@/stores/slices/promotions-slice";
import { AppThunkDispatch, RootState, useAppSelector } from "@/stores/store";
import { Action, ContentToast, DiscountType, PaymentMethodName, TitleToast, VoucherStatus, VoucherType } from "@/utils/constants";
import { handleApiCallWithToast } from "@/utils/utils";
import { WarningIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Grid, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text, Textarea, useToast } from "@chakra-ui/react";
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

		const req = {
			...promotion,
			voucher_type: VoucherType.STORE,
			stated_time: startDate.toISOString().slice(0, 16),
			ended_time: endDate.toISOString().slice(0, 16)
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
			TitleToast.ADD_VOUCHER,
			TitleToast.SUCCESS,
			ContentToast.ADD_VOUCHER_SUCCESS,
			TitleToast.ERROR,
			ContentToast.ADD_VOUCHER_ERROR,
			null,
			toast,
			<Spinner />)

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

	const handleShowDetail = (voucher: ItemVoucher) => {
		setPromotion(voucher);
		setShowModalPromotion(true);
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
							setShowModalPromotion(true);
						}}
					>
						Thêm voucher
					</Button>
				</Box>
			</Flex>
			<Box alignItems="center">
				{promotions.data && promotions.data.map((item) => (
					<VoucherRoww voucher={item} showDetail={handleShowDetail} />
				))}
				{promotions.data && promotions.data.length > 0 &&
					<FlexBox justifyContent="center">
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
									value={new Date(promotion.stated_time).toISOString().slice(0, 16)}
									onChange={(e) => {
										const selectedDate = new Date(e.target.value);
										const currentDate = new Date();
										currentDate.setMinutes(currentDate.getMinutes() + 15);
										if (selectedDate > currentDate && selectedDate < new Date(promotion.ended_time)) {
											setPromotion({
												...promotion,
												stated_time: e.target.value
											});
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
									value={new Date(promotion.ended_time).toISOString().slice(0, 16)}
									onChange={(e) => {
										const selectedDate = new Date(e.target.value);
										if (selectedDate > new Date(promotion.stated_time)) {
											setPromotion({
												...promotion,
												ended_time: e.target.value
											});
											setEndDateError('');
											setStartDateError('');
										} else {
											setEndDateError('End date and time must be greater than start date and time');
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
														step="0.01"
														onChange={(e) => {
															const value = e.target.value;
															if (value === '') {
																setPromotion({
																	...promotion,
																	discount_data: {
																		...promotion.discount_data,
																		discount_percent: parseFloat(value)
																	}
																});
															} else {
																const floatValue = parseFloat(value);
																if (floatValue <= 1) {
																	setPromotion({
																		...promotion,
																		discount_data: {
																			...promotion.discount_data,
																			discount_percent: floatValue
																		}
																	});
																}
															}
														}}
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
		</Box>
	);
};

export default VoucherList;