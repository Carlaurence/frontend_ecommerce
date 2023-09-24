import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = (props) => {

    const categories = props.categories;

    const [close, setClose] = useState(false)

    return (
        <div className={`fixed bg-black/40 z-10 flex flex-col w-[300px] h-full bg-slate-300 duration-[2000ms] ${close ? "left-0" : "left-[-100%]"}`}>

            <div className="relative bg-black/20 flex flex-col mt-20 ml-8  w-[80%] gap-4">

                {
                    categories.map((category, index)=>(
                        <div key={category._id}>
                            <Link to={`/products-by-category/${category._id}`}>{category.name}</Link>
                            <h1></h1>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar;