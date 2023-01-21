import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { LogIn } from './pages/Login';
import { PrivateRoute } from './guards/Auth.guard';
import { useLayoutEffect } from 'react';
import { AuthService } from './services/Auth.service';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AuthStateAtom } from './atoms/AuthState.atom';
import { LoadingAtom } from './atoms/Loading.atom';

setupIonicReact();

const App: React.FC = () => {
  const setIsLogIn = useSetRecoilState(AuthStateAtom);
  const [loading, setLoading] = useRecoilState(LoadingAtom);
  const authService: AuthService = new AuthService();

  useLayoutEffect(() => {
    (async () => {
      setIsLogIn(await authService.isLogin());
      setLoading(false);
    })();
  }, []);

  //こうしておかないと、firebase初期化前にログインチェック処理が走り必ずloginページに飛んでしまう
  if (loading) {
    return (<>Loading...</>)
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            {/* <Home /> */}
            <PrivateRoute component={Home} />
          </Route>
          <Route exact path="/">
            <PrivateRoute component={Home} />
            {/* <Redirect to="/login" /> */}
          </Route>
          <Route exact path="/login">
            <LogIn />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
