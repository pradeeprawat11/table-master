import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Menu.css'
import '../../index.css'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Image, Dropdown } from 'react-bootstrap'
import { LiaLessThanSolid } from 'react-icons/lia'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Menu = (props) => {

  const [itemCount, setItemCount] = useState([])
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState()

  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const assetId = queryParameters.get("assetId")

  const fetchData = async () => {
    const response = await fetch('http://194.163.149.48:3002/admin/menu/get-menu?pageNo=1&size=100')
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }
  const fetchCategory = async () => {
    const response = await fetch('http://194.163.149.48:3002/admin/item-category')
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
    
    fetchCategory()
      .then((res) => {
        setCategory(res.data); // Update the state with the fetched data
        setCategoryLoading(false); // Set loading to false
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setCategoryLoading(true); // Set loading to false in case of an error
      });

    const storedArray = localStorage.getItem('localArray');
    if (storedArray) {
      setItemCount(JSON.parse(storedArray));
    }
  }, [])

  if (data.length && !itemCount.length) {
    setItemCount(Array(data.length).fill(0));
  }

  const incrementAtIndex = (index) => {
    const updatedArray = [...itemCount];
    updatedArray[index] += 1;
    setItemCount(updatedArray);
    localStorage.setItem('localArray', JSON.stringify(updatedArray));
  }

  // Function to decrement the value at a specific index
  const decrementAtIndex = (index) => {
    const updatedArray = [...itemCount];
    updatedArray[index] -= 1;
    setItemCount(updatedArray);
    localStorage.setItem('localArray', JSON.stringify(updatedArray));
  };

  const clearItems = () => {
    const updatedArray = Array(itemCount.length).fill(0);
    setItemCount(updatedArray);
    localStorage.setItem('localArray', JSON.stringify(updatedArray));
  };

  // Function to delete the stored array from localStorage
  const cancelOrder = () => {
    clearItems();
    localStorage.removeItem('localArray');
  };

  const items = [];
  function pushSelectedItems() {
    itemCount.map(function (count, i) {
      if (itemCount[i] > 0) {
        const item = { menuId: `${data[i]._id}`, quantity: parseInt(`${itemCount[i]}`) }
        items.push(item)
      }
    });
  }

  function callAxiosAPI() {

    let dataApi = JSON.stringify({
      "assetId": `${assetId}`,
      "menu": items
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://194.163.149.48:3002/reservation',
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataApi
    };

    axios.request(config)
      .then((response) => {
        toast.success('Success !', {
          position: toast.POSITION.TOP_RIGHT
        });
        navigate(`/orderPlaced?assetId=` + assetId);
      })
      .catch((error) => {
        console.log(error);
        toast.error('Invalid Asset !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }

  const placeOrder = () => {
    pushSelectedItems()
    callAxiosAPI()
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
            <h4 className='m-0'>Room Eats Menu</h4>
          </div>
          <div>
            <Dropdown className=''>
              <Dropdown.Toggle id="categoryDropdown dropdown-basic">
                Category
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  categoryLoading 
                  ?
                  <p>Loading...</p>
                  :
                  <>
                    {category.map((category, index)=>(
                      <>
                        <Dropdown.Item onClick={()=> setSelectedCategory(category._id)}>{category.name}</Dropdown.Item>
                      </>
                    ))}
                  </>
                }
              </Dropdown.Menu>
          </Dropdown>
          </div>
          <div>
           <input></input>  search
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
        {
          loading
            ?
            <h3 className='text-center mt-5'>Loading...</h3>
            :
            <>
              <Row className='cardContainer p-0 m-0 mt-3 px-2'>
                {data.map((data, index) =>(
                  <>
                    {
                    selectedCategory === data.categoryId
                    ?
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
                      </Col>
                      <Col className='py-3' xs={3} sm={12}>
                        {
                          ((itemCount[index] === 0)
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
                  :
                  <></>
                  }
                  </>
                ))}
              </Row>
              <div className='d-flex justify-content-center py-5' varient="bottom">
                <Link to="/"> <button onClick={() => cancelOrder()} className='bg-danger border-danger countItemBtn text-light text-center'>Cancel Order</button> </Link>
                <button onClick={() => clearItems()} className='bg-primary countItemBtn text-light border-primary text-center mx-3'>Clear Items</button>
                <Link > <button onClick={placeOrder} className='bg_Success countItemBtn text-light text-center'> Place Order</button> </Link>
              </div>
            </>
        }
      </Container >
    </>
  )
}

export default Menu