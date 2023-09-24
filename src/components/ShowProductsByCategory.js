import React, { useEffect, useState } from "react";
import crud from "../BackEndConnection/crud";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import CarouselCategories from './CarouselCategories';
import { AiOutlineDollarCircle } from "react-icons/ai";
import swal from "sweetalert";

const ProductsByCategory = () => {

    //FUNCION PARA DAR FORMATO A VALORES DE MILES SEPARADOS POR PUNTO
    const decimalFormatter = new Intl.NumberFormat("es-ES", {
        maximumFractionDigits: 0
      })

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getAllCategories();
        getProductsByCAtegory();
    }, [navigate])

    const [categories, setCategories] = useState([])
    const getAllCategories = async () => {
        const response = await crud.GET(`/api/category`)
        //console.log(response.msg)
        setCategories(response.msg)
    }

    const [products, setProducts] = useState([])
    const getProductsByCAtegory = async () => {
        const response = await crud.GET(`/api/product/${id}`)
        if(response.msg === 'There are not products in this category'){
            swal('WARNING', 'There are not products in this category', 'warning')
        }else{
            setProducts(response.msg)
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center bg-slate-300 h-full pb-[80px]">

                <div className=" flex flex-col gap-8 items-center mt-[80px] pb-[40px] w-[80%] min-h-screen h-full">

                    <h1 className="text-2xl font-bold" style={{ color: '#4267b2' }}>SHOP BY CATEGORIES</h1>

                    <div className="w-full">
                        <CarouselCategories categories={categories} />
                    </div>

                    <hr className="bg-black h-1 w-full rounded-md" style={{ background: '#4267b2' }}/>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            products.map((product, index) => (
                                <div key={product._id} className="flex flex-col justify-center items-center rounded-md border border-black shadow-md shadow-gray-500">
                                    <div className="m-4 flex flex-col justify-center items-center">
                                        <img src={product.image.secure_url} alt="image#" className="w-[300px] h-[168px]"></img>
                                        <div className="font-thin">
                                        <h1>{product.brand}</h1>
                                        <h1>{product.description}</h1>
                                        <h1 className="flex items-center gap-1"><AiOutlineDollarCircle style={{color: '#424949', fontSize:'20px'}} />{decimalFormatter.format(product.price)}</h1>
                                        </div>
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

export default ProductsByCategory;