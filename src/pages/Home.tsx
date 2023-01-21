import { IonButton, IonChip, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router';
import { useRecoilState } from 'recoil';
import { AuthStateAtom } from '../atoms/AuthState.atom';
import { AuthService } from '../services/Auth.service';

const Home: React.FC = () => {
  const history = useHistory();
  const [isLogin, setIsLogin] = useRecoilState<boolean>(AuthStateAtom);
  const service: AuthService = new AuthService();

  const onClickLogoutBtn = async () => {
    await service.logout();
    setIsLogin(false);
    history.push("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonText>
          <IonChip color={isLogin ? "success" : "danger"}>
            {isLogin ? "you are authrized" : "not login"}
          </IonChip>

          <IonButton onClick={onClickLogoutBtn}>Logout</IonButton>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Home;
