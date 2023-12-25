// Chakra imports
import { Flex, Image } from '@chakra-ui/react';

// Custom components
import { HSeparator } from '../../separator/Separator';

export function SidebarBrand() {
	//   Chakra color mode
	return (
		<Flex alignItems='center' flexDirection='column'>
			<Image src="/assets/images/latipe_logo.jpeg" pb={4}></Image>
			<HSeparator mb='20px' />
		</Flex>
	);
}

export default SidebarBrand;
