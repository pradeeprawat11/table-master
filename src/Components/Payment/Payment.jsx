import React from 'react'
import './Payment.css'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LiaLessThanSolid } from 'react-icons/lia'

const Payment = () => {
  return (
    <>
      <Container className='paymentContainer bg_Dark  p-0' fluid> 
        <div className='d-flex text-light align-items-center py-2'>
          <Link to="/menu" className='text-light'>
            <div className='menuLogo d-flex align-items-center mx-3 p-2'>
              <LiaLessThanSolid size={20} />
            </div>
          </Link>
          <div>
            <h4 className='m-0'>Payment</h4>
          </div>
        </div>
        <div className='d-flex justify-content-center align-items-center text-light'>
            <Row className='paymentMethods m-0 border'>
                <Col xs={12}>
                    MasterCard
                </Col>
                <p>Add Card</p>
                <Col xs={12}>
                    Paypal
                </Col>
                <Col xs={12}>
                    Paypal
                </Col>
                <Col xs={12}>
                    Paypal
                </Col>
                <Col xs={12}>
                    Paypal
                </Col>
            </Row>
        </div>
      </Container>
    </>
  )
}

export default Payment