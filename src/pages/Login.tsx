import { IonButton, IonChip, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import { AuthStateAtom } from "../atoms/AuthState.atom";
import { AuthService } from "../services/Auth.service";

export const LogIn = () => {
    const service: AuthService = new AuthService();
    const [isLogin, setIsLogin] = useRecoilState<boolean>(AuthStateAtom);

    const history = useHistory();

    const [user, setUser] = useState<any>();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onClickLoginBtn = async () => {
        setUser(await service.login(email, password));
        setIsLogin(true);
        history.push("/home");
    }

    const onClickLogoutBtn = async () => {
        await service.logout();
        setIsLogin(false);
    };


    useEffect(() => {
        (async () => {
            const isLogin: boolean = await service.isLogin();
            setIsLogin(isLogin);
            console.log(isLogin);
        })();
    }, []);

    useEffect(() => {
        console.log("user:" + user);
    }, [user]);

    return (
        <IonPage>
            <IonToolbar>
                <IonTitle>
                    LogIn
                </IonTitle>
            </IonToolbar>
            <IonContent>
                <IonGrid>

                    <IonText>
                        <IonChip color={isLogin ? "success" : "dark"}>
                            {isLogin ? "login" : "not login"}
                        </IonChip>
                    </IonText>

                    <IonList>
                        <IonItem>
                            <IonLabel>Email</IonLabel>
                            <IonInput type="email" value={email} onIonChange={(e: any) => setEmail(e.target.value)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Password</IonLabel>
                            <IonInput type="password" value={password} onIonChange={(e: any) => { setPassword(e.target.value) }}></IonInput>
                        </IonItem>
                    </IonList>


                    <IonRow>
                        <IonCol>
                            <IonButton onClick={onClickLoginBtn}>LogIn</IonButton>
                        </IonCol>

                        <IonCol>
                            <IonButton onClick={onClickLogoutBtn}>LogOut</IonButton>
                        </IonCol>
                    </IonRow>


                </IonGrid>
            </IonContent>
        </IonPage>
    )
}