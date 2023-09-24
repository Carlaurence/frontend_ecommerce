//http://localhost:3000/delete-product
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import crud from '../BackEndConnection/crud'
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert";

const DeleteProduct = () => {

    const navigate = useNavigate();

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

    const onChange = (e) => {
        getProductsByCategory(e.target.value)
    }

    const [products, setProducts] = useState([])
    const getProductsByCategory = async (id) => {
        const response = await crud.GET(`/api/product/${id}`)
        //console.log(response.msg)
        if (response.msg === 'There are not products in this category') {
            swal('ERROR', 'There are not products in this category', 'error')
            document.getElementById('categoryId').value = 'DefaultValue'
            setProducts([])
        } else {
            setProducts(response.msg)
        }

    }

    const warningDelete = (id) => {
        swal({
            title: "Are You sure?",
            text: "Once deleted, you will not be able to recover this product!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deleteProduct(id);
                } else {
                    swal("CANCELED", 'Request was Canceled!', 'success');
                }
            });
    }

    const deleteProduct = async(id) => {
        const response = await crud.DELETE(`/api/product/${id}`)
        //console.log(response.msg)
        if(response.msg === 'Product does not exist'){
            swal('Error', 'Product does not exist', 'error')
        }else if(response.msg === 'You are not authorized to delete this Product because it was created by other user'){
            swal('ERROR', 'You are not authorized to delete this Product because it was created by other user', 'error')
        }else{
            swal('success', 'Product was deleted', 'success')
            document.getElementById('categoryId').value = 'DefaultValue'
            setProducts([])
            navigate('/delete-product')
        }
    }

    const updateProduct = (id) => {
        navigate(`/update-product/${id}`)
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center bg-slate-300 min-h-screen h-full">

                <div className="hidden md:flex flex-col p-8 items-center justify-center mt-[70PX] gap-2 bg-white/80 min-w-[350px] min-h-[230px] max-w-[600px] shadow-black shadow-lg rounded-md border border-black">
                    <h1 className="font-bold text-2xl text-black" style={{ color: '#4267b2' }}>Update / Delete Product</h1>

                    <form id="formulario" className=" flex flex-col justify-center items-center gap-1 w-[100%]">

                        <div className="flex flex-col gap-1 w-[100%]">
                            <label className="text-black font-medium" style={{ color: '#4267b2' }}>Category</label>
                            <select className="text-gray-700 w-[300px] px-2 py-2 rounded-md leading-tight border border-black"
                                id="categoryId"
                                type="text"
                                name="categoryId"
                                required
                                defaultValue={'DefaultValue'}
                                onChange={onChange}
                            //console.log(document.getElementById('categoryId').value)
                            >
                                <option value="DefaultValue" disabled >Choose Category...</option>
                                {
                                    categories.map((category, index) => (
                                        <option required key={category._id} value={category._id}>{category.name}</option>
                                    ))
                                }

                            </select>
                        </div>

                        <Link to={'/admin'} style={{ color: '#4267b2' }} className="underline mt-2 font-semibold hover:opacity-50">Go back to Admin Module</Link>

                    </form>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {
                            products.map((product, index) => (
                                <div key={product._id} className="flex flex-col justify-center items-center rounded-md border border-black shadow-md shadow-gray-500">
                                    <div className="m-4 flex flex-col justify-center items-center">
                                        <img src={product.image.secure_url} alt="image#" className="w-[128px] h-[72px]"></img>
                                        <button onClick={()=>{updateProduct(product._id)}} style={{ background: '#4267b2' }} className="flex justify-center items-center text-white/80 font-semibold mt-4 py-2 w-[100%] h-[30px] rounded-xl hover:text-gray-500 active:opacity-80">Update</button>
                                        <button onClick={()=>{warningDelete(product._id)}} className="flex justify-center items-center bg-red-600 text-white font-semibold mt-4 py-2 w-[100%] h-[30px] rounded-xl hover:text-gray-500 active:opacity-80">Delete</button>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>


            </div>
        </>
    )
}

export default DeleteProduct;