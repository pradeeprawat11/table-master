import {React} from 'react'
import '../../index.css'
import './Payment.css'
import { Container, Row, Form, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LiaLessThanSolid } from 'react-icons/lia'
import onlinePayment from '../../data/onlinePayment'
import cardPayment from '../../data/cardPayment'
import {BsFillPlusSquareFill} from 'react-icons/bs'

const Payment = () => {

  // const[selectedPayment, setSelectedPayment] = useState(null);
  
  return (
    <>
      <Container className='paymentContainer bg_Dark p-0 m-0 h-100' fluid>
        <div className='fixedNavbar d-flex text-light align-items-center py-2'>
          <Link to="/menu" className='text-light'>
            <div className='menuLogo d-flex align-items-center mx-3 p-2'>
              <LiaLessThanSolid size={20} />
            </div>
          </Link>
          <div>
            <h4 className='m-0'>Digital Menu</h4>
          </div>
        </div>
        <Row className='text-light d-flex justify-content-center align-items-center p-3 m-0 mt-5 py-4'>
          <Form className='paymentMethods w-100 p-0'>
            {cardPayment.map((cardPayment, index) => (
                <div key={index} className='paymentOption bg_LightDark  d-flex justify-content-between p-2 my-2'>
                  <div className='d-flex justify-content-start align-items-center'>
                    <div className='paymentLogo'>
                      <Image className='w-100' src={cardPayment.logoUrl} />
                    </div>
                    <div className='mx-2'>
                      <h6 className='p-0 m-0'>{cardPayment.number}</h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center'>
                    <Form.Check
                    name="group1"
                    type='radio'
                    // onChange={() => setSelectedPayment(`${cardPayment.number}`)}
                    />
                  </div>
                </div>
            ))}

            <div className='d-flex align-items-center textPrimary'>
              <BsFillPlusSquareFill />
              <p className='m-2 p-0'>Add Card</p>
            </div>
            
            {onlinePayment.map((onlinePayment, index) => (
                <div key={index} className='paymentOption bg_LightDark  d-flex justify-content-between p-2 my-2'>
                  <div className='d-flex justify-content-start align-items-center'>
                    <div className='paymentLogo'>
                      <Image className='w-100' src={onlinePayment.logoUrl} />
                    </div>
                    <div className='mx-2'>
                      <h6 className='p-0 m-0'>{onlinePayment.name}</h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center'>
                    <Form.Check
                    name="group1"
                    type='radio'
                    // onChange={() => setSelectedPayment(`${onlinePayment.name}`)}
                    />
                  </div>
                </div>
            ))}
            <Link to="/orderPlaced"><button className='bg_Success w-100 border-0 text-light p-2 px-5 mt-5'>Next</button></Link>
          </Form>
        </Row>
      </Container>
    </>
    
   
  );
}

export default Payment