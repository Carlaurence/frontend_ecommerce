//http://localhost:3000/update-product/:idProduct
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import crud from '../BackEndConnection/crud'
import { useNavigate, useParams, Link } from "react-router-dom";
import swal from "sweetalert";
import axios from 'axios'
import back from '../BackEndConnection/back'

const UpdateProduct = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        const securityFilter = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                navigate('/')
                swal("ERROR", "Access Denied\nThere is no token", "error");
            } else {
                const response = await crud.GET(`/api/login/${token}`)//verify token
                if (response.user) {
                    //ACCESS ALLOWED...
                    getProductById();
                } else if (response.msg === "jwt expired") {
                    navigate('/login')
                    swal("ERROR", "Access Denied\nYour Token has expired\nYou have to be logged again", "error");
                    localStorage.removeItem('token');
                } else {//ANY OTHER ERROR
                    navigate('/')
                    swal("ERROR", "Access Denied\nThere is no token", "error");
                    localStorage.removeItem('token');
                    //"msg": "jwt must be provided"//"msg": "jwt malformed"//"msg": "invalid signature"//"msg": "jwt must be a string"//"msg": "jwt expired"
                }
            }
        }

        securityFilter();

    }, [navigate])

    const [product, setProduct] = useState({})
    const getProductById = async () => {//ONLY ISED FOR BRINGING INFORMATION TO SET ALL PLACE HOLDER IN THE FORM
        const response = await crud.GET(`/api/product/byid/${id}`)
        //console.log(response.msg)
        setProduct(response.msg)
    }

    const [dataUpdate, setDataUpdate] = useState({
        brand: '',
        price: '',
        description: '',
        image: null
    })

    const { brand, price, description } = dataUpdate;//FIELD BOXES
    //console.log(dataUpdate)

    const onChange = (e) => {
        const { name, value } = e.target;
        setDataUpdate((prevProduct) => ({
            ...prevProduct,
            [name]: value.trimStart()
        }));
    }

    const onChangeFiles = (e) => {
        setDataUpdate({
            ...dataUpdate,
            [e.target.name]: e.target.files[0]
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        updateProductAxios();
    }

    /**put method with Axios*/
    const updateProductAxios = async () => {

        const formData = new FormData();

        //SETTING FORMDATA
        const appendFormData = Object.keys(dataUpdate).map(key => {
            const value = dataUpdate[key]
            formData.append(`${key}`, value)
        })

        //ONLY FOR CONFIRMING
        /*
        const getFormData = Object.keys(dataUpdate).map(key => {
            const value = dataUpdate[key]
            console.log(key + ":" + formData.get(`${key}`))
        })*/

        const token = localStorage.getItem("token");

        if(token){
            await axios.put(`${back.api.baseURL}/api/product/${id}`, formData,
            {
                headers:
                {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token
                }
            })
            .then(response => {
                //console.log(response)

                if (response.data.msg === 'Product does not exist') {
                    swal("ERROR", "ERROR: Product selected does not exist", "error");
                    navigate('/delete-product')
                }else if (response.data.msg === 'You are not authorized to update this Product because it was created by other user') {
                    swal("ERROR", "You are not authorized to update this Product because it was created by other user", "error");
                    navigate('/delete-product')
                }
                else {
                    //CLEANING INPUT BOXES FILELD
                    setDataUpdate({ brand: '', price: '', description: '' })

                    //CLEANING IMAGE FIELD - SETTING IMAGE FIELD AS NULL
                    document.getElementById("image").value = null

                    //SUCCESSFULL MESSAGE
                    swal("success", "Product was updated", "success");

                    //RESET OBJECT useState[product] VALUES FOR EACH FIELD
                    const resetProductValues = Object.keys(dataUpdate).map(key => {
                        dataUpdate[key] = ''
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

                    navigate('/delete-product')
                }
            }).catch(error => {
                console.log(error.message)
            })
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center bg-slate-300 h-screen">

                <div className="hidden md:flex flex-col p-8 items-center justify-center mt-[70PX] gap-2 bg-white/80 w-[350px] h-[480px] shadow-black shadow-lg rounded-md border border-black">
                    <h1 className="font-bold text-2xl text-black" style={{ color: '#4267b2' }}>Update Product</h1>

                    <form onSubmit={onSubmit} id="formulario" className=" flex flex-col justify-center items-center gap-1 w-[100%]">

                        <div className="flex flex-col w-[100%]">
                            <label className="text-black font-medium" style={{ color: '#4267b2' }}>Brand</label>
                            <input className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
                                id="brand"
                                type="text"
                                name="brand"
                                placeholder={product.brand}
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
                                placeholder={product.price}
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
                                placeholder={product.description}
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
                                multiple
                                onChange={onChangeFiles}
                            >
                            </input>
                        </div>

                        <button type="submit" style={{ background: '#4267b2' }} className="text-white/80 font-semibold mt-4 py-2 w-[100%] rounded-xl hover:text-gray-500 active:opacity-80">Update</button>
                        <Link to={'/admin'} style={{ color: '#4267b2' }} className="underline mt-2 font-semibold hover:opacity-50">Go back to Admin Module</Link>
                    </form>
                </div>


            </div>
        </>
    )
}

export default UpdateProduct;