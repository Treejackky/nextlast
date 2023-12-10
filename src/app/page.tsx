"use client";
import { on } from "events";
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
type Props = {};

export async function getItem() {
  const res = await fetch("http://54.179.86.5:8765/v1/item");
  const data = await res.json();
  return data;
}

export default function Home({}: Props) {
  const isSushi = ["51306", "51307", "51321", "51323","51324",
, "51325", "51327", "51328", "515020"]
const isBeef = ["51317", "51318", "51320", "74134", "51353", "514005" ,"514007",
  "514002", "514003", "74101", "74108", "74117"]
  const isSeafood = ["51337", "51338", "51339", "514008", "79152",
  "74118", "74119", "74129"]
  const isDesert = ["51347", "51348", "51350", "51351", "5973138"]
  const isVegeis  =["75101", "75102", "75103", "75104", "75106", "75109", "75110"
  , "75111", "75125", "79167"]
  const isNoodle = ["74116", "75115", "75116", "75117"]

  // ลูกค้าเดินไปตักเอง
  //   const isPizza = ["76102", "76104", "76106", "76109", "76110"]
  //   const isSnacks = ["76114", "76115", "76117", "76118", "76121",
  //   "76122", "76123", "76133", "76138", "76143", "77101", "77102",
  // "77108", "7107", "77109", "77111", "77128", "77133"]
  // const isDrink = ["78127", "78128", "78129", "79133", "79131", "79130","79129"]
  const [data, setData] = useState<any>([]);
  const [dataSushi, setDataSushi] = useState<any>([]);
  const [dataBeef, setDataBeef] = useState<any>([]);
  const [dataSeafood, setDataSeafood] = useState<any>([]);
  const [dataDesert, setDataDesert] = useState<any>([]);
  const [dataVegeis, setDataVegeis] = useState<any>([]);
  const [dataNoodle, setDataNoodle] = useState<any>([]);

  useEffect(() => {
    getItem().then((data) => {
      setData(data);
    });
  }, []);
  
  // FILTER DATA
  useEffect(() => {
    const sushi = data.filter((item: any) => {
      return isSushi.includes(item.ItemCode);
    });
    const beef = data.filter((item: any) => {
      return isBeef.includes(item.ItemCode);
    });
    const seafood = data.filter((item: any) => {
      return isSeafood.includes(item.ItemCode);
    });
    const desert = data.filter((item: any) => {
      return isDesert.includes(item.ItemCode);
    });
    const vegeis = data.filter((item: any) => {
      return isVegeis.includes(item.ItemCode);
    });
    const noodle = data.filter((item: any) => {
      return isNoodle.includes(item.ItemCode);
    });
    setDataNoodle(noodle);
    setDataVegeis(vegeis);
    setDataDesert(desert);
    setDataSeafood(seafood);
    setDataBeef(beef);
    setDataSushi(sushi);
  }, [data]);

  // local storage to add food 
  const [cart, setCart] = useState<any>([]);
  
  const addToCart = (item: any) => {
    setCart([...cart, item]);
  }
   
  const showMap = (data:any) => {
    return data.map((item: any, index: any) => {
      return(
        <button className="item"  
        key={index}
        onClick={() => addToCart(item)}
        > {index}
          {item.Name} :  {item.UnitPrice == "" ? 0 : item.UnitPrice} บาท
          {/* {item.ItemCode} */}
          <img src={"https://posimg.s3.ap-southeast-1.amazonaws.com/" + item.ItemCode + ".jpg"}  alt="Imgfood" />
        </button>
      )
    });
  }
 

  const [page, setPage] = useState<any>(1);

  const Menu = () => {
    // {"_id":"655fb378b07c32a55a5e0ba3","ItemID":"8869","Disc":"N","GrpMaster":"7","GrpSub":"704","ItemCode":"70406","Name":"C เนื้อริบอาย (กก)","SvcExcl":"X","TaxExcl":"Y","UnitPrice":""}
  
    return (
      <>
      <nav>
        <div>ซูชิ</div>
        <div>เนื้อสัตว์</div>
        <div >ทะเล</div>
        <div>ผัก</div>
        <div>เส้น</div>
        <div>ของหวาน</div>
       </nav>
      <section>
        <div>Sushi</div>
        {showMap(dataSushi)}
        <div>Beef</div>
        {showMap(dataBeef)}
        <div>Seafood</div>
        {showMap(dataSeafood)}
        <div>Vegeis</div>
        {showMap(dataVegeis)}
        <div>Noodle</div>
        {showMap(dataNoodle)}
        <div>Desert</div>
        {showMap(dataDesert)}
      </section>
      </>
    );
  }

  const Cart = () => {
    return (
      <>
        <div>Cart</div>
        <div>Cart</div>
        <div>Cart</div>
        <div>Cart</div>
        <div>Cart</div>
      </>
    );
  }

  const Order = () => {
    return (
      <>
        <div>Order</div>
        <div>Order</div>
        <div>Order</div>
        <div>Order</div>
        <div>Order</div>
      </>
    );
  }



  const isPage = () => {
    {if(page == 1){
      return <Menu />
    }
    else if(page == 2){
      return <Cart />
    }
    else if(page == 3){
      return <Order />
    }
    }
  }

  const isChanged = (e: any) => {
    console.log(e.target.id);
    if(e.target.id == "menu"){
      return setPage(1);
    }
    else if(e.target.id == "cart"){
      return setPage(2);
    }
    else if(e.target.id == "order"){
      return setPage(3);
    }
  }

  // < Navbar />
  const isHeader = () => {
    return(
      <>
        <img src="https://scontent.fbkk5-7.fna.fbcdn.net/v/t39.30808-6/285740555_3164288673886606_4866148165288431653_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeEaTfrd9vfKuS-Ax69h84RpEJ_GGlsl-CEQn8YaWyX4IWBOWot2UpYR-3xZSyyPNmi5NxDLznwh2EQR4ckfGURm&_nc_ohc=ditpKHDmPFoAX-aRrc6&_nc_ht=scontent.fbkk5-7.fna&oh=00_AfCyL4bmRh3lvI7QxeRXeIrIItyhGlL2o_Bi-XVOYZNTwQ&oe=657A440D" alt="logo" />
      </>
    )
  }

  const isFooter = () => {
    return(
        <>
      <button id="menu" onClick={isChanged}>Menu</button>
      <button id="cart" onClick={isChanged}>Cart</button>
      <button id="order" onClick={isChanged}>Order</button>
          </>
    )
  }




  return (
    <>
    <header>
    {isHeader()}
    </header>
     <div className="main-content">
     {isPage()}
     </div>
     <footer>
     {isFooter()}    
     </footer>
    </>
  );
}
