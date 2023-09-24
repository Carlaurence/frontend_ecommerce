import React from "react";
import Navbar from "./Navbar";

const Error404 = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center bg-slate-300 h-screen pb-[80px]">
                <h1 className="text-2xl font-bold">ERROR 404. NOT FOUND</h1>
            </div>
        </>
    )
}

export default Error404;