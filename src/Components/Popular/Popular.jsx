import React , {useState , useEffect} from "react";
import './Popular.css'
import data_product from '../Assets/data'
import Item from "../Item/Item";
import axios from "axios";
import { BaseUrl } from "../Constant/Constant";

function Popular() {    
    const [PopularProducts, setPopularProducts] = useState([]);
    useEffect(() => {
        fetch(`${BaseUrl}popularinwomen`)
            .then((res) => {
                console.log(res.json())
                console.log(res)
            })
            .then((res) => {
               
            setPopularProducts(res)
        })

        
    },[])
    return (
        <div className="popular">
            <h1>Popular in women</h1>
            <hr/>
            <div className="popular-item">
                {PopularProducts?.map((item , i) => {
                    return (
                        <Item key={i} id={item.id} name={item.name} image= {item.image} new_price = {item.new_price} old_price ={item.old_price} />
                    )
                })}
           </div>
        </div>
    )
}

export default Popular