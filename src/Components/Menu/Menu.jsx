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
  const [selectedCategoryName, setSelectedCategoryName] = useState('Category')
  const [menuApiItems, setMenuApiItems] = useState(10)
  const [orderItems, setOrderItems] = useState([])
  const [itemInstruction, setItemInstruction] = useState([])


  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const assetId = queryParameters.get("assetId")

  const fetchData = async () => {
    // console.log('fetch data calling')
    const response = await fetch(`http://194.163.149.48:3002/admin/menu/get-menu?pageNo=1&size=${menuApiItems}`)
    // console.log(menuApiItems)
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }
  const fetchMenuByCategoryId = async (id) => {
    // console.log('fetchMenuByCategoryId calling')
    const response = await fetch(`http://194.163.149.48:3002/admin/menu/get-menu?pageNo=1&size=10&categoryId=${id}`)
    // console.log('Id while calling api', id)
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }

  const fetchCategory = async () => {
    // console.log('fetchCategory calling')
    const response = await fetch('http://194.163.149.48:3002/admin/item-category')
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }

  useEffect(() => {
    // console.group('UseEffect Calling')
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

      if (data.length && !itemInstruction.length) {
        setItemInstruction(Array(data.length).fill(''));
      }

  }, [])

  

  if (data.length && !itemCount.length) {
    setItemCount(Array(data.length).fill(0));
  }

  // const incrementAtIndex = (index) => {
  //   const updatedArray = [...itemCount];
  //   updatedArray[index] += 1;
  //   setItemCount(updatedArray);
  //   localStorage.setItem('localArray', JSON.stringify(updatedArray));
  // }

  // Function to decrement the value at a specific index
  // const decrementAtIndex = (index) => {
  //   const updatedArray = [...itemCount];
  //   updatedArray[index] -= 1;
  //   setItemCount(updatedArray);
  //   localStorage.setItem('localArray', JSON.stringify(updatedArray));
  // };

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

  function callAxiosAPI() {
    let dataApi = JSON.stringify({
      "assetId": `${assetId}`,
      "menu": orderItems
    });

    // console.log(orderItems)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://194.163.149.48:3002/reservation',
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataApi
    };

    // console.log(dataApi)

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

  // Place Order
  const placeOrder = () => {
    // pushSelectedItems()
    callAxiosAPI()
    clearItems()
  }

  const viewMore = () => {
    setMenuApiItems(menuApiItems+10)
    // console.log(menuApiItems)
    // const val = menuApiItems + 10;
    // console.log('viewmoe', menuApiItems)
    fetchData()
      .then((res) => {
        setData(res.data)
      })
      .catch((e) => {
        console.log(e.message)
        setLoading(true)
      })
  }

  // setCategory by id
  function showMenuByCategory(category) {
    if(category==='All') {
      setSelectedCategoryName('Category')
      // console.log('selected category', category)
      fetchData()
      .then((res) => {
        setData(res.data)
      })
      .catch((e) => {
        console.log(e.message)
        setLoading(true)
      })
    }
    else{
      setSelectedCategoryName(category.name)
      // console.log('selected category', category._id)
      fetchMenuByCategoryId(category._id)
      .then((res) => {
          setData(res.data)
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
          setCategoryLoading(true); // Set loading to false in case of an error
        });
    }
    setItemInstruction(Array(data.length).fill(''));
  }

  // keep input
  const handleItemInstruction = (itemId, index, newValue) => {
    const updatedValues = [...itemInstruction];
    updatedValues[index] = newValue;
    setItemInstruction(updatedValues);
    addInstruction(itemId, index)
  };

  // Order Section
  // create array of objects
  // 1. Add items
  function addItem(item, index) {
    orderItems.push({menuId: `${item._id}`, quantity: parseInt(`${'1'}`), description: itemInstruction[index]})
    setOrderItems([...orderItems])
  }
  
  // 2. Remove Item
  function removeItem(itemId) {
    // Find the index of the item to remove
    const indexToRemove = orderItems.findIndex(item => item.menuId === itemId);
    // console.log('remove index', indexToRemove)
    // Check if the item exists in the array
    if (indexToRemove !== -1) {
      // Use splice to remove the item from the copied array
      const updated = orderItems.splice(indexToRemove, 1);
      setOrderItems(updated);
      // console.log('order item', orderItems)
    }
  }

  // 3. increase Item
  function increaseItem(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        // If the object's id matches the target id, update the specified property
        item.quantity = item.quantity+1; // Update the 'name' property
      }
    }
    setOrderItems([...orderItems])
  }

  // 4. reduce Item
  function reduceItem(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        // If the object's id matches the target id, update the specified property
        item.quantity = item.quantity-1; // Update the 'name' property
        console.log('item quantity', item.quantity)
        if(item.quantity===0) {
          removeItem(itemId)
        }
      }
    }
    setOrderItems([...orderItems])
  }

  // 5. Find Item
  function findItem(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        return true;
      }
    }
    return false;
  }

  // 6. Get Index
  function getQuantity(itemId)  {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        // If the object's id matches the target id, update the specified property
        return item.quantity // Update the 'name' property
      }
    }
  }

  // 7. Add Instruction
  function addInstruction(itemId, index) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        // If the object's id matches the target id, update the specified property
        item.description = itemInstruction[index]; // Update the 'name' property
      }
    }
  }

  console.log('Order Items ', orderItems)
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
            <Dropdown className='bg-none'>
              <Dropdown.Toggle variant='success' className="categoryDropdown dropdown-basic bg-none border-success p-1 mx-2">
                {selectedCategoryName}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={()=> showMenuByCategory('All')}>All</Dropdown.Item>
                {
                  categoryLoading 
                  ?
                  <p>Loading...</p>
                  :
                  <>
                    {category.map((category, index)=>(
                      <>
                        <Dropdown.Item onClick={()=> showMenuByCategory(category)}>{category.name}</Dropdown.Item>
                      </>
                    ))}
                  </>
                }
              </Dropdown.Menu>
          </Dropdown>
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
                          value={itemInstruction[index]}
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
              <div className='d-flex justify-content-center text-center'>
                <p onClick={()=>viewMore()}>view more</p>
              </div>
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