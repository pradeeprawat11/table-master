import {React} from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import { LiaLessThanSolid } from 'react-icons/lia'
import './VerifyOrder.css'
import { Link } from 'react-router-dom'
import {MdCancel} from 'react-icons/md'
import {AiOutlineAppstoreAdd} from 'react-icons/ai'
import {GiConfirmed} from 'react-icons/gi'
import { ToastContainer } from 'react-toastify';

const VerifyOrder = (props) => {
    const {getInstruction, handleItemInstruction, findItem, getQuantity, reduceItem, increaseItem, confirmOrder, cancelOrder, addItem, hideViewItems, allOrderItems, totalAmount} = props;
    
    return (
      <>
            {/* <div className='fixedNavbar d-flex text-light align-items-center py-2'>
              <Link onClick={()=> hideViewItems()} className='text-light'>
                <div className='menuLogo d-flex align-items-center mx-3 p-2'>
                  <LiaLessThanSolid size={20} />
                </div>
              </Link>
              <div>
                <h4 className='m-0'>Confirm Order</h4>
              </div>
            </div> */}
            <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
        <Row className='verifyOrderContainer p-2 m-0 rounded bg-light mt-1'>
          {allOrderItems.map((orderItem, index) =>(
            findItem(orderItem._id) && 
            <>
            <div key={index} className='w-100 p-2 m-0'>
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex itemImgInfo'>
                  <Image className='menuItemImage' src="https://howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg" />
                  <div className='justify-content-between px-2'>
                    <h5 className='m-0 p-0'>{(`${orderItem.name}`).toLowerCase()}</h5>
                    <p className='m-0 p-0'>{(`${orderItem.description}`).toLowerCase()}</p>
                    <input
                    type="text"
                    value={getInstruction(orderItem._id)}
                    onChange={(e) => handleItemInstruction(orderItem._id, index, e.target.value)}
                    placeholder="Add Instruction"
                  />
                  </div>
                </div>
                <div className='d-flex'>
                  <p className='px-1'>€{(`${orderItem.price}`).toLowerCase()}</p>
                  <div className='addItemButton'>
                  {
                    (
                      (findItem(orderItem._id) && getQuantity(orderItem._id)>0)
                      ?
                      <div className='countItemBtn d-flex justify-content-evenly'>
                        <div className='minusBtn' onClick={() => reduceItem(orderItem._id)} >
                          -
                        </div>
                        <div>
                        {getQuantity(orderItem._id)}
                        </div>
                        <div onClick={() => increaseItem(orderItem._id)}>
                          +
                        </div>
                      </div>
                      :
                      <div className='bg_Success countItemBtn text-light text-center' onClick={() => addItem(orderItem, index)}>
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
      {totalAmount===0 &&
      <div className='h-100 d-flex align-items-center justify-content-center text-dark'>
        <h6 className='text-center'>Please Select Items To Confirm Order</h6>
      </div>
      }
      <div className='d-flex justify-content-center my-5' varient="bottom">
        {totalAmount>0 &&  <Link className='no-underline' onClick={()=>hideViewItems()}> <button onClick={() => cancelOrder()} className='basicButton bg-danger border-danger countItemBtn text-light text-center'><MdCancel className='mx-1' />Cancel Order</button> </Link>}
        <button onClick={() => hideViewItems()} className='basicButton add-more-item-btn bg-primary countItemBtn text-light border-primary text-center mx-3'> <AiOutlineAppstoreAdd className='mx-1' /> Add More Items</button>
        {totalAmount>0 && <Link className='no-underline' > <button onClick={confirmOrder} className='basicButton bg_Success countItemBtn text-light text-center'>  <GiConfirmed className='mx-1' />Confirm Order {`€ (${totalAmount})`}</button> </Link>}
      </div>
      </Row>
      </>
    )
  }

export default VerifyOrder