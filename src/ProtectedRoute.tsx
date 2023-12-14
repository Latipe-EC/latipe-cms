import { Navigate, Route, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ roles, children, ...props }) => {
	const user = JSON.parse(localStorage.getItem('REACT_STARTER_AUTH'));
	const location = useLocation();

	if (!user || !roles.includes(user.role)) {
		return <Navigate to="/login" state={{ from: location }} />;
	}

	return <Route {...props}>{children}</Route>;
};

export default ProtectedRoute;