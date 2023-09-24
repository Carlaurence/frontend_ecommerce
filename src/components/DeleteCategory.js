//http://localhost:3000/delete-category
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import crud from '../BackEndConnection/crud'
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert";

const DeleteCategory = () => {

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

    const [categoryId, setCategoryId] = useState('')
    const onChange = (e) => {
        setCategoryId(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if(categoryId===''){
            swal('ERROR', 'You must select one Category to be deleted', 'error')
        }else{
            warningDelete()
        }
    }

    const warningDelete = () => {
        swal({
            title: "Are You sure?",
            text: "Once deleted, you will not be able to recover this category!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deleteCategory();
                } else {
                    document.getElementById('categoryId').value = 'DefaultValue'
                    swal("CANCELED", 'Request was Canceled!', 'success');
                    setCategoryId('')
                }
            });
    }

    const deleteCategory = async() => {
        const response = await crud.DELETE(`/api/category/${categoryId}`)
        //console.log(response.msg)
        if(response.msg === 'Category does not exist'){
            setCategoryId('')
            swal('ERROR', 'Category does not exist', 'error')
            document.getElementById('categoryId').value = 'DefaultValue'

        }else if(response.msg === 'This Category can not be deleted because some products are linked'){
            setCategoryId('')
            swal('ERROR', 'This Category can not be deleted because some products are linked', 'error')
            document.getElementById('categoryId').value = 'DefaultValue'

        }else if(response.msg === 'You are not authorized to delete this Category because it was created by other user'){
            setCategoryId('')
            swal('ERROR', 'You are not authorized to delete this Category because it was created by other user', 'error')
            document.getElementById('categoryId').value = 'DefaultValue'

        } else{
            setCategoryId('')
            swal('success', 'Category was deleted', 'success')
            navigate('/admin')
            document.getElementById('categoryId').value='DefaultValue'
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center bg-slate-300 h-screen">

                <div className="hidden md:flex flex-col p-8 items-center justify-center mt-[70PX] gap-2 bg-white/80 w-[350px] h-[260px] shadow-black shadow-lg rounded-md border border-black">
                    <h1 className="font-bold text-2xl text-black" style={{ color: '#4267b2' }}>Delete Category</h1>

                    <form onSubmit={onSubmit} id="formulario" className=" flex flex-col justify-center items-center gap-2 w-[100%]">

                        <div className="flex flex-col gap-1 w-[100%]">
                            <label className="text-black font-medium" style={{ color: '#4267b2' }}>Category</label>
                            <select className="text-gray-700 w-full px-2 py-2 rounded-md leading-tight border border-black"
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

                        <button type="submit"  style={{ background: '#4267b2' }} className="text-white/80 font-semibold mt-4 py-2 w-[100%] rounded-xl hover:text-gray-500 active:opacity-80">Delete</button>
                        <Link to={'/admin'} style={{ color: '#4267b2' }} className="underline mt-2 font-semibold hover:opacity-50">Go back to Admin Module</Link>
                    </form>
                </div>


            </div>
        </>
    )
}

export default DeleteCategory;