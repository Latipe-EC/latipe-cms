import { format } from "date-fns";
import React from "react";
import Box from "../Box";
import IconButton from "../buttons/IconButton";
import { Chip } from "../Chip";
import Hidden from "../hidden/Hidden";
import Icon from "../icon/Icon";
import TableRow from "../TableRow";
import Typography, { H5, Small } from "../Typography";
import { ItemSearchStoreOrder } from "@interfaces/order";
import { useNavigate } from "react-router-dom";
import { vi } from "date-fns/locale";
import { OrderStatus } from "@/utils/constants";

export interface OrderRowAdminProps {
	order: ItemSearchStoreOrder;
}

const OrderRowAdmin: React.FC<OrderRowAdminProps> = ({ order }) => {

	const navigate = useNavigate();

	const handleNavigateOrderDetail = () => {
		navigate(`/admin/orders/${order.order_id}`);
	}

	const handleRenderStaus = (): string => {
		switch (order.status) {
			case OrderStatus.ORDER_SYSTEM_PROCESS:
				return "Đang xử lý đơn hàng";
			case OrderStatus.ORDER_CREATED:
				return "Tạo đơn hàng thành công";
			case OrderStatus.ORDER_PREPARED:
				return "Đang chuẩn bị đơn hàng";
			case OrderStatus.ORDER_DELIVERY:
				return "Đang trên đường vận chuyển";
			case OrderStatus.ORDER_SHIPPING_FINISH:
				return "Vận chuyển thành công";
			case OrderStatus.ORDER_COMPLETED:
				return "Đơn hàng đã hoàn thành";
			case OrderStatus.ORDER_REFUND:
				return "Đang hoàn tiền";
			case OrderStatus.ORDER_CANCEL_BY_USER:
				return "Đã hủy bởi khách hàng";
			case OrderStatus.ORDER_CANCEL_BY_ADMIN:
				return "Đã hủy bởi admin";
			case OrderStatus.ORDER_CANCEL_BY_STORE:
				return "Đã hủy bởi người bán";
			case OrderStatus.ORDER_CANCEL_BY_DELI:
				return "Đã hủy bởi người giao hàng";
			case OrderStatus.ORDER_CANCEL_USER_REJECT:
				return "Khách hàng từ chối nhận đơn hàng";
			case OrderStatus.ORDER_FAILED:
				return "Mua hàng thất bại";
		}
	}

	const getColor = (status) => {
		switch (status) {
			case OrderStatus.ORDER_SYSTEM_PROCESS:
			case OrderStatus.ORDER_PREPARED:
			case OrderStatus.ORDER_DELIVERY:
			case OrderStatus.ORDER_REFUND:
				return "secondary";
			case OrderStatus.ORDER_CREATED:
			case OrderStatus.ORDER_SHIPPING_FINISH:
			case OrderStatus.ORDER_COMPLETED:
				return "success";
			case OrderStatus.ORDER_CANCEL_BY_USER:
			case OrderStatus.ORDER_CANCEL_BY_ADMIN:
			case OrderStatus.ORDER_CANCEL_BY_STORE:
			case OrderStatus.ORDER_CANCEL_BY_DELI:
			case OrderStatus.ORDER_CANCEL_USER_REJECT:
			case OrderStatus.ORDER_FAILED:
				return "error";
			default:
				return "";
		}
	};

	return (
		<TableRow as="a" onClick={handleNavigateOrderDetail} my="1rem" padding="6px 18px"
			_hover={{
				cursor: "pointer"
			}}
		>
			<H5 m="6px" textAlign="left">
				{order.order_id}
			</H5>
			<Box m="6px">
				<Chip p="0.25rem 1rem" bg={`${getColor(order.status)}.light`}>
					<Small textAlign="center"
						color={`${getColor(order.status)}.main`}>{handleRenderStaus()}</Small>
				</Chip>
			</Box>
			<Typography className="flex-grow pre" m="6px" textAlign="left">
				{format(new Date(order.created_at), "MMM dd, yyyy", { locale: vi })}
			</Typography>
			<Hidden flex="0 0 0 !important" down={769}>
				<Typography textAlign="center" color="text.muted">
					<IconButton size="small">
						<Icon variant="small" defaultcolor="currentColor">
							arrow-right
						</Icon>
					</IconButton>
				</Typography>
			</Hidden>
		</TableRow>
	);
};

export default OrderRowAdmin;
