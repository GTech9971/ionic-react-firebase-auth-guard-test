import { atom } from "recoil";

export const LoadingAtom = atom<boolean>({
    key: "loadingAtom",
    default: true
});