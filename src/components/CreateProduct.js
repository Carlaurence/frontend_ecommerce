//http://localhost:3000/create-new-product
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import crud from '../BackEndConnection/crud'
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert";
import axios from 'axios'
import back from "../BackEndConnection/back";

const CreateProduct = () => {

    const navigate = useNavigate();

    useEffect(() => {

        const securityFilter = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                swal("ERROR", "Access Denied\nThere is no token", "error");
                navigate('/')
            } else {
                const response = await crud.GET(`/api/login/${token}`)//verify token
                if (response.user) {
                    //ACCESS ALLOWED...
                    getAllCategories();
                }else if(response.msg === "jwt expired"){
                    navigate('/login')
                    swal("ERROR", "Access Denied\nYour Token has expired\nYou have to be logged again", "error");
                    localStorage.removeItem('token');
                }else {//ANY OTHER ERROR
                    navigate('/')
                    swal("ERROR", "Access Denied\nThere is no token", "error");
                    localStorage.removeItem('token');
                    //"msg": "jwt must be provided"//"msg": "jwt malformed"//"msg": "invalid signature"//"msg": "jwt must be a string"//"msg": "jwt expired"
                }
            }
        }

        securityFilter();
        
    }, [navigate])

    const [categories, setCategories] = useState([])
    const getAllCategories = async () => {
        const response = await crud.GET(`/api/category`)
        setCategories(response.msg)
    }

    const [product, setProduct] = useState({
        brand: '',
        price: '',
        categoryId: '',
        description: '',
        image: null
    })

    const { brand, price, categoryId, description, image } = product;//DATA FORM VALUES
    //console.log(product)

    const onChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value.trimStart()
        }));
    }

    const onChangeFiles = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.files[0]
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        createProductAxios();
    }

    /**post method with Axios*/
    const createProductAxios = async () => {

        const formData = new FormData();

        //SETTING FORMDATA
        const appendFormData = Object.keys(product).map(key => {
            const value = product[key]
            formData.append(`${key}`, value)
        })

        //ONLY FOR CONFIRMING
        /*
        const getFormData = Object.keys(product).map(key => {
            const value = product[key]
            console.log(key + ":" + formData.get(`${key}`))
        })
        */  
        try {
            const token = localStorage.getItem("token");

            if(token){
                const response = await axios.post(`${back.api.baseURL}/api/product/${product.categoryId}`, formData, 
                { headers: 
                    { 
                        'Content-Type': 'multipart/form-data',
                        'x-auth-token': token 
                    } 
                })
                //console.log(response.msg)
    
                //CLEANING INPUT BOXES FILELD
                setProduct({ brand: '', price: '', categoryId: '', description: '', image: null })
    
                //SETTING CATEGORY SELECT AS DEFAULTVALUE
                document.getElementById("categoryId").value = 'DefaultValue'
                //SETTING IMAGE FIELD AS DEFAULTVALUE
                document.getElementById("image").value = null
    
                //SUCCESSFULL MESSAGE
                swal("success", "Created", "success");
    
                //RESET useState[product] VALUES FOR EACH FIELD
                const resetProductValues = Object.keys(product).map(key => {
                    product[key] = ''
                })
    
                /*RESET product VALUES WAS REPLACED BY Object.keys(product).map()
                product.brand = ""
                product.price = ""
                product.categoryId = ""
                product.description = ""
                product.image = null
                */
    
                //CLEANING FORMDATA
                const deleteFormData = Object.keys(product).map(key => {
                    formData.delete(`${key}`)
                })
                
                navigate('/create-new-product')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center bg-slate-300 min-h-screen h-full">

                <div className="hidden md:flex flex-col p-8 mb-5 items-center justify-center mt-[70PX] gap-2 bg-white/80 w-[350px] h-[530px] shadow-black shadow-lg rounded-md border border-black">
                    <h1 className="font-bold text-2xl text-black" style={{ color: '#4267b2' }}>Add New Product</h1>

                    <form onSubmit={onSubmit} id="formulario" className=" flex flex-col justify-center items-center gap-1 w-[100%]">

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium" style={{ color: '#4267b2' }}>Category</label>
                            <select className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="categoryId"
                                type="text"
                                name="categoryId"
                                required
                                defaultValue={'DefaultValue'}
                                onChange={onChange}
                            >
                                <option value="DefaultValue" disabled >Choose Category...</option>
                                {
                                    categories.map((category, index) => (
                                        <option required key={category._id} value={category._id}>{category.name}</option>
                                    ))
                                }

                            </select>
                        </div>

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium" style={{ color: '#4267b2' }}>Brand</label>
                            <input className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="brand"
                                type="text"
                                name="brand"
                                placeholder="Brand"
                                required
                                value={brand}
                                onChange={onChange}
                            ></input>
                        </div>

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium" style={{ color: '#4267b2' }}>Price</label>
                            <input className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="price"
                                type="number"
                                name="price"
                                placeholder="Price"
                                required
                                value={price}
                                onChange={onChange}
                            ></input>
                        </div>

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium" style={{ color: '#4267b2' }}>Description</label>
                            <textarea className="text-gray-700 px-2 py-1 rounded-md leading-tight border border-black"
                                id="description"
                                type="text"
                                name="description"
                                rows={3}
                                placeholder="Description"
                                required
                                value={description}
                                onChange={onChange}
                            ></textarea>
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

export default CreateProduct;