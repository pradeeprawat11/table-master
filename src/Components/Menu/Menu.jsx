import {React, useState, useEffect} from 'react'
import './Menu.css'
import '../../index.css'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card} from 'react-bootstrap'
import {LiaLessThanSolid} from 'react-icons/lia'
import menuList from '../../data/menu'

const Menu = () => {
  
  // Initialize the array in state, or load it from localStorage if available
  const [myArray, setMyArray] = useState(() => {
    const storedArray = localStorage.getItem('myArray');
    return storedArray ? JSON.parse(storedArray) : (Array(menuList.length).fill(0));
  });

  // Function to increment the value at a specific index
  const incrementAtIndex = (index, itemPrice) => {
    const updatedArray = [...myArray];
    updatedArray[index] += 1;
    setMyArray(updatedArray);
    localStorage.setItem('myArray', JSON.stringify(updatedArray));
    // const amt = [...amount]
    // setAmount(amt+itemPrice)
  }

    

  // Function to decrement the value at a specific index
  const decrementAtIndex = (index, itemPrice) => {
    const updatedArray = [...myArray];
    updatedArray[index] -= 1;
    setMyArray(updatedArray);
    localStorage.setItem('myArray', JSON.stringify(updatedArray));
    // setAmount(amount-itemPrice)

  };

  useEffect(() => {
    
    // Load the array from localStorage when the component mounts
    const storedArray = localStorage.getItem('myArray');
    if (storedArray) {
      setMyArray(JSON.parse(storedArray));
    }
    
  }, []);

  // Function to delete the stored array from localStorage
  const cancelOrder = () => {
    clearItems();
    localStorage.removeItem('myArray');
  };

  const clearItems = () => {
    // const updatedArray = [...myArray];
    const updatedArray = Array(menuList.length).fill(0);
    setMyArray(updatedArray);
    localStorage.setItem('myArray', JSON.stringify(updatedArray));
  };

  
  // function totalAmount() {
  //   setAmount(0)
  //   menuList.map((menuList, index)=>{
  //     amount += (myArray[index]*menuList.price);
  //   })

  //   setAmount(amount)
  // }
  return (
    <>
      <Container className='menuContainer bg_Dark p-0 d-xs-flex' fluid> 
        <div className='d-flex text-light align-items-center py-2'>
          <Link to="/" className='text-light'>
            <div className='menuLogo d-flex align-items-center mx-3 p-2'>
              <LiaLessThanSolid size={20} />
            </div>
          </Link>
          
          <div>
            <h4 className='m-0'>Digital Menu</h4>
          </div>
        </div>
        <Row className='p-0 m-0 mt-3 px-2'>
        {menuList.map((menuList, index) => (
          <Col className='p-2' xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
          <Card className='bg-dark text-light'>
          <Card.Img className='' variant="top" src={menuList.picture} />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <span className=''>€{menuList.price}</span>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              {
                ((myArray[index]===0)
                    ? 
                    (<div className='bg_Success countItemBtn text-light text-center' onClick={() => incrementAtIndex(index, menuList.price)}>
                      +
                    </div>)
                    : 
                  (<div className='countItemBtn d-flex justify-content-evenly'>
                    <div className='minusBtn' onClick={() => decrementAtIndex(index)} >
                      -
                    </div>
                    <div>
                      {myArray[index]}
                    </div>
                    <div onClick={() => incrementAtIndex(index, menuList.price)}>
                      +
                    </div>
                </div>)  
                )
              }
            </Card.Body>
          </Card>
          </Col>
        ))}
        </Row>
        <div className='d-flex justify-content-center py-5' varient="bottom">
          
          <Link to="/"> <button onClick={()=> cancelOrder()} className='bg-danger border-danger countItemBtn text-light text-center'>Cancel Order</button> </Link>
          <button onClick={()=> clearItems()} className='bg-primary countItemBtn text-light border-primary text-center mx-3'>Clear Items</button>
          <Link to="/payment"> <button className='bg_Success countItemBtn text-light text-center'>Place Order : Amount {"("} {0} {")"} </button> </Link>
        </div>
        
      </Container>
    </>
  )
}

export default Menu