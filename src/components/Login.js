import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import crud from "../BackEndConnection/crud";
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert";

const Login = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const { email, password } = data//INPUTS BOXES
    //console.log(data)

    const onChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        login();
    }

    const login = async() => {
        
        const newData = {
            email: data.email,
            password: data.password
        }

        const response = await crud.POST(`/api/login`, newData)
        //console.log(response.msg)

        if(response.msg === 'User does not exist'){
            swal("ERROR", 'User does not exist', 'error')
        }else if(response.msg === 'email or password incorrect'){
            swal("ERROR", 'email or password incorrect', 'error')
        }else{
            const token = response.token;
            localStorage.setItem('token', token)
            navigate('/admin')
        }
    }

    const [warning, setWarning] = useState(false)

    useEffect(()=>{
        setWarning(true)
    },[])

    

    return (
        <>
            <Navbar />
            <div className="bg-slate-300 flex flex-col justify-center items-center min-h-screen h-full">
                
                <div style={{ background: '#4267b2' }} className={`absolute mt-[70px] rounded-md hidden md:flex bg-black/20 w-[250px] lg:w-[330px] h-[350px] duration-[1000ms] ${warning ? 'left-0 lg:left-10' : 'left-[-100%]'}`}>
                    <p className="m-5 lg:m-8 text-white/80 text-justify lg:text-xl lg:font-semibold">Hi,...<br/><br/>
                        To log in, you can enter the following information: <br/><br/> 
                        username: guest@gmail.com
                        password: 123456

                        <br/><br/>
                        But also you can create a new account.  

                    </p>
                </div>
                <div className="hidden md:flex flex-col p-8 items-center justify-center mt-[70PX] gap-2 bg-white/80 w-[350px] h-[350px] shadow-black shadow-lg rounded-md border border-black">
                    <h1 className="font-bold text-2xl text-black">Log In</h1>

                    <form onSubmit={onSubmit} id="formulario" className="flex flex-col justify-center items-center gap-2 w-[100%]">

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

                        <button type="submit" style={{ background: '#4267b2' }} className="text-white font-semibold mt-4 py-2 w-[100%] rounded-xl hover:text-gray-500 active:opacity-80">Log In</button>
                    </form>
                    <button onClick={() => { navigate('/signup') }} style={{ background: '#42b72a' }} className="text-white font-semibold mt-2 py-2 w-[100%] rounded-xl hover:text-gray-500 active:opacity-80">Create new Account</button>
                </div>
            </div>
        </>
    )
}

export default Login;