import React, { useState } from "react";
import Navbar from "./Navbar";
import crud from "../BackEndConnection/crud";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const SignUp = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '', 
        confirmpassword: ''
    })

    const { name, email, password, confirmpassword } = data//INPUTS BOXES
    //console.log(data)

    const onChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        //console.log('onSubmit')
        createUser();
    }

    const createUser = async () => {

        if(password !== confirmpassword){
            swal('PASSWORD ERROR', 'Password and Confirm-Password no matched', 'error')
        }else{
            const newData = {
                name: data.name,
                email: data.email, 
                password: data.password
            }
    
            const response = await crud.POST(`/api/user`, newData)

            if(response.msg === 'Error: Another user was previouly created with this email'){
                swal('ERROR', 'User could not be created because another one was previouly created with this email', 'error')
            }else{
                swal('SUCCESSFUL', 'User was successfully created', 'success')
                navigate('/login')
            }
        }
    }

    return (
        <>
            <Navbar />
            <div style={{ background: '#c9ccd1' }} className="flex flex-col justify-center items-center min-h-screen h-full">
                <div className="hidden md:flex flex-col p-8 items-center justify-center mt-[70PX] gap-2 bg-white/80 w-[350px] h-[470px] shadow-black shadow-lg rounded-md border border-black">
                    <h1 className="font-bold text-2xl text-black">Sign Up</h1>

                    <form onSubmit={onSubmit} id="formulario" className=" flex flex-col justify-center items-center gap-2 w-[100%]">

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium">Username</label>
                            <input className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Username"
                                required
                                value={name}
                                onChange={onChange}
                            ></input>
                        </div>

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium">Email</label>
                            <input className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={onChange}
                            ></input>
                        </div>

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium">Password</label>
                            <input className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={onChange}
                            ></input>
                        </div>

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium">Confirm Password</label>
                            <input className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="confirmpassword"
                                type="password"
                                name="confirmpassword"
                                placeholder="Re-enter Password"
                                required
                                value={confirmpassword}
                                onChange={onChange}
                            ></input>
                        </div>

                        <button type="submit" style={{ background: '#42b72a' }} className="text-white font-semibold mt-4 py-2 w-[100%] rounded-xl hover:text-gray-500 active:opacity-80">Sign Up</button>
                    </form>
                    <button onClick={() => { navigate('/login') }} style={{ background: '#4267b2' }} className="text-white font-semibold mt-2 py-2 w-[100%] rounded-xl hover:text-gray-500 active:opacity-80">Go Back Log In</button>
                </div>
            </div>
        </>
    )
}

export default SignUp;