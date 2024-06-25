import { format } from "date-fns";
import React from "react";
import { vi } from "date-fns/locale";
import { ItemVoucher } from "@/api/interface/promotion";
import TableRow from "@/components/TableRow";
import Typography, { H5, Small } from "@/components/Typography";
import { Box, IconButton } from "@chakra-ui/react";
import { Chip } from "@/components/Chip";
import Hidden from "@/components/hidden/Hidden";
import { ViewIcon } from "@chakra-ui/icons";
import { VoucherStatus } from "@/utils/constants";

export interface VoucherRowVendorProps {
	voucher: ItemVoucher;
	showDetail: (voucher: ItemVoucher) => void;
}

const VoucherRow: React.FC<VoucherRowVendorProps> = ({ voucher, showDetail }) => {
	return (
		<TableRow onClick={() => { showDetail(voucher) }} my="1rem" padding="6px 18px"
			_hover={{
				cursor: "pointer"
			}}
		>
			<H5 m="6px" textAlign="left">
				{voucher.voucher_code}
			</H5>
			<Box m="6px">
				<Chip p="0.25rem 1rem" bg={`success.light`}>
					<Small textAlign="center"
						color={`success.main`}>{voucher.voucher_counts}</Small>
				</Chip>
			</Box>

			<Box m="6px">
				<Chip p="0.25rem 1rem" bg={`success.light`}>
					<Small textAlign="center"
						color={`success.main`}>{voucher.total_counts - voucher.voucher_counts}</Small>
				</Chip>
			</Box>

			<Typography className="flex-grow pre" m="6px" textAlign="left">
				{format(new Date(voucher.ended_time), "dd, MMM yyyy hh:mm:ss", { locale: vi })}
			</Typography>

			<Box m="6px">
				<Chip p="0.25rem 1rem" bg={`${voucher.status === VoucherStatus.ACTIVE ? 'success' : 'error'}.light`}>
					<Small textAlign="center"
						color={`${voucher.status === VoucherStatus.ACTIVE ? 'success' : 'error'}.main`}>{voucher.status === VoucherStatus.ACTIVE ? "hoạt động" : "vô hiệu"}</Small>
				</Chip>
			</Box>
			<Hidden flex="0 0 0 !important" down={769}>
				<Typography textAlign="center" color="text.muted">
					<IconButton size="small" aria-label="View details" icon={<ViewIcon />}>
					</IconButton>
				</Typography>
			</Hidden>
		</TableRow>
	);
};

export default VoucherRow;
