//http://localhost:3000/create-new-category
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import crud from '../BackEndConnection/crud'
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axios from 'axios'
import back from "../BackEndConnection/back";


const CreateCategory = () => {

    const navigate = useNavigate()

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

    const [category, setCategory] = useState({
        name: '',
        image: null
    })

    const { name, image } = category;
    //console.log(category)

    const onChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevProduct) => ({
            ...prevProduct,
            [name]: value.trimStart()
        }));
    }

    const onChangeFiles = (e) => {
        setCategory({
            ...category,
            [e.target.name]: e.target.files[0]
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        createCategoryAxios();
    }

    /**post method with Axios*/
    const createCategoryAxios = async () => {

        const formData = new FormData();

        //SETTING FORMDATA
        const appendFormData = Object.keys(category).map(key => {
            const value = category[key]
            formData.append(`${key}`, value)
        })

        //ONLY FOR CONFIRMING
        /*
        const getFormData = Object.keys(category).map(key => {
            const value = category[key]
            console.log(key + ":" + formData.get(`${key}`))
        })*/

        const token = localStorage.getItem("token");

        if(token){
            await axios.post(`${back.api.baseURL}/api/category`, formData, 
            { 
                headers: 
                { 
                    'Content-Type': 'multipart/form-data' ,
                    'x-auth-token': token
                } 
            })
                .then(response => {
                    //console.log(response.data)
                    if (response.data.msg === 'Error: The category was previouly created') {
                        swal("error", "ERROR: This Category could not be created because was previouly created", "error");
                    }
                    else {
                        //SUCCESSFULL MESSAGE
                        swal("success", "Created", "success");
    
                        //CLEANING INPUT BOXES FILELD
                        setCategory({ name: '', image: null })
    
                        //SETTING IMAGE FIELD AS NULL
                        document.getElementById("image").value = null
    
                        //RESET useState[product] VALUES FOR EACH FIELD
                        const resetProductValues = Object.keys(category).map(key => {
                            category[key] = ''
                        })
    
                        //CLEANING FORMDATA
                        const deleteFormData = Object.keys(category).map(key => {
                            formData.delete(`${key}`)
                        })
                    }
                }).catch(error => {
                    console.log(error)
                })
        }
        
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center bg-slate-300 h-screen">

                <div className="hidden md:flex flex-col p-8 items-center justify-center mt-[70PX] gap-2 bg-white/80 w-[350px] h-[320px] shadow-black shadow-lg rounded-md border border-black">
                    <h1 className="font-bold text-2xl text-black" style={{ color: '#4267b2' }}>Add New Category</h1>

                    <form onSubmit={onSubmit} id="formulario" className=" flex flex-col justify-center items-center gap-2 w-[100%]">

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium" style={{ color: '#4267b2' }}>Name</label>
                            <input className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Name"
                                required
                                value={name}
                                onChange={onChange}
                            ></input>
                        </div>

                        <div className="flex flex-col w-[100%]">
                            <label className=" text-black font-medium" style={{ color: '#4267b2' }}>Image</label>
                            <input className="text-gray-700 py-[5px] px-1 w-full rounded-md leading-tight border border-black"
                                id="image"
                                name="image"
                                type="file"
                                accept="image/png,image/jpeg"
                                required
                                multiple
                                //value={files}
                                onChange={onChangeFiles}
                            >
                            </input>
                        </div>

                        <button type="submit" style={{ background: '#4267b2' }} className="text-white/80 font-semibold mt-4 py-2 w-[100%] rounded-xl hover:text-gray-500 active:opacity-80">Save</button>
                        <Link to={'/admin'} style={{ color: '#4267b2' }} className="underline mt-2 font-semibold hover:opacity-50">Go back to Admin Module</Link>
                    </form>
                </div>


            </div>
        </>
    )
}

export default CreateCategory;