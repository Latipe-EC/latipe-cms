import React, { useEffect, useRef, useState } from 'react';
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
	Input,
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
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImageUpload from '@/components/upload-image/ImageUpload';
import { handleApiCallWithToast, isBlank } from '@/utils/utils';
import { createCampaign, getCampaignAdmin } from '@/stores/slices/notification-slice';
import { Chip } from '@/components/Chip';
import { Small } from '@/components/Typography';
import { Action, ContentToast, TitleToast } from '@/utils/constants';
import { AppThunkDispatch } from '@/stores/store';
import { GeneralCampaignAdminResponse, ListCampaignDetail } from '@/api/interface/notification';
import './index.css';

type ErrorProps = {
	title?: string,
	body?: string,
	schedule_display?: string
}
const CampaignsAdmin = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch<AppThunkDispatch>();
	const initialized = useRef(false)
	const [selectCampaign, setSelectCampaign] = useState(null);
	const [selectRecallCampaign, setSelectRecallCampaign] = useState(null);
	const [errors, setErrors] = useState<ErrorProps>();
	const toast = useToast();
	const [response, setResponse] = useState<GeneralCampaignAdminResponse<ListCampaignDetail>>();
	const [files, setFiles] = useState<File[]>([]);
	const [isOpenConfirmRecall, setIsOpenConfirmRecall] = useState(false);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true
			dispatch(getCampaignAdmin({
				"size": 12,
				"page": 0
			}))
				.unwrap().then((res) => {
					if (res.status !== 200) {
						navigate('/401')
						return;
					}
					setResponse(res.data);
				});
		}
	}, []);
	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				Cell: ({ row }) => {
					const rowIndex = row.index + 1;
					return <div>{rowIndex}</div>;
				},
			},
			{
				Header: 'Tên',
				accessor: 'title',
				width: 100,
			},
			{
				Header: 'Giờ kích hoạt',
				accessor: 'schedule_display',
				Cell: ({ value }) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							{value}
						</div>
					);
				},
			},
			{
				Header: 'Hoạt động',
				Cell: ({ row }) => {
					const item = row.original;
					const now = new Date();
					const activationTime = new Date(item.schedule_display);
					const label = activationTime < now ? 'Đã gửi' : 'Chưa gửi';

					return (
						<Box m="6px">
							<Chip p="0.25rem 1rem" bg="green">
								<Small textAlign="center" color="white" fontWeight="bold">
									{label}
								</Small>
							</Chip>
						</Box>
					);
				},
			},
			{
				Header: 'Trạng thái',
				accessor: 'is_active',
				Cell: ({ value, row }) => {
					const item = row.original;
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<Box m="6px">
								{!value ? (
									<Chip p="0.25rem 1rem" bg="red">
										<Small textAlign="center" color="white" fontWeight="bold">
											{Action.RECALLED}
										</Small>
									</Chip>
								) : (
									<Button colorScheme="blue" onClick={confirmRecallCampaign(item)}>
										{Action.RECALL}
									</Button>
								)}
							</Box>
						</div>
					);
				},
			},
			{
				Header: 'xem',
				Cell: ({ row }) => {
					const item = row.original;
					return (
						<Flex justifyContent={'center'}>
							<ButtonGroup spacing="4">
								<Button colorScheme="green" onClick={() => setSelectCampaign(item)}>
									{Action.VIEW_DETAIL}
								</Button>
							</ButtonGroup>
						</Flex>
					);
				},
			},
		],
		[response]
	);

	const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
		{
			columns,
			data: response && response.data.items ? response.data.items : [],
			initialState: { pageIndex: 0 },
			manualPagination: true,
			pageCount: response ? Math.ceil(response.data.total / response.data.size) : 0,
			manualSortBy: true,
		},
		useSortBy,
		usePagination
	);

	const validate = () => {
		const newErrors: ErrorProps = {};

		if (isBlank(selectCampaign.title)) {
			newErrors.title = 'Hãy nhập tiêu đề';
		}

		if (isBlank(selectCampaign.body)) {
			newErrors.body = 'Hãy nhập nội dung';
		}

		if (isBlank(selectCampaign.schedule_display)) {
			newErrors.schedule_display = 'Hãy nhập hẹn giờ';
		}


		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const confirmRecallCampaign = (item) => () => {
		setSelectRecallCampaign(item);
		setIsOpenConfirmRecall(true);
	}

	const recallCampaign = () => () => {

		if (!validate()) {
			return;
		}

		handleApiCallWithToast(dispatch,
			recallCampaign,
			selectRecallCampaign.id,
			null,
			TitleToast.ADD_CATEGORY,
			TitleToast.SUCCESS,
			ContentToast.ADD_CATEGORY_SUCCESS,
			TitleToast.ERROR,
			ContentToast.ADD_CATEGORY_ERROR,
			null,
			toast,
			<Spinner />,
			() => {
				setIsOpenConfirmRecall(false)
			})
	}

	const handleAddCampaign = () => {
		handleApiCallWithToast(dispatch,
			createCampaign,
			{ data: { ...selectCampaign }, file: files[0] },
			null,
			TitleToast.ADD_CAMPAIGN,
			TitleToast.SUCCESS,
			ContentToast.ADD_CAMPAIGN_SUCCESS,
			TitleToast.ERROR,
			ContentToast.ADD_CAMPAIGN_ERROR,
			null,
			toast,
			<Spinner />,
			null)
	}

	return (
		<div>
			{response && response.data.total === 0 ? (
				<Flex
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
					height="50vh"
				>
					<Box>
						<Text fontSize="xl" fontWeight="bold" textAlign="center" my={10}>
							Không tìm thấy chiến dịch nào
						</Text>
					</Box>
				</Flex>
			) : <>
				<Button colorScheme="green" onClick={() => setSelectCampaign({
					id: '',
					title: '',
					body: '',
					schedule_display: '',
				})} mb={4}>Thêm chiến dịch mới</Button>
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
				{
					selectCampaign && <Modal isOpen={selectCampaign !== null} onClose={() => {
						setSelectCampaign(null)
					}} isCentered>
						<ModalOverlay />
						<ModalContent maxW={'1200px'} style={{ height: '1000px' }}>
							<ModalHeader style={{
								fontWeight: 'bold',
								fontSize: '20px',
								color: 'gray.800',
								textAlign: "center",
								marginTop: '20px'
							}}>
								{selectCampaign._id ? "Thông tin chi tiết chiến dịch" : "Thêm chiến dịch"}
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>

								<Box m={4}>
									<FormControl id="campaignName" isRequired>
										<FormLabel>Tiêu đề</FormLabel>
										<Input
											required
											value={selectCampaign.title}
											min="10"
											onChange={(e) => setSelectCampaign({
												...selectCampaign,
												title: e.target.value
											})}
										/>
										<FormErrorMessage>{errors?.title}</FormErrorMessage>
									</FormControl>
								</Box>

								<Box m={4}>
									<FormControl id="campaign_code" isRequired>
										<FormLabel>Nội dung</FormLabel>
										<div style={{ height: '450px' }}>
											<CKEditor
												editor={ClassicEditor}
												data={selectCampaign.body}
												onReady={editor => {
													console.log('Editor is ready to use!', editor);
												}}
												onChange={(_, editor) => setSelectCampaign({
													...selectCampaign,
													body: editor.getData()
												})}
												onBlur={(_, editor) => {
													console.log('Blur.', editor);
												}}
												onFocus={(_, editor) => {
													console.log('Focus.', editor);
												}}
											/>
										</div>
										<FormErrorMessage>{errors?.body}</FormErrorMessage>
									</FormControl>
								</Box>

								<Box m={4}>
									<FormControl id="image-upload" isRequired>
										<ImageUpload title="Ảnh" isMultiple={false}
											onFilesChange={(selectedFiles) => { setFiles(selectedFiles) }} />
									</FormControl>
								</Box>

								<Box mt={4}>
									<FormControl id="description" isRequired>
										<FormLabel>Hẹn giờ</FormLabel>
										<Input
											required
											type="datetime-local"
											value={selectCampaign.schedule_display}
											onChange={(e) => setSelectCampaign({
												...selectCampaign,
												schedule_display: e.target.value
											})}
										/>
										<FormErrorMessage>{errors?.schedule_display}</FormErrorMessage>
									</FormControl>
								</Box>

								{selectCampaign.id && <FormControl id="is_active">
									<Button
										bg={selectCampaign.is_active ? "red" : "green"}
										color={"white"}
										disabled={!selectCampaign.is_active}
										onClick={() => confirmRecallCampaign(selectCampaign)}
									>{selectCampaign.is_active ? "recall" : "active"}</Button>
								</FormControl>}
							</ModalBody>
							<ModalFooter>
								<Flex justifyContent="center" alignItems="center" mt={4}>
									<Button colorScheme="teal" mr={4} onClick={() => {
										setSelectCampaign(null)
									}}>
										{Action.CLOSE}
									</Button>
									{isBlank(selectCampaign.id) && <Button
										isDisabled={
											isBlank(selectCampaign.title)
											|| isBlank(selectCampaign.body)
											|| isBlank(selectCampaign.schedule_display)
											|| (files.length === 0)
										}
										colorScheme="red" onClick={handleAddCampaign}>
										{Action.ADD}
									</Button>}
								</Flex>
							</ModalFooter>
						</ModalContent>
					</Modal>
				}
				<Modal isOpen={isOpenConfirmRecall} onClose={() => setIsOpenConfirmRecall(false)}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Thu hồi chiến dịch</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Text>Bạn có chắc muốn thu hồi chiến dịch?</Text>
						</ModalBody>
						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={() => setIsOpenConfirmRecall(false)}>
								{Action.CLOSE}
							</Button>
							<Button variant="ghost" onClick={recallCampaign}>
								{Action.RECALL}
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>}
		</div >
	);
}

export default CampaignsAdmin;
