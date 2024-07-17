// import React, { useEffect, useRef, useState } from 'react';
// import { usePagination, useSortBy, useTable } from 'react-table';
// import { useDispatch } from 'react-redux';
// import {
// 	Box,
// 	Button,
// 	ButtonGroup,
// 	Flex,
// 	FormControl,
// 	FormErrorMessage,
// 	FormLabel,
// 	Input,
// 	Modal,
// 	ModalBody,
// 	ModalCloseButton,
// 	ModalContent,
// 	ModalFooter,
// 	ModalHeader,
// 	ModalOverlay,
// 	Spinner,
// 	Table,
// 	Tbody,
// 	Td,
// 	Text,
// 	Th,
// 	Thead,
// 	Tr,
// 	useToast
// } from '@chakra-ui/react';
// import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ImageUpload from '@/components/upload-image/ImageUpload';
// import { convertDateTimeYYYYMMDDHHMM, formatDateTime, handleApiCallWithToast, isBlank } from '@/utils/utils';
// import { createSetting, getSettingAdmin, recallSettingAdmin } from '@/stores/slices/notification-slice';
// import { Chip } from '@/components/Chip';
// import { Small } from '@/components/Typography';
// import { Action, ContentToast, TitleToast } from '@/utils/constants';
// import { AppThunkDispatch, RootState, useAppSelector } from '@/stores/store';
// import './index.css';
// import FlexBox from '@/components/FlexBox';
// import Pagination from '@/components/pagination/Pagination';

// type ErrorProps = {
// 	title?: string,
// 	body?: string,
// 	schedule_display?: string
// 	campaign_topic?: string
// }

// const originalData = {
// 	id: '',
// 	campaign_topic: '',
// 	title: '',
// 	body: '',
// 	schedule_display: '',
// 	is_active: true
// }

// const SettingsAdmin = () => {

// 	const dispatch = useDispatch<AppThunkDispatch>();
// 	const initialized = useRef(false)
// 	const [selectSetting, setSelectSetting] = useState(originalData);
// 	const [selectRecallSetting, setSelectRecallSetting] = useState(null);
// 	const [errors, setErrors] = useState<ErrorProps>();
// 	const toast = useToast();
// 	const [files, setFiles] = useState<File[]>([]);
// 	const [isOpenConfirmRecall, setIsOpenConfirmRecall] = useState(false);
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const [size] = useState(10);
// 	const [isOpenAddSetting, setIsOpenAddSetting] = useState(false);
// 	const [reason, setReason] = useState('');
// 	const [settings, setSettings] = useState([]);

// 	useEffect(() => {
// 		if (!initialized.current) {
// 			initialized.current = true
// 			dispatch(getSettingAdmin({
// 				"size": size,
// 				"page": currentPage
// 			}))
// 		}
// 	}, []);

// 	const columns = React.useMemo(
// 		() => [
// 			{
// 				Header: 'ID',
// 				accessor: 'id',
// 				Cell: ({ row }) => {
// 					const rowIndex = row.index + 1;
// 					return <div>{rowIndex}</div>;
// 				},
// 			},
// 			{
// 				Header: 'code',
// 				accessor: 'code',
// 				width: 100,
// 			},
// 			{
// 				Header: 'Ngày thực hiện',
// 				accessor: 'created_date',
// 				width: 100,
// 			},
// 			{
// 				Header: 'Trạng thái',
// 				accessor: 'status',
// 				Cell: ({ value }) => {
// 					return (
// 						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// 							{value === 1 ? "Thành công" : "Thất bại"}
// 						</div>
// 					);
// 				},
// 			},
// 			{
// 				Header: 'Chi tiết',
// 				Cell: ({ row }) => {
// 					const item = row.original;
// 					return (
// 						<Flex justifyContent={'center'}>
// 							<ButtonGroup spacing="4">
// 								<Button colorScheme="green" onClick={() => {
// 									setSelectSetting(item)
// 									setIsOpenAddSetting(true)
// 								}}>
// 									{Action.VIEW_DETAIL}
// 								</Button>
// 							</ButtonGroup>
// 						</Flex>
// 					);
// 				},
// 			},
// 		],
// 		[settings]
// 	);

// 	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
// 		{
// 			columns,
// 			data: settings ? settings : [],
// 			initialState: { pageIndex: 0 },
// 			manualPagination: true,
// 			pageCount: setSettings ? Math.ceil(setSettings.length / 20) : 0,
// 			manualSortBy: true,
// 		},
// 		useSortBy,
// 		usePagination
// 	);

// 	const validate = () => {
// 		const newErrors: ErrorProps = {};

// 		if (isBlank(selectSetting.campaign_topic)) {
// 			newErrors.title = 'Hãy nhập chủ đề chiến dịch';
// 		}

// 		if (isBlank(selectSetting.title)) {
// 			newErrors.title = 'Hãy nhập tiêu đề';
// 		}

// 		if (isBlank(selectSetting.body)) {
// 			newErrors.body = 'Hãy nhập nội dung';
// 		}

// 		if (isBlank(selectSetting.schedule_display)) {
// 			newErrors.schedule_display = 'Hãy nhập hẹn giờ';
// 		}


// 		setErrors(newErrors);

// 		return Object.keys(newErrors).length === 0;
// 	};

// 	const confirmRecallSetting = (item) => () => {
// 		setSelectRecallSetting(item);
// 		setIsOpenConfirmRecall(true);
// 		setReason('');
// 	}

// 	const recallSetting = () => {
// 		handleApiCallWithToast(dispatch,
// 			recallSettingAdmin,
// 			{
// 				"notification_id": selectRecallSetting.id,
// 				"reason": reason
// 			},
// 			null,
// 			TitleToast.RECALL_CAMPAIGN,
// 			TitleToast.SUCCESS,
// 			ContentToast.RECALL_CAMPAIGN_SUCCESS,
// 			TitleToast.ERROR,
// 			ContentToast.RECALL_CAMPAIGN_ERROR,
// 			null,
// 			toast,
// 			<Spinner />,
// 			() => {
// 				setIsOpenConfirmRecall(false)
// 			})
// 	}

// 	const handleAddSetting = () => {

// 		if (!validate()) {
// 			return;
// 		}

// 		handleApiCallWithToast(dispatch,
// 			createSetting,
// 			{
// 				data: { ...selectSetting, schedule_display: formatDateTime(selectSetting.schedule_display) }
// 				, file: files[0]
// 			},
// 			null,
// 			TitleToast.ADD_CAMPAIGN,
// 			TitleToast.SUCCESS,
// 			ContentToast.ADD_CAMPAIGN_SUCCESS,
// 			TitleToast.ERROR,
// 			ContentToast.ADD_CAMPAIGN_ERROR,
// 			null,
// 			toast,
// 			<Spinner />,
// 			() => {
// 				setIsOpenAddSetting(false)
// 			})
// 	}

// 	return (
// 		<div>
// 			{detailSchedule ? <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mb={4} shadow="md">
// 				<Text fontSize="lg" fontWeight="bold">Thông Tin Lập Lịch</Text>
// 				<Text>Ngày Tạo: {detailSchedule.creationDate}</Text>
// 				<Text>Loại Lập Lịch: {detailSchedule.scheduleType}</Text>
// 				<Text>Ngày Lập Lịch: {detailSchedule.scheduleDate}</Text>
// 			</Box>
// 				: <Button colorScheme="green" onClick={() => {
// 					setIsOpenAddSetting(true)
// 					setSelectSetting(originalData)
// 				}} mb={4}>Thêm chiến dịch mới</Button>
// 			}
// 			{settings && settings.length === 0 ? (
// 				<Flex
// 					flexDirection="column"
// 					alignItems="center"
// 					justifyContent="center"
// 					height="50vh"
// 				>
// 					<Box>
// 						<Text fontSize="xl" fontWeight="bold" textAlign="center" my={10}>
// 							Không tìm lượt huấn luyện nào
// 						</Text>
// 					</Box>
// 				</Flex>
// 			) : <>

// 				<Table {...getTableProps()} variant="striped" borderWidth="1px" borderRadius="md">
// 					<Thead>
// 						{headerGroups.map((headerGroup) => (
// 							<Tr {...headerGroup.getHeaderGroupProps()}>
// 								{headerGroup.headers.map((column) => (
// 									<Th textAlign="center"
// 										{...column.getHeaderProps(column.getSortByToggleProps())}
// 										onClick={(e) => {
// 											column.getSortByToggleProps().onClick(e);
// 										}}
// 										className={`${column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''} ${column.id === 'action' ? 'action-column' : ''
// 											}`}
// 									>
// 										{column.render('Header')}
// 										<span>{column.isSorted ? (column.isSortedDesc ? <ChevronDownIcon /> :
// 											<ChevronUpIcon />) : ''}</span>
// 									</Th>
// 								))}
// 							</Tr>
// 						))}
// 					</Thead>
// 					<Tbody {...getTableBodyProps()}>
// 						{page.map((row) => {
// 							prepareRow(row);
// 							return (
// 								<Tr {...row.getRowProps()} textAlign="center">
// 									{row.cells.map((cell) => {
// 										return (
// 											<Td textAlign="center" {...cell.getCellProps()}
// 												className={cell.column.id === 'action' ? 'action-column' : ''}>
// 												{cell.render('Cell')}
// 											</Td>
// 										);
// 									})}
// 								</Tr>
// 							);
// 						})}
// 					</Tbody>
// 				</Table>
// 				<FlexBox justifyContent="center" mt="2.5rem">
// 					<Pagination
// 						pageCount={Math.ceil(notifications.total / size)}
// 						onChange={(data) => {
// 							dispatch(
// 								getSettingAdmin({ size: size, page: (++data) })
// 							);
// 							setCurrentPage(++data);
// 							window.scrollTo(0, 0);
// 						}}
// 					/>
// 				</FlexBox>
// 			</>}
// 			<Modal isOpen={isOpenAddSetting} onClose={() => {
// 				setIsOpenAddSetting(false)
// 			}} isCentered>
// 				<ModalOverlay />
// 				<ModalContent maxW={'1200px'} >
// 					<ModalHeader style={{
// 						fontWeight: 'bold',
// 						fontSize: '20px',
// 						color: 'gray.800',
// 						textAlign: "center",
// 						marginTop: '20px'
// 					}}>
// 						{selectSetting && selectSetting.id ? "Thông tin chi tiết chiến dịch" : "Thêm chiến dịch"}
// 					</ModalHeader>
// 					<ModalCloseButton />
// 					<ModalBody>

// 						<Box m={4}>
// 							<FormControl id="campaign_topic" isRequired>
// 								<FormLabel>Setting Topic</FormLabel>
// 								<Input
// 									required
// 									value={selectSetting.campaign_topic}
// 									min="10"
// 									onChange={(e) => setSelectSetting({
// 										...selectSetting,
// 										campaign_topic: e.target.value
// 									})}
// 								/>
// 								<FormErrorMessage>{errors?.campaign_topic}</FormErrorMessage>
// 							</FormControl>
// 						</Box>

// 						<Box m={4}>
// 							<FormControl id="campaignName" isRequired>
// 								<FormLabel>Tiêu đề</FormLabel>
// 								<Input
// 									required
// 									value={selectSetting.title}
// 									min="10"
// 									onChange={(e) => setSelectSetting({
// 										...selectSetting,
// 										title: e.target.value
// 									})}
// 								/>
// 								<FormErrorMessage>{errors?.title}</FormErrorMessage>
// 							</FormControl>
// 						</Box>

// 						<Box m={4}>
// 							<FormControl id="campaign_code" isRequired>
// 								<FormLabel>Nội dung</FormLabel>
// 								<Box height="250px">
// 									<CKEditor
// 										editor={ClassicEditor}
// 										data={selectSetting.body}
// 										onReady={editor => {
// 											console.log('Editor is ready to use!', editor);
// 										}}
// 										onChange={(_, editor) => setSelectSetting({
// 											...selectSetting,
// 											body: editor.getData()
// 										})}
// 										onBlur={(_, editor) => {
// 											console.log('Blur.', editor);
// 										}}
// 										onFocus={(_, editor) => {
// 											console.log('Focus.', editor);
// 										}}
// 									/>
// 								</Box>
// 								<FormErrorMessage>{errors?.body}</FormErrorMessage>
// 							</FormControl>
// 						</Box>

// 						<Box m={4}>
// 							<FormControl id="image-upload" isRequired>
// 								<ImageUpload title="Ảnh" isMultiple={false}
// 									onFilesChange={(selectedFiles) => { setFiles(selectedFiles) }} />
// 							</FormControl>
// 						</Box>

// 						<Box mt={4} mx={4}>
// 							<FormControl id="description" isRequired>
// 								<FormLabel>Hẹn giờ</FormLabel>
// 								<Input
// 									required
// 									type="datetime-local"
// 									value={convertDateTimeYYYYMMDDHHMM(selectSetting.schedule_display)}
// 									onChange={(e) => setSelectSetting({
// 										...selectSetting,
// 										schedule_display: e.target.value
// 									})}
// 								/>
// 								<FormErrorMessage>{errors?.schedule_display}</FormErrorMessage>
// 							</FormControl>
// 						</Box>

// 						{selectSetting.id && selectSetting.is_active && <FormControl id="is_active">
// 							<Button
// 								bg={"red"}
// 								color={"white"}
// 								onClick={() => confirmRecallSetting(selectSetting)}
// 							> Recall</Button>
// 						</FormControl>}
// 					</ModalBody>
// 					<ModalFooter>
// 						<Flex justifyContent="center" alignItems="center" mt={4}>
// 							<Button colorScheme="teal" mr={4} onClick={() => setIsOpenAddSetting(false)}>
// 								{Action.CLOSE}
// 							</Button>
// 							{isBlank(selectSetting.id) && <Button
// 								isDisabled={
// 									isBlank(selectSetting.title)
// 									|| isBlank(selectSetting.body)
// 									|| isBlank(selectSetting.campaign_topic)
// 									|| isBlank(selectSetting.schedule_display)
// 									|| (files.length === 0)
// 								}
// 								colorScheme="red" onClick={handleAddSetting}>
// 								{Action.ADD}
// 							</Button>}
// 						</Flex>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>

// 			<Modal isCentered isOpen={isOpenConfirmRecall} onClose={() => setIsOpenConfirmRecall(false)}>
// 				<ModalOverlay />
// 				<ModalContent>
// 					<ModalHeader>Thu hồi chiến dịch</ModalHeader>
// 					<ModalCloseButton />
// 					<ModalBody>
// 						<Text>Bạn có chắc muốn thu hồi chiến dịch?</Text>
// 						<Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Nhập lý do thu hồi" mt={3} /> {/* Add this line */}
// 					</ModalBody>
// 					<ModalFooter>
// 						<Button colorScheme="blue" mr={3} onClick={() => setIsOpenConfirmRecall(false)}>
// 							{Action.CLOSE}
// 						</Button>
// 						<Button isDisabled={isBlank(reason) || reason.length < 5} variant="ghost" onClick={recallSetting}>
// 							{Action.RECALL}
// 						</Button>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</div >
// 	);
// }

// export default SettingsAdmin;
