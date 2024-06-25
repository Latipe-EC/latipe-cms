import { ItemVoucher } from "@/api/interface/promotion";
import {
	Button, Modal, ModalOverlay, ModalContent, ModalHeader
	, ModalCloseButton, ModalBody, ModalFooter, Text, VStack, HStack, Badge,
	Heading
} from "@chakra-ui/react";
import { FaCalendarAlt, FaInfoCircle, FaPercentage, FaTag } from "react-icons/fa";

interface VoucherModalProps {
	isOpen: boolean;
	onClose: () => void;
	voucher: ItemVoucher;
}

const FIXED_DISCOUNT = 0;
const PERCENT_DISCOUNT = 1;

export const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, onClose, voucher }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader bg="blue.500" color="white">
					<Heading size="lg">{voucher.voucher_code}</Heading>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack align="start" spacing={4}>
						<HStack spacing={2}>
							<FaInfoCircle />
							<Text fontWeight="bold" fontSize="md">Chi tiết:</Text>
							<Text>{voucher.detail}</Text>
						</HStack>
						<HStack spacing={2}>
							<FaCalendarAlt />
							<Text fontWeight="bold" fontSize="md">Thời gian bắt đầu:</Text>
							<Text>{voucher.stated_time}</Text>
						</HStack>
						<HStack spacing={2}>
							<FaCalendarAlt />
							<Text fontWeight="bold" fontSize="md">Thời gian kết thúc:</Text>
							<Text>{voucher.ended_time}</Text>
						</HStack>
						<HStack spacing={2}>
							<FaTag />
							<Text fontWeight="bold" fontSize="md">Yêu cầu tối thiểu:</Text>
							<Text>{voucher.voucher_require.min_require}</Text>
						</HStack>
						<HStack spacing={2}>
							<FaTag />
							<Text fontWeight="bold" fontSize="md">Số lượng voucher tối đa mỗi người dùng:</Text>
							<Text>{voucher.voucher_require.max_voucher_per_user}</Text>
						</HStack>
						{voucher.discount_data.discount_type === FIXED_DISCOUNT && (
							<HStack spacing={2}>
								<FaTag />
								<Text fontWeight="bold" fontSize="md">Giá trị giảm:</Text>
								<Badge colorScheme="green">{voucher.discount_data.discount_value.toLocaleString('vi-VN')}₫</Badge>
							</HStack>
						)}
						{voucher.discount_data.discount_type === PERCENT_DISCOUNT && (
							<VStack align="start" spacing={2}>
								<HStack spacing={2}>
									<FaPercentage />
									<Text fontWeight="bold" fontSize="md">Phần trăm giảm:</Text>
									<Badge colorScheme="green">{voucher.discount_data.discount_percent}%</Badge>
								</HStack>
								<HStack spacing={2}>
									<FaPercentage />
									<Text fontWeight="bold" fontSize="md">Giá trị giảm tối đa:</Text>
									<Badge colorScheme="green">{voucher.discount_data.maximum_value.toLocaleString('vi-VN')}₫</Badge>
								</HStack>
							</VStack>
						)}
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={onClose}>
						Đóng
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};