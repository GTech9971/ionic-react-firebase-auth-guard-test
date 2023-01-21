
import { Capacitor } from "@capacitor/core";
import { initializeApp, FirebaseApp } from "firebase/app";
import { Auth, getAuth, indexedDBLocalPersistence, initializeAuth, signInWithEmailAndPassword } from "firebase/auth"
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

    public async login(email: string, password: string): Promise<any> {
        if (Capacitor.isNativePlatform()) {
            const result = await FirebaseAuthentication.signInWithEmailAndPassword({ email: email, password: password });
            return result.user;
        } else {
            const result = await signInWithEmailAndPassword(this.auth, email, password);
            return result.user;
        }
    }

    public async logout(): Promise<void> {
        await this.auth.signOut();
        await FirebaseAuthentication.signOut();
    }

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
}