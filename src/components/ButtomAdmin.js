import React from "react";
import { useNavigate } from "react-router-dom";

const ButtomAdmin = () => {

    const navigate = useNavigate() 

    const securityFilter = async () => {
        const token = localStorage.getItem('token');
        if(!token){
            navigate("/login")
        }else{
            navigate("/admin")
        }
    }

    return (
        <button className=" 
        bg-white/80
        text-black
        font-semibold
        rounded-full 
        px-4 
        py-1 
        border border-black 
        shadow-lg shadow-black
        hover:bg-white
        active:bg-opacity-50"
        onClick={securityFilter}
        >
            API REST
        </button>
    )
}

export default ButtomAdmin;