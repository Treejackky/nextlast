"use client";
import { on } from "events";
import Image from "next/image";
import React, { use } from "react";
import { useEffect, useState } from "react";
type Props = {};

export async function getItem() {
  const res = await fetch("http://54.179.86.5:8765/v1/item");
  const data = await res.json();
  return data;
}

export async function postItem(cart:any) {

  let zlib = require('zlib');
   let body =  zlib.deflateSync(JSON.stringify(cart));
  let res = await fetch("http://54.179.86.5:8765/v1/order_qr",
    {
      method: 'POST',
      headers: {
        'content-type': 'application/octet-stream',
      },
      body: body.slice(2),
    }
     );
    
    let resBuffer = await res.arrayBuffer();

    let data_cart =    JSON.parse(zlib.unzipSync(Buffer.from([120, 156, ...new Uint8Array(resBuffer)])));

    return {
      props: {data_cart},
    };
  }

  export async function getOrder() {
    const res = await fetch("http://54.179.86.5:8765/v1/order");
    const data_ord = await res.json();
    console.log(data_ord);
    return  data_ord;
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
  const [order, setOrder] = useState<any>([]);
  const [dataSushi, setDataSushi] = useState<any>([]);
  const [dataBeef, setDataBeef] = useState<any>([]);
  const [dataSeafood, setDataSeafood] = useState<any>([]);
  const [dataDesert, setDataDesert] = useState<any>([]);
  const [dataVegeis, setDataVegeis] = useState<any>([]);
  const [dataNoodle, setDataNoodle] = useState<any>([]);
  const [dataFilter, setDataFilter] = useState<any>([]);

  useEffect(() => {
    getItem().then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    getOrder().then((orderData) => {
      setOrder(orderData);
    }).catch(error => {
      console.error('Error fetching order data:', error);
    });
  }, []);

  // useEffect(() => {
  //   getOrder().then((order) => {
  //     setOrder(order);
  //   });
  // }, []);
  
  
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
    setDataFilter([...dataSushi, ...dataBeef, ...dataSeafood,... dataDesert, ...dataVegeis, ...dataNoodle]);
  }, [data]);



  const [cart, setCart] = useState<any>([]);

  useEffect(() => {
   
    let cart_local = localStorage.getItem("cart");
     if(cart_local){
      setCart(JSON.parse(cart_local!));
      console.log(cart_local);   
    }
  
  },[]);

  const addToCart = (item :any, countItem:any) => {
  setCart((prevCart: any[])  => {
     const existingItemIndex = prevCart.findIndex(cartItem => cartItem.ItemCode === item.ItemCode);

    if (existingItemIndex >= 0) {
       const updatedCart = [...prevCart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        Quantity: updatedCart[existingItemIndex].Quantity + countItem
      };
      return updatedCart;
    } else {
       let newItem = {
        'OutletID': '1.10',
        'TableID': '14',
        'ItemID': item.ItemID,
        'ItemCode': item.ItemCode,
        'ItemSupp': item.Name,
        'UnitPrice': item.UnitPrice,
        'Disc': item.Disc,
        'Size': '1',
        'SvcExcl': item.SvcExcl,
        'TaxExcl': item.TaxExcl,
        'GrpMaster': item.GrpMaster,
        'GrpSub': item.GrpSub,
        'Quantity': countItem,
        'CashierID': '1',
      };
      return [...prevCart, newItem];
    }
    });
  };
  

  useEffect(() => {
    if(cart.length > 0){
      localStorage.setItem("cart", JSON.stringify(cart!));
    }
  }, [cart]);
  

  const [page, setPage] = useState<any>(1);
  const [overlay, setOverlay] = useState<any>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [countItem, setCountItem] = useState(1);



  const handleItemClick = (item : any) => {
    setSelectedItem(item);
    setOverlay(true);
  };
  
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
        {dataFilter.map((item:any, index :any) => (
          <button 
            className="item" 
            key={index} 
            onClick={() => handleItemClick(item)}
          >
            {item.Name}
            <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`} alt="Imgfood" />
          </button>
        ))}
       {overlay && selectedItem && (
          <div className="modal">
            <div className="modal-header">
              <div className="name">{selectedItem.Name}</div>
            </div>
            <div className="modal-body">
              <div className="modal-img">
                <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${selectedItem.ItemCode}.jpg`}  alt="Imgfood" />
              </div>
              <div className="item-count">
              <button className="count-btn" onClick={() => setCountItem(prevCount => prevCount >1 ? prevCount - 1 : 1)}>-</button>
                <span>{countItem}</span>
                <button className="count-btn" onClick={() => setCountItem(prevCount => prevCount + 1)}>+</button>

              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-action" onClick={() => [setOverlay(false), setCountItem(1)]}>ยกเลิก</button>
              <button className="modal-action" onClick={() => [ setOverlay(false), addToCart(selectedItem, countItem), setCountItem(1)]}>เพิ่มในตะกร้า</button>
            </div>
          </div>
        )}

      </section>
      </>
    );
  }

  const Cart = () => {
    const incrementQuantity = (itemCode:any) => {
      setCart(cart.map((item: { ItemCode: any; Quantity: number; }) => 
        item.ItemCode === itemCode ? { ...item, Quantity: item.Quantity + 1 } : item
      ));
    };
  
    const decrementQuantity = (itemCode: any) => {
      setCart(cart.map((item: { ItemCode: any; Quantity: number; }) =>
        item.ItemCode === itemCode && item.Quantity > 1 ? { ...item, Quantity: item.Quantity - 1 } : item
      ));
    };
  
    return (
      <>
  <div className="cart-container">
    {cart.map((item:any, index:any) => (
      <div className="cart-item" key={index}>
       <div className="cart-header">
       {item.ItemSupp}
        <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`} alt="Imgfood" />
        </div>
        <div className="cart-body">
          <div className="quantity-controls">
            <button onClick={() => decrementQuantity(item.ItemCode)} aria-label="Decrease quantity">-</button>
            <span>{item.Quantity}</span>
            <button onClick={() => incrementQuantity(item.ItemCode)} aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>
    ))}
  </div>
  <div className="parent-container">
    <div className="cart-order">
      <button onClick={() =>[
        postItem(cart),
        setCart([]),
        localStorage.removeItem("cart"),
      ]}>สั่ง {cart.length} รายการ</button>
    </div>
  </div>
</>

    );
  };
  

  const Order = () => {
  
    return (
      <>
         {order.map((item:any, index:any) => (
        <div className="order-item" key={index}>
          <div className="order-header">
          <img src={`https://posimg.s3.ap-southeast-1.amazonaws.com/${item.ItemCode}.jpg`} alt="Imgfood" />

            <div className="order-id">{item.ItemSupp}</div>
          </div>
          <div className="order-body">
             <div className="order-total">จำนวนทั้งหมด: {item.Quantity}</div>
          </div>
        </div>
         ))}
      </>
    );
  }

  // {
  //   'OutletID': '1.10',
  //   'TableID': '14',
  //   'ItemID': data2.ItemID,
  //   'ItemCode': data2.ItemCode,
  //   'ItemSupp': data2.Name,
  //   'UnitPrice': data2.UnitPrice,
  //   'Disc': data2.Disc,
  //   'Size': '1',
  //   'SvcExcl': data2.SvcExcl,
  //   'TaxExcl': data2.TaxExcl,
  //   'GrpMaster': data2.GrpMaster,
  //   'GrpSub': data2.GrpSub,
  //   'Quantity': quanity,
  //   'CashierID': '1',
  // },
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
      getOrder().then((orderData) => {
        setOrder(orderData);
      }).catch(error => {
        console.error('Error fetching order data:', error);
      });
      return setPage(3);
    }
  }

  // < Navbar />
  const isHeader = () => {
    if(page == 1){
      return(
        <>
          <img src="https://scontent.fbkk5-7.fna.fbcdn.net/v/t39.30808-6/285740555_3164288673886606_4866148165288431653_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeEaTfrd9vfKuS-Ax69h84RpEJ_GGlsl-CEQn8YaWyX4IWBOWot2UpYR-3xZSyyPNmi5NxDLznwh2EQR4ckfGURm&_nc_ohc=ditpKHDmPFoAX-aRrc6&_nc_ht=scontent.fbkk5-7.fna&oh=00_AfCyL4bmRh3lvI7QxeRXeIrIItyhGlL2o_Bi-XVOYZNTwQ&oe=657A440D" alt="logo" />
        </>
      )
    }else if(page == 2){
      return <></>
    }
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
     <header className={page === 1 ? "p1" : "p2"}>
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
