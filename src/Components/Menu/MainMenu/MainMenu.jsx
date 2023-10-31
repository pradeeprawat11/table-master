import React, { useEffect, useState } from 'react'
import {  Row, Image, Button,  } from 'react-bootstrap'
import {AiOutlineReload} from 'react-icons/ai'
import {VscClearAll} from 'react-icons/vsc'
import {GiConfirmed} from 'react-icons/gi'
import axios from 'axios';
import './MainMenu.css'

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
          console.log('api data', apiData)
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

  const loadMoreItem = () => {
    setMenuPage(menuPage+1)
  }

  return (
    <>
    {
      !menuLoading ?
      <>
        <Row className='menuContainer p-2 m-0 rounded bg-light mt-1'>
          {menuData.map((menuData, index) =>(
          <>
            <div key={index} className='w-100 p-2 m-0'>
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex itemImgInfo'>
                  <Image className='menuItemImage' src="https://howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg" />
                  <div className='justify-content-between px-2'>
                    <h5 className='m-0 p-0'>{(`${menuData.name}`).toLowerCase()}</h5>
                    <p className='m-0 p-0'>{(`${menuData.description}`).toLowerCase()}</p>
                    <input
                    type="text"
                    value={getInstruction(menuData._id)}
                    onChange={(e) => handleItemInstruction(menuData._id, index, e.target.value)}
                    placeholder="Add Instruction"
                  />
                  </div>
                </div>
                <div className='d-flex'>
                  <p className='px-1'>€{(`${menuData.price}`).toLowerCase()}</p>
                  <div className='addItemButton'>
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
                  </div>
                </div>
              </div>
            </div>
          </>
          ))}
        <div className='d-flex justify-content-center text-center mb-5'>
          { (menuData.length>0)  ?
              <Button variant='info' className='py-1 my-3 d-flex align-items-center' onClick={()=>loadMoreItem()}><AiOutlineReload className='mx-1' /> <span className='mx-1'>View More</span></Button>
            :
            <div className='h-100 d-flex align-items-center justify-content-center text-dark'>
              <h4>No Items</h4>
            </div>
          }
        </div>
        </Row>
        <div className='orderControlContainer d-flex justify-content-center align-items-center w-100' varient="bottom">
          {
            orderItems.length>0 &&
            <>
              <button onClick={() => clearItems()} className='basicButton bg-danger countItemBtn text-light border-danger text-center mx-3'><VscClearAll className='mx-1'/>Clear Items</button>
              <button onClick={()=> placeOrder()}  className='basicButton bg_Success countItemBtn text-light text-center '> <GiConfirmed className='mx-1'/>Place Order</button>
            </>
          }
        </div>
      </>
      :
      <>
        <Row className='menuContainer p-2 m-0 rounded bg-light mt-1'>
          <div className='h-100 d-flex align-items-center justify-content-center text-dark'>
            <h4 className=''>Loading...</h4>
          </div>
        </Row>
      </>
    }
    </>
  )
}

export default MainMenu