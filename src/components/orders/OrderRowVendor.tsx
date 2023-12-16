import {format} from "date-fns";
import React from "react";
import Box from "../Box";
import IconButton from "../buttons/IconButton";
import {Chip} from "../Chip";
import Hidden from "../hidden/Hidden";
import Icon from "../icon/Icon";
import TableRow from "../TableRow";
import Typography, {H5, Small} from "../Typography";
import {ItemSearchStoreOrder} from "api/interface/order";
import {useNavigate} from "react-router-dom";

export interface OrderRowVendorProps {
  order: ItemSearchStoreOrder;
}

const OrderRowVendor: React.FC<OrderRowVendorProps> = ({order}) => {

  const navigate = useNavigate();

  const handleNavigateOrderDetail = () => {
    navigate(`/vendor/orders/${order.order_uuid}`);
  }

  const handleRenderStaus = (): string => {
    switch (order.status) {
      case 0:
        return "Đang xử lý";
      case 1:
        return "Tạo đơn hàng thành công";
      case 2:
        return "Đã giao cho ĐVVC";
      case 3:
        return "Đang trên đường vận chuyển";
      case 4:
        return "Vận chuyển thành công";
      case 5:
        return "Đơn hàng đã hoàn thành";
      case 6:
        return "Đang hoàn tiền";
      case 7:
        return "Đã hủy";
      default:
        return "Mua hàng thất bại";
    }

  }

  const getColor = (status) => {
    switch (status) {
      case 0:
      case 1:
        return "secondary";
      case 2:
      case 3:
        return "secondary";
      case 4:
      case 5:
      case 6:
        return "success";
      case 7:
      case -1:
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
          {order.order_uuid}
        </H5>
        <Box m="6px">
          <Chip p="0.25rem 1rem" bg={`${getColor(order.status)}.light`}>
            <Small textAlign="center"
                   color={`${getColor(order.status)}.main`}>{handleRenderStaus()}</Small>
          </Chip>
        </Box>
        <Typography className="flex-grow pre" m="6px" textAlign="left">
          {format(new Date(order.created_at), "MMM dd, yyyy")}
        </Typography>
        {/* <Typography m="6px" textAlign="left">
				{order.amount.toLocaleString('vi-VN')}₫
			</Typography> */}

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

export default OrderRowVendor;
