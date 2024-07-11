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
import { getColorStatusOrder, getOrderStatusIcon, getStrStatusOrder } from "@/utils/utils";
import { useMediaQuery, Icon as CharkraIcon, Tooltip } from "@chakra-ui/react";

export interface OrderRowAdminProps {
	order: ItemSearchStoreOrder;
}

const OrderRowAdmin: React.FC<OrderRowAdminProps> = ({ order }) => {

	const navigate = useNavigate();

	const handleNavigateOrderDetail = () => {
		navigate(`/admin/orders/${order.order_id}`);
	}

	const [isMobile] = useMediaQuery('(max-width: 768px)');

	return (
		<TableRow as="a" onClick={handleNavigateOrderDetail} my="1rem" padding="6px 18px"
			_hover={{
				cursor: "pointer"
			}}
		>
			<H5 m="6px" textAlign="left">
				{order.order_id.toUpperCase()}
			</H5>
			<Box m="6px" display={isMobile ? "flex" : ""} justifyContent="center">
				<Chip p="0.25rem 1rem" bg={`${getColorStatusOrder(order.status)}.light`}>
					{isMobile ?
						<Tooltip label={getStrStatusOrder(order.status)} aria-label="A tooltip">
							<CharkraIcon as={getOrderStatusIcon(order.status)} />
						</Tooltip> :
						<Small textAlign="center"
							color={`${getColorStatusOrder(order.status)}.main`}>{getStrStatusOrder(order.status)}
						</Small>
					}
				</Chip>
			</Box>
			<Typography className="flex-grow pre" m="6px" textAlign="left">
				{format(new Date(order.created_at), " dd, MMM yyyy", { locale: vi })}
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
		</TableRow >
	);
};

export default OrderRowAdmin;
