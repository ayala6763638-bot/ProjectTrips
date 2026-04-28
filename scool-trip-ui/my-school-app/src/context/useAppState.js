import { useContext } from "react";
import { AppStateContext } from "../context/AppStateProvider"; // תצטרכי לייצא את הקונטקסט מה-Provider

export const useAppState = () => {
    const ctx = useContext(AppStateContext);
    if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
    return ctx;
};