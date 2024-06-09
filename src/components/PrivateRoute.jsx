import { Route, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user, loading } = useAuth();
    let redirect = useNavigate()

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Route
            {...rest}
            render={props =>
                user ? (
                    <Component {...props} />
                ) : (
                    redirect("/login")
                )
            }
        />
    );
};

export default PrivateRoute;
