import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider"; 

export const useAppState = () => {
    const ctx = useContext(AppStateContext);
    if (!ctx) 
        throw new Error("error");
    return ctx;
};