import { User } from "firebase/auth";
import { atom } from "recoil";

export const AuthStateAtom = atom<boolean>({
    key: "authStateAtom",
    default: false
});
