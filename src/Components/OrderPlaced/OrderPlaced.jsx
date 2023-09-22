import React from 'react'
import './OrderPlaced.css'
import '../../index.css'
import { Container } from 'react-bootstrap'
import { BsCheckLg } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const OrderPlaced = () => {

  const ListItemTextWithDetails = () => {

    const queryParameters = new URLSearchParams(window.location.search)
    const assetId = '/menu?assetId=' + queryParameters.get("assetId")

    return <Link to={assetId} > <button className='primaryButton mt-5'>Add More Orders</button> </Link >
  }

  return (
    <>
      <Container className='orderPlacedContainer d-flex justify-content-center align-items-center text-light'>
        <div className='orderPlacedDetails text-center'>
          <BsCheckLg size={60} className='borderRounded bg_Success p-1 m-3' />
          <h5>Order Placed Successfully</h5>
          <p className='colorLightGray'>Your Order has been placed. You can view order details from my account section.</p>
          <ListItemTextWithDetails />
        </div>
      </Container>
    </>
  )
}

export default OrderPlaced