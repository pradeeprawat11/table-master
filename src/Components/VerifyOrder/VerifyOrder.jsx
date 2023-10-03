import {React} from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import { LiaLessThanSolid } from 'react-icons/lia'
import { Link } from 'react-router-dom'
import {MdCancel} from 'react-icons/md'
import {AiOutlineAppstoreAdd} from 'react-icons/ai'
import {GiConfirmed} from 'react-icons/gi'
import { ToastContainer } from 'react-toastify';

const VerifyOrder = (props) => {
    const {getInstruction, handleItemInstruction, findItem, getQuantity, reduceItem, increaseItem, confirmOrder, cancelOrder, addItem, hideViewItems, allOrderItems, totalAmount} = props;
    
    return (
      <>
          <Container className='menuContainer text-light bg_Dark p-0 d-xs-flex' fluid>
            <div className='fixedNavbar d-flex text-light align-items-center py-2'>
              <Link onClick={()=> hideViewItems()} className='text-light'>
                <div className='menuLogo d-flex align-items-center mx-3 p-2'>
                  <LiaLessThanSolid size={20} />
                </div>
              </Link>
              <div>
                <h4 className='m-0'>Confirm Order</h4>
              </div>
            </div>
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
                <Row className='cardContainer p-0 m-0 mt-5 py-4 mt-3 px-2'>
                  {allOrderItems.map((data, index) =>(
                    findItem(data._id) && 
                    <Col key={index} className='p-2 ' xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Row className='cardDetailContainer h-100 rounded bg_LightDark p-0 m-0 d-flex justify-content-center align-items-center'>
                        <Col className='m-0 p-0 d-flex justify-content-center align-items-center' xs={3} sm={12}>
                          <div className='imageContainer'>
                            <Image className='cardImage w-100 h-100' src="https://howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg" />
                          </div>
                        </Col>
                        <Col className='itemDetailContainer' xs={6} sm={12}>
                          <h5 className='p-0 m-0'>{(`${data.name}`).toLowerCase()}</h5>
                          <p className='p-0 m-0'>€{(`${data.price}`).toLowerCase()}</p>
                          <p className='p-0 m-0 colorLightGray'>{(`${data.description}`).toLowerCase()}</p>
                          <input
                            type="text"
                            value={getInstruction(data._id)}
                            onChange={(e) => handleItemInstruction(data._id, index, e.target.value)}
                            placeholder="Add Instruction"
                          />
                        </Col>
                        <Col className='py-3' xs={3} sm={12}>
                          {
                            (
                              (findItem(data._id) && getQuantity(data._id)>0)
                              ?
                              <div className='countItemBtn d-flex justify-content-evenly'>
                                <div className='minusBtn' onClick={() => reduceItem(data._id)} >
                                  -
                                </div>
                                <div>
                                {getQuantity(data._id)}
                                </div>
                                <div onClick={() => increaseItem(data._id)}>
                                  +
                                </div>
                              </div>
                              :
                              <div className='bg_Success countItemBtn text-light text-center' onClick={() => addItem(data, index)}>
                                  +
                              </div>
                            )
                          }
                        </Col>
                      </Row>
                    </Col>
                  ))}
                </Row>
                {totalAmount===0 &&
                  <h6 className='text-center'>Please Select Items To Confirm Order</h6>
                }
                <div className='d-flex justify-content-center my-5' varient="bottom">
                  {totalAmount>0 &&  <Link className='no-underline' onClick={()=>hideViewItems()}> <button onClick={() => cancelOrder()} className='basicButton bg-danger border-danger countItemBtn text-light text-center'><MdCancel className='mx-1' />Cancel Order</button> </Link>}
                  <button onClick={() => hideViewItems()} className='basicButton bg-primary countItemBtn text-light border-primary text-center mx-3'> <AiOutlineAppstoreAdd className='mx-1' /> Add More Items</button>
                  {totalAmount>0 && <Link className='no-underline' to="/orderPlaced" > <button onClick={confirmOrder} className='basicButton bg_Success countItemBtn text-light text-center'>  <GiConfirmed className='mx-1' />Confirm Order {`€ (${totalAmount})`}</button> </Link>}
                </div>
        </Container >
      </>
    )
  }

export default VerifyOrder