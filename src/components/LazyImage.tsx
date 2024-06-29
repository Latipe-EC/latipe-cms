import React from 'react';
import { Image } from 'react-bootstrap';
import styled from 'styled-components';
import {
	border,
	BorderProps,
	color,
	ColorProps,
	LayoutProps,
	space,
	SpaceProps,
} from 'styled-system';
import { CSSProperties } from 'react'; // Import CSSProperties type

type LazyImageProps =
	React.ImgHTMLAttributes<HTMLImageElement> &
	BorderProps &
	SpaceProps &
	ColorProps &
	LayoutProps & {
		objectFit?: CSSProperties['objectFit']; // Use CSSProperties type for objectFit
		borderRadius?: CSSProperties['borderRadius']; // Use CSSProperties type for borderRadius
	};

const LazyImage = styled(({ objectFit, borderRadius, ...props }: LazyImageProps) => {
	// Explicitly declare the style object with CSSProperties type
	const style: CSSProperties = { objectFit, borderRadius };
	return <Image {...props} style={style} />;
}) <React.ImgHTMLAttributes<HTMLImageElement>>`
  display: block;
  ${color}
  ${space}
  ${border}
`;

export default LazyImage;