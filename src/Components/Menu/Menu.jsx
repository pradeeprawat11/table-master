import {React, useState, useEffect} from 'react'
import './Menu.css'
import '../../index.css'
import { Link, useParams } from 'react-router-dom'
import { Container, Row, Col, Card, Image} from 'react-bootstrap'
import {LiaLessThanSolid} from 'react-icons/lia'

const Menu = () => {

  const [itemCount, setItemCount] = useState([])
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const fetchData = async () => {
    const response = await fetch('http://194.163.149.48:3002/admin/menu/get-menu')
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }
  useEffect(() => {
    fetchData()
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((e) => {
        console.log(e.message)
        setLoading(true)
      })

      const storedArray = localStorage.getItem('myArray');
      if (storedArray) {
        setItemCount(JSON.parse(storedArray));
      }
  }, [])


  if(data.length && !itemCount.length){
    setItemCount(Array(data.length).fill(0));
  }

  const incrementAtIndex = (index) => {
    const updatedArray = [...itemCount];
    updatedArray[index] += 1;
    setItemCount(updatedArray);
    localStorage.setItem('myArray', JSON.stringify(updatedArray));
  }

  // Function to decrement the value at a specific index
  const decrementAtIndex = (index) => {
    const updatedArray = [...itemCount];
    updatedArray[index] -= 1;
    setItemCount(updatedArray);
    localStorage.setItem('myArray', JSON.stringify(updatedArray));
  };

  const clearItems = () => {
    const updatedArray = Array(itemCount.length).fill(0);
    setItemCount(updatedArray);
    localStorage.setItem('myArray', JSON.stringify(updatedArray));
  };

   // Function to delete the stored array from localStorage
   const cancelOrder = () => {
    clearItems();
    localStorage.removeItem('myArray');
  };

  function callAPI() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "assetId": "6502fd62e0ae56858959419e",
      "menu": [
        `${items}`
      ]
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

  fetch("http://194.163.149.48:3002/reservation", requestOptions)
  .then(response => response.text())
  // .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

  const items = []
  function pushSelectedItems() {
    itemCount.map(function (count, i) {
      if(itemCount[i]>0){
        const item = {menuId:`${data[i]._id}`,quantity:parseInt(`${itemCount[i]}`)}
        items.push(item)
      }
    });
  }

  const placeOrder = () => {
    pushSelectedItems()
    callAPI()
    clearItems()
  }

  return (
    <>
      <Container className='menuContainer text-light bg_Dark p-0 d-xs-flex' fluid> 
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

        { 
        loading 
        ? 
          <h3 className='text-center mt-5'>Loading...</h3> 
        :
        <>
        <Row className='cardContainer p-0 m-0 mt-3 px-2'>
        {data.slice(0,10).map((data, index) => (
          <Col key={index} className='p-2 ' xs={12} sm={6} md={4} lg={3} xl={2}>
            <Row className='cardDetailContainer rounded bg_LightDark p-0 m-0 d-flex justify-content-center align-items-center'>
              <Col className='m-0 p-0 d-flex justify-content-center align-items-center' xs={3} sm={12}>
                <div className='imageContainer'>
                  <Image className='cardImage w-100 h-100' src="https://howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg"/>
                </div>
              </Col>
              <Col className='itemDetailContainer' xs={6} sm={12}>
                  <h6 className='p-0 m-0'>{(`${data.name}`).toLowerCase()}</h6>
                  <p className='p-0 m-0'>€{(`${data.price}`).toLowerCase()}</p>
                  <p className='p-0 m-0'>{(`${data.description}`).toLowerCase()}</p>
              </Col>
              <Col className='py-3' xs={3} sm={12}>
                {
                  ((itemCount[index]===0)
                      ? 
                      (<div className='bg_Success countItemBtn text-light text-center' onClick={() => incrementAtIndex(index, data.price)}>
                        +
                      </div>)
                      : 
                    (<div className='countItemBtn d-flex justify-content-evenly'>
                      <div className='minusBtn' onClick={() => decrementAtIndex(index)} >
                        -
                      </div>
                      <div>
                        {itemCount[index]}
                      </div>
                      <div onClick={() => incrementAtIndex(index, data.price)}>
                        +
                      </div>
                  </div>)  
                  )
                }
              </Col>
            </Row>
          </Col>
        ))}
        </Row>
        <div className='d-flex justify-content-center py-5' varient="bottom">
          <Link to="/"> <button onClick={()=> cancelOrder()} className='bg-danger border-danger countItemBtn text-light text-center'>Cancel Order</button> </Link>
          <button onClick={()=> clearItems()} className='bg-primary countItemBtn text-light border-primary text-center mx-3'>Clear Items</button>
          <Link to="/orderPlaced"> <button onClick={placeOrder} className='bg_Success countItemBtn text-light text-center'>Place Order</button> </Link>
        </div>
      </>
        }
      </Container>
    </>
  )
}

export default Menu