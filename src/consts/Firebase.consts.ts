import { FirebaseOptions } from "firebase/app";

const {
    REACT_APP_FIRBASE_API_KEY,
    REACT_APP_FIRBASE_AUTH_DOMAIN,
    REACT_APP_FIRBASE_PROJECT_ID,
    REACT_APP_FIRBASE_STORAGE_BUCKET,
    REACT_APP_FIRBASE_MESSAGING_SENDER_ID,
    REACT_APP_FIRBASE_APP_ID
} = process.env;


export class FirebaseConsts {
    public static readonly firebaseConfig: FirebaseOptions = {
        apiKey: REACT_APP_FIRBASE_API_KEY,
        authDomain: REACT_APP_FIRBASE_AUTH_DOMAIN,
        projectId: REACT_APP_FIRBASE_PROJECT_ID,
        storageBucket: REACT_APP_FIRBASE_STORAGE_BUCKET,
        messagingSenderId: REACT_APP_FIRBASE_MESSAGING_SENDER_ID,
        appId: REACT_APP_FIRBASE_APP_ID
    };
}