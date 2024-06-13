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

type LazyImageProps =
	React.ImgHTMLAttributes<HTMLImageElement>
	& BorderProps
	& SpaceProps
	& ColorProps
	& LayoutProps
	& { objectFit?: string }; // Add objectFit property to the type definition

const LazyImage = styled(({ borderRadius, objectFit, ...props }: LazyImageProps) => {
	return <Image style={{ borderRadius: borderRadius ? borderRadius.toString() : undefined, objectFit }} {...props} />;
}) <React.ImgHTMLAttributes<HTMLImageElement>>`
		display: block;
	
		${color}
		${space}
		${border}
	`;

export default LazyImage;