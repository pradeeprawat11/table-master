import React, { useEffect, useState } from 'react'
import {  Row, Col, Image, Button } from 'react-bootstrap'
import {AiOutlineReload} from 'react-icons/ai'
import {VscClearAll} from 'react-icons/vsc'
import {GiConfirmed} from 'react-icons/gi'
import axios from 'axios';

const MainMenu = (props) => {
  const {getInstruction, handleItemInstruction, findItem, getQuantity, reduceItem, increaseItem, addItem, clearItems, placeOrder, orderItems} = props;
  const [menuData, setMenuData] = useState([])
  const [menuPage, setMenuPage] = useState(1)
  const [menuLoading, setMenuLoading] = useState(true)

  useEffect(()=>{
    const menuAPI = `http://194.163.149.48:3002/admin/menu/get-menu?pageNo=${menuPage}&size=10`;
    axios.get(menuAPI)
      .then((response) => {
        if(response.status===200) {
          const apiData = response.data.data;
          if(apiData.length>0){
            setMenuData((prevData) => [...prevData, ...apiData]);
          }
          setMenuLoading(false)
        }
      })
      .catch((error) => {
        setMenuLoading(true)
        console.error('Error:', error);
      });
  },[menuPage])

  return (
    <>
    {
      !menuLoading ?
      <>
        <Row className='cardContainer p-0 m-0 mt-5 py-4 px-2 text-light'>
          {menuData.map((menuData, index) =>(
            <Col key={index} className='p-2 ' xs={12} sm={6} md={4} lg={3} xl={2}>
              <Row className='cardDetailContainer h-100 rounded bg_LightDark p-0 m-0 d-flex justify-content-center align-items-center'>
                <Col className='m-0 p-0 d-flex justify-content-center align-items-center' xs={3} sm={12}>
                  <div className='imageContainer'>
                    <Image className='cardImage w-100 h-100' src="https://howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg" />
                  </div>
                </Col>
                <Col className='itemDetailContainer' xs={6} sm={12}>
                  <h5 className='p-0 m-0'>{(`${menuData.name}`).toLowerCase()}</h5>
                  <p className='p-0 m-0'>€{(`${menuData.price}`).toLowerCase()}</p>
                  <p className='p-0 m-0 colorLightGray'>{(`${menuData.description}`).toLowerCase()}</p>
                  <input
                    type="text"
                    value={getInstruction(menuData._id)}
                    onChange={(e) => handleItemInstruction(menuData._id, index, e.target.value)}
                    placeholder="Add Instruction"
                  />
                </Col>
                <Col className='py-3' xs={3} sm={12}>
                  {
                    (
                      (findItem(menuData._id) && getQuantity(menuData._id)>0)
                      ?
                      <div className='countItemBtn d-flex justify-content-evenly'>
                        <div className='minusBtn' onClick={() => reduceItem(menuData._id)} >
                          -
                        </div>
                        <div>
                        {getQuantity(menuData._id)}
                        </div>
                        <div onClick={() => increaseItem(menuData._id)}>
                          +
                        </div>
                      </div>
                      :
                      <div className='bg_Success countItemBtn text-light text-center' onClick={() => addItem(menuData, index)}>
                          +
                      </div>
                    )
                  }
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
        <div className='d-flex justify-content-center text-center'>
          { (menuData.length>0)  ?
              <Button variant='info' className='py-1 my-3 d-flex align-items-center' onClick={()=>setMenuPage(menuPage+1)}><AiOutlineReload className='mx-1' /> <span className='mx-1'>View More</span></Button>
            :
            <h3>No Items</h3>
          }
        </div>
        <div className='d-flex justify-content-center m-5' varient="bottom">
          {
            orderItems.length ?
            <>
              <button onClick={() => clearItems()} className='basicButton bg-danger countItemBtn text-light border-danger text-center mx-3'><VscClearAll className='mx-1'/>Clear Items</button>
              <button onClick={()=>placeOrder()}  className='basicButton bg_Success countItemBtn text-light text-center '> <GiConfirmed className='mx-1'/>Place Order</button>
            </>
            :
            <h6>Please slelect items to place order</h6>
          }
        </div>
      </>
      :
      <>
        <div className='h-full d-flex align-items-center justify-content-center text-light'>
          <h4 className=''>Loading...</h4>
        </div>
      </>
    }
    </>
  )
}

export default MainMenu