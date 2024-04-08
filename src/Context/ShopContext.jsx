import axios from "axios";
import React, { createContext, useEffect, useState} from "react";
import { BaseUrl } from "../Components/Constant/Constant";
// import all_product from "../Components/Assets/all_product";


export const ShopContext = createContext(null)


 const getDefaultCart = () => {
        let cart = {};

        for (let index = 0; index <300+1; index++) {
            cart[index] = 0;
            
        }
        return cart
    }

const ShopContextProvider = (props) => {
    const [cartItem, setCartItems] = useState(getDefaultCart())  
    const [all_product, set_Allproduct] = useState([])
    

    useEffect(() => {
        axios
        .get(`${BaseUrl}allproducts`)
            .then((res) => res.json())
            .then((res) => {
               
            set_Allproduct(res)
        })

        if (localStorage.getItem('auth-token')) {
            axios
        .post(`${BaseUrl}getcart`, {
               
                headers: {
                    Accept: "application/form-data",
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json'
                },
                body:""
             })
            .then((res) => res.json())
            .then((res) => {
               
            setCartItems(res)
        })
        }
    },[])
    
  

    const addTocart = (itemid) => {
        setCartItems((previous) => ({
            ...previous,[itemid]:previous[itemid]+1
        }))
        if (localStorage.getItem('auth-token')) {
           axios
           .post(`${BaseUrl}addtocart`, {
              
            headers: {
                Accept: 'application/json',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            
                },
            body: JSON.stringify({"itemId":itemid})
           })
                .then((res) => res.json())
               .then((res) => {
                console.log(res)
            })
            
        }
    }

     const removefromcart = (itemid) => {
        setCartItems((previous) => ({
            ...previous,[itemid]:previous[itemid]-1
        }))
          if (localStorage.getItem('auth-token')) {
           axios
           .post(`${BaseUrl}removefromcart`, {
              
            headers: {
                Accept: 'application/json',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            
                },
            body: JSON.stringify({"itemId":itemid})
           })
                .then((res) => res.json())
               .then((res) => {
                console.log(res)
            })
            
        }
    }

    function getTotalCartItems() {
        let totalItems = 0; 
        for (let item in cartItem) {
            if (cartItem[item] > 0) {
                totalItems+=cartItem[item]
            }
        }
        return totalItems
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        
        for (const item in cartItem) {
          
            if (cartItem[item] > 0) {
                let iteminfo = all_product.find((product) => product.id === Number(item))
             
                totalAmount+= iteminfo.new_price*cartItem[item]
            }
          
        }
          return totalAmount
    }
   
  const contextValue = {
        all_product,
      cartItem
      , addTocart,
      removefromcart,
      getTotalCartItems,
        getTotalCartAmount
    }
    return (<ShopContext.Provider value={contextValue} >
        {props.children}    
        </ShopContext.Provider>
    
        )
}

export default ShopContextProvider; 