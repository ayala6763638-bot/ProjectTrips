import { createContext,useContext,useEffect,useState } from "react";
import io from "socket.io-client";

const socketcon=createContext();

export const SocketProvider=({children})=>{
    const [socket,setsocket]=useState(null);
    useEffect(()=>{
        const newsocket=io("http://localhost:5000");
        setsocket(newsocket);
        return()=>{
            newsocket.close();
        }
    },[]);
    return(
        <socketcon.Provider value={socket}>
            {children}
        </socketcon.Provider>
    );
};
export const usesocket=()=> useContext(socketcon);