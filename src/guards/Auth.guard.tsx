import { FC } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useRecoilValue } from "recoil"
import { AuthStateAtom } from "../atoms/AuthState.atom"
import { LoadingAtom } from "../atoms/Loading.atom";

export const PrivateRoute: FC<RouteProps> = ({ component, ...rest }) => {
    const isLogIn: boolean = useRecoilValue<boolean>(AuthStateAtom);
    const isLoading: boolean = useRecoilValue<boolean>(LoadingAtom);

    console.log(`loading:${isLoading} - login:${isLogIn}`);

    if (isLogIn) {
        return (<Route component={component} {...rest} />);
    } else {
        return (<Redirect to="/login" />);
    }
}