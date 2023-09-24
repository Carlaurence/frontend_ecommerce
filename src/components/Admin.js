import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import crud from "../BackEndConnection/crud";

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        securityFilter()
    }, [])

    const securityFilter = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            swal("ERROR", "Access Denied\nThere is no token", "error");
            navigate('/')
        } else {
            const response = await crud.GET(`/api/login/${token}`)//verify token
            if (response.user) {
                //ACCESS ALLOWED...
                //console.log(response.user.id)
            }else if(response.msg === "jwt expired"){
                navigate('/login')
                swal("ERROR", "Access Denied\nYour Token has expired\nYou have to be logged again", "error");
                localStorage.removeItem('token');
            }else {//ANY OTHER ERROR
                navigate('/')
                swal("ERROR", "Access Denied\nThere is no token", "error");
                localStorage.removeItem('token');
                //"msg": "jwt must be provided"
                //"msg": "jwt malformed"
                //"msg": "invalid signature"
                //"msg": "jwt must be a string"
                //"msg": "jwt expired"
            }
        }
    }

    const logout = () => {
        swal({
            title: "Are you sure?",
            text: "Once Logout, You will have to make login again to use the API-REST!!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    localStorage.removeItem('token')
                    navigate('/')
                    swal("LOGOUT!", {
                        icon: "success",
                    });
                } else {
                    swal("CANCELED!");
                }
            });
    }

    const [warning, setWarning] = useState(false)

    useEffect(()=>{
        setWarning(true)
    },[])

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center bg-slate-300 min-h-screen h-full">
            
            <div style={{ background: '#4267b2' }} className={`absolute mt-[70px] rounded-md hidden md:flex bg-black/20 w-[250px] lg:w-[330px] h-[350px] duration-[1000ms] ${warning ? 'left-0 lg:left-10' : 'left-[-100%]'}`}>
                    <p className="m-5 lg:m-8 text-white/80 text-justify lg:text-xl lg:font-semibold">Warning,...<br/>
                        You are not authorized to Update or Delete Categories or Products created by other user  <br/><br/> 
                        
                        To test Update or Delete functions, first you must create any Product or Category
                    </p>
                </div>

                <div className="hidden md:flex flex-col p-8 items-center justify-center mt-[70PX] gap-8 bg-white/80 w-[350px] h-[440px] shadow-black shadow-lg rounded-md border border-black">
                    <h1 className="font-bold text-2xl text-black" style={{ color: '#4267b2' }}>Microservices API-REST</h1>
                    <div className="flex flex-col items-center gap-4">
                        <button onClick={() => { navigate('/create-new-category') }} style={{ background: '#4267b2' }} className=" text-white/80 font-semibold py-2 w-[280px] rounded-xl hover:text-gray-500 active:opacity-80">Create new Category</button>
                        <button onClick={() => { navigate('/create-new-product') }} style={{ background: '#4267b2' }} className=" text-white/80 font-semibold py-2 w-[280px] rounded-xl hover:text-gray-500 active:opacity-80">Create new Product</button>
                        <button onClick={() => { navigate('/delete-product') }} style={{ background: '#4267b2' }} className=" text-white/80 font-semibold py-2 w-[280px] rounded-xl hover:text-gray-500 active:opacity-80">Update Product</button>
                        <button onClick={() => { navigate('/delete-product') }} style={{ background: '#4267b2' }} className=" text-white/80 font-semibold py-2 w-[280px] rounded-xl hover:text-gray-500 active:opacity-80">Delete Product</button>
                        <button onClick={() => { navigate('/delete-category') }} style={{ background: '#4267b2' }} className=" text-white/80 font-semibold py-2 w-[280px] rounded-xl hover:text-gray-500 active:opacity-80">Delete Category</button>

                    </div>
                    <Link onClick={logout} style={{ color: '#4267b2' }} className=" underline font-semibold">Logout</Link>
                </div>

            </div>
        </>

    );
}

export default Admin;