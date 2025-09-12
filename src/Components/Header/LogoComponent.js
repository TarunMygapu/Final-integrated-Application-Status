import React from "react";
import logo from "../../Asserts/Header/sclogo.png";
import './Header.css';

const LogoComponent =()=>{
    return (

         <div className="logo-item">
        <figure className=" logoimg mb-0 ">
            <img  src={logo} className="sclogo" alt="logo"/>
        </figure>

    </div>

    );
   
};
export default LogoComponent;