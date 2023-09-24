import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtomAdmin from "./ButtomAdmin";
import { IoHome } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { RiPlayListAddFill } from "react-icons/ri"
//<RiPlayListAddFill />

const Navbar = () => {

    const navigate = useNavigate()

    const [open, setOpen] = useState(false)

    return (
        <div className="fixed flex justify-center items-center shadow-lg shadow-black w-full h-[12%] z-20" style={{ background: '#4267b2' }}>
            <div className="w-[95%] flex">

                <div className="w-[34%] flex justify-start items-center gap-2 font-semibold">
                    <div className="text-4xl text-white/80 hover:scale-125 hover:text-white hover: cursor-pointer" onClick={() => {setOpen(!open)}}>
                        <ion-icon name={`${open ? "close" : "list"}`}></ion-icon>
                    </div>
                    <FaCartShopping className="text-4xl text-white/80"/>                    
                    <h1 className="text-3xl hidden md:flex text-white/80">Ecommerce</h1>
                </div>

                <div className="w-[33%] flex justify-center items-center">
                    <IoHome className="text-4xl text-white/80 hover:scale-125 hover:text-white hover: cursor-pointer"
                    onClick={()=> navigate('/')}/>
                </div>

                <div className="w-[33%] hidden md:flex justify-end items-end"><ButtomAdmin /></div>
            </div>
        </div>

    )
}

export default Navbar;