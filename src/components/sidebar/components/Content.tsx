// chakra imports
import {Box, Flex, Stack} from '@chakra-ui/react';
import {RoutesType} from 'api/interface/interface';
//   Custom components
import Brand from '../../sidebar/components/Brand';
import Links from '../../sidebar/components/Links';

// FUNCTIONS

function SidebarContent(props: { routes: RoutesType[] }) {
  const {routes} = props;
  // SIDEBAR
  return (
      <Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
        <Brand/>
        <Stack direction='column' mt='8px' mb='auto'>
          <Box ps='20px' pe={{lg: '16px', '2xl': '16px'}}>
            <Links routes={routes}/>
          </Box>
        </Stack>
      </Flex>
  );
}

export default SidebarContent;
