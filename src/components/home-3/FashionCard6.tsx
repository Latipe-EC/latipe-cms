import { vi } from "date-fns/locale";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import LazyImage from "../LazyImage";
import { H3, Paragraph, SemiSpan, Small } from "../Typography";
import { format } from "date-fns";
import React from "react";

export interface FashionCard6Props {
	imgUrl: string;
	title: string;
	date: string;
	commentCount: number;
	description: string;
	blogUrl: string;
}

const FashionCard6: React.FC<FashionCard6Props> = ({
	imgUrl,
	title,
	date,
	commentCount,
	description,
	blogUrl,
}) => {
	return (
		<Box>
			<Box mb="1.5rem">
				<LazyImage
					src={imgUrl}
					width={588}
					height={272}
					layout="responsive"
					borderRadius={4}
				/>
			</Box>
			<H3 fontWeight="600" mb="0.25rem">
				{title}
			</H3>

			<FlexBox flexWrap="wrap" alignItems="center" mb="1rem">
				<FlexBox alignItems="center" mr="0.75rem">
					<Icon size="14px" mr="0.5rem" defaultcolor="auto">
						clock-circular-outline
					</Icon>
					<SemiSpan color="text.muted">
						{format(new Date(date), "dd MMMM, yyyy", { locale: vi })}
					</SemiSpan>
				</FlexBox>
				<FlexBox alignItems="center">
					<Box color="text.muted" mr="0.5rem">
						<Icon size="14px" defaultcolor="currentColor">
							comment
						</Icon>
					</Box>
					<SemiSpan color="text.muted">{commentCount} comments</SemiSpan>
				</FlexBox>
			</FlexBox>

			<Paragraph color="gray.700" mb="0.75rem">
				{description}
			</Paragraph>
			<a href={blogUrl}>
				<Small
					fontWeight="700"
					borderBottom="2px solid"
					borderColor="primary.main"
				>
					CONTINUE READING
				</Small>
			</a>
		</Box>
	);
};

export default FashionCard6;
