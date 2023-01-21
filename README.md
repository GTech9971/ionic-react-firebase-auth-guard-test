# 環境

[package.json](/package.json)

- `@ionic/react": "^6.0.0`
- `recoil": "^0.7.6`
- `@capacitor/core: 4.6.2`
- `@types/react": "^18.0.17`
- `firebase": "^9.16.0"`

## capacitor.config.jsの設定
[capacitor.config.js](/capacitor.config.ts)
以下の設定を追加する
```
"plugins": {
    "FirebaseAuthentication": {
      "skipNativeAuth": false,
      "providers": ["apple.com", "facebook.com"]
    }
  }
```

## ビルドフォルダの生成
`ionic build --prod`

`ionic integrations enable capacitor`

`ionic cap sync ios`

### pod関連でエラー発生！ 
ionic cap sync iosでエラーが発生 [3]
以下のコマンドで解決した。

1. `sudo gem pristine ffi --version 1.15.4` [1]
2. `pod repo update` [2]
3. `cd ios` [2]
4. `pod repo update` [2]
5. `sudo gem install cocoapods`
6. `ionic cap sync ios`

#### 参考
- [1] [【CocoaPods:Error】Ignoring ffi-1.15.5 because its extensions are not built. Try: gem pristine ffi --version 1.15.5](https://tech.amefure.com/swift-cocoapods-error)

- [2] [CocoaPods could not find compatible versions for pod "GoogleUtilities/Logger"](https://github.com/invertase/react-native-firebase/issues/4040)

- [3] [エラー内容.txt](/readme-doc/pod-error.txt)


# ネイティブ(ios)対応 firebase準備
javascript firebaseJDKはiosでは動作しないため、
別途プラグインをインストールし、環境を整える必要がある。

https://github.com/capawesome-team/capacitor-firebase

## 1. 以下のnpmライブラリーをインストールする

`npm install @capacitor-firebase/authentication`

## 2. 公式にしたがってステップ3(XcodeプロジェクトにGoogleService-Info.plistを追加)まで進める。

以下[公式サイト](https://firebase.google.com/docs/ios/setup)から抜粋
- 公式手順 [add-firebase-project-ios.md](/readme-doc/add-firebase-project-ios.md)

1. firebaseにiosアプリを追加する
2. GoogleService-Info.plistをxcodeのルートフォルダに追加する



# ios対応版 firebase authentification コード
## 初期化処理
[Auth.service.ts](/src/services/Auth.service.ts)
```
import { Capacitor } from "@capacitor/core";
import { initializeApp, FirebaseApp } from "firebase/app";
import { Auth, getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth"
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { FirebaseConsts } from "../consts/Firebase.consts";

export class AuthService {
    private app: FirebaseApp;
    private auth: Auth;
    constructor() {
        this.app = initializeApp(FirebaseConsts.firebaseConfig);
        if (Capacitor.isNativePlatform()) {
            this.auth = initializeAuth(this.app, { persistence: indexedDBLocalPersistence });
        } else {
            this.auth = getAuth(this.app);
        }
    }
}
```

## ログイン
[Auth.service.ts](/src/services/Auth.service.ts)

```
    public async login(email: string, password: string): Promise<any> {
        if (Capacitor.isNativePlatform()) {
            const result = await FirebaseAuthentication.signInWithEmailAndPassword({ email: email, password: password });
            return result.user;
        } else {
            const result = await signInWithEmailAndPassword(this.auth, email, password);
            return result.user;
        }
    }
```

## ログアウト
[Auth.service.ts](/src/services/Auth.service.ts)
こちらは他のようにネイティブかどうかの分岐は不要

```
    public async logout(): Promise<void> {
        await this.auth.signOut();
        await FirebaseAuthentication.signOut();
    }
```

## ログインしているかどうか
[Auth.service.ts](/src/services/Auth.service.ts)

```
  public async isLogin(): Promise<boolean> {
        return new Promise((resolve) => {
            if (Capacitor.isNativePlatform()) {
                FirebaseAuthentication.addListener("authStateChange", (result) => {
                    if (result.user) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                this.auth.onAuthStateChanged((user) => {
                    if (user) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }
        });
    }
```

# Auth.gurad.ts

[Auth.guard.tsx](/src/guards/Auth.guard.tsx)

```
import { FC } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useRecoilValue } from "recoil"
import { AuthStateAtom } from "../atoms/AuthState.atom"

export const PrivateRoute: FC<RouteProps> = ({ component, ...rest }) => {
    const isLogIn: boolean = useRecoilValue<boolean>(AuthStateAtom);

    if (isLogIn) {
        return (<Route component={component} {...rest} />);
    } else {
        return (<Redirect to="/login" />);
    }
}
```

## Firebase初期化のフラグ管理が必要
[Loading.atom.ts](/src/atoms/Loading.atom.ts)
[App.tsx](/src/App.tsx)で初期化処理 + ログインチェック処理

```
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
...
const App: React.FC = () => {
  const setIsLogIn = useSetRecoilState(AuthStateAtom);
  const [loading, setLoading] = useRecoilState(LoadingAtom);
  const authService: AuthService = new AuthService();

  //初期化処理 + ログインフラグ設定
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
            <PrivateRoute component={Home} />
          </Route>
          <Route exact path="/">
            <PrivateRoute component={Home} />            
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
```