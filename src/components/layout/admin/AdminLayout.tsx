// Chakra imports
import { Box, Portal, useDisclosure } from '@chakra-ui/react';
// Layout components
import Navbar from '../../navbar/NavbarAdmin';
import Sidebar from '../../sidebar/Sidebar';
import { useState } from 'react';
import { RoutesType } from 'api/interface/interface';
import routes from './routes.tsx';
import { Navigate, useLocation } from 'react-router-dom';

export default function Dashboard() {
	// states and functions
	const [fixed] = useState(false);
	const { onOpen } = useDisclosure();
	const user = JSON.parse(localStorage.getItem('REACT_STARTER_AUTH'));
	const location = useLocation();

	if (!user || user.role !== 'ADMIN') {
		localStorage.clear();
		return <Navigate to="/login" state={{ from: location }} />;
	}


	const getActiveRoute = (routes: RoutesType[]): string => {
		const activeRoute = 'Latipe Admin';
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return activeRoute;
	};
	const getActiveNavbar = (routes: RoutesType[]): boolean => {
		const activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].secondary;
			}
		}
		return activeNavbar;
	};
	const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
		const activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return activeNavbar;
	};

	document.documentElement.dir = 'ltr';
	return (
		<Box>

			<Sidebar routes={routes} />
			<Box
				float='right'
				minHeight='100vh'
				height='100%'
				overflow='auto'
				position='relative'
				maxHeight='100%'
				w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
				maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
				transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
				transitionDuration='.2s, .2s, .35s'
				transitionProperty='top, bottom, width'
				transitionTimingFunction='linear, linear, ease'>
				<Portal>
					<Box>
						<Navbar
							onOpen={onOpen}
							logoText={'Horizon UI Dashboard PRO'}
							brandText={getActiveRoute(routes)}
							secondary={getActiveNavbar(routes)}
							message={getActiveNavbarText(routes)}
							fixed={fixed}
						/>
					</Box>
				</Portal>
			</Box>
		</Box>
	);
}
