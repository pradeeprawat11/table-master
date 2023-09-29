import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Menu.css'
import '../../index.css'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Image, Dropdown, Button } from 'react-bootstrap'
import { LiaLessThanSolid } from 'react-icons/lia'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Menu = (props) => {

  const [loading, setLoading] = useState(true)
  const [menuItems, setMenuItems] = useState([])
  const [category, setCategory] = useState([]);
  const [categoryPages, setCategoryPages] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [selectedCategoryName, setSelectedCategoryName] = useState('Category')
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [orderItems, setOrderItems] = useState([])
  const [itemInstruction, setItemInstruction] = useState([])
  const [menuItemCount, setMenuItemCount] = useState(10)
  const [menuItemPage, setMenuItemPage] = useState(1)
  const [categoryItemPage, setCategoryItemPage] = useState(1)

  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const assetId = queryParameters.get("assetId")

  const fetchData = async (page) => {
    // console.log('fetch data calling')
    const response = await fetch(`http://194.163.149.48:3002/admin/menu/get-menu?pageNo=${page}&size=10`)
    // console.log(menuApiItems)
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }
  const fetchMenuByCategoryId = async (id, page) => {
    console.log('calling for page', page)
    const response = await fetch(`http://194.163.149.48:3002/admin/menu/get-menu?pageNo=${page}&size=10&categoryId=${id}`)
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

  // const fetchMenuByPagging()

  const fetchMenuItem = () => {
    fetchData(menuItemPage)
      .then((res) => {
        setMenuItems(res.data)
        setLoading(false)
      })
      .catch((e) => {
        console.log(e.message)
        setLoading(true)
      })
  }

  const fetchCategoryItem = () => {
    fetchCategory()
      .then((res) => {
        setCategory(res.data); // Update the state with the fetched data
        setCategoryLoading(false); // Set loading to false
        // if(category.length != categoryPages.length){
        //   setCategoryPages(Array(category.length).fill(1));
        // }
        // console.log(categoryPages)
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setCategoryLoading(true); // Set loading to false in case of an error
      });
  }

  useEffect(() => {

    fetchMenuItem()
    fetchCategoryItem()

    if (menuItems.length && !itemInstruction.length) {
      setItemInstruction(Array(menuItems.length).fill(''));
    }
    // if (category.length && !categoryPages.length) {
    //   setCategoryPages(Array(category.length).fill(1));
    // }

    const localStoredItems = localStorage.getItem('localItems');
    if(localStoredItems) {
      setOrderItems(JSON.parse(localStoredItems))
    }
  }, [])

  const clearItems = () => {
    const updatedArray = [];
    setOrderItems(updatedArray);
    localStorage.setItem('localItems', JSON.stringify(updatedArray));
  };

  // Function to delete the stored array from localStorage
  const cancelOrder = () => {
    clearItems();
    localStorage.removeItem('localItems');
  };

  function callAxiosAPI() {
    let dataApi = JSON.stringify({
      "assetId": `${assetId}`,
      "menu": orderItems
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
  
  // Load more Items
  const loadMoreItems = () => {
    setMenuItemCount(menuItemCount + 10); // Increase the count by 10 to fetch more items
    fetchMenuItem(); // Fetch the additional items
  };

  // setCategory by id
  function showMenuByCategory(category) {
    
    if(category==='All') {
      setSelectedCategoryName('Category')
      fetchMenuItem()
    }
    else{
      setCategoryItemPage(()=> 1)
      setSelectedCategoryName(category.name)
      setSelectedCategoryId(category._id)
      // console.log('selected category', category._id)
      fetchMenuByCategoryId(category._id, categoryItemPage)
      .then((res) => {
        setMenuItems(res.data)
      })
      .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
          setCategoryLoading(true); // Set loading to false in case of an error
        });
    }
    setItemInstruction(Array(menuItems.length).fill(''));
  }
  
  // keep input
  const handleItemInstruction = (itemId, index, newValue) => {
    const newupdatedValues = [...orderItems]
    for (const item of newupdatedValues) {
      if (item.menuId === itemId) {
        // If the object's id matches the target id, update the specified property
        item.description = newValue; // Update the 'name' property
      }
    }
    itemInstruction[index] = newValue

    setOrderItems(newupdatedValues)
    localStorage.setItem('localItems', JSON.stringify(orderItems));
    console.log(itemInstruction[index])
  };
  
  // Order Section
  // 1. Add items
  function addItem(item, index) {
    orderItems.push({menuId: `${item._id}`, quantity: parseInt(`${'1'}`), description: itemInstruction[index]})
    setOrderItems([...orderItems])
    localStorage.setItem('localItems', JSON.stringify(orderItems));
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
    localStorage.setItem('localItems', JSON.stringify(orderItems));
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
    localStorage.setItem('localItems', JSON.stringify(orderItems));
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
    localStorage.setItem('localItems', JSON.stringify(orderItems));
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
  // 6. PG Expenses
  function getInstruction(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        // If the object's id matches the target id, update the specified property
        return item.description
      }
    }
  }

  // 7. Add Instruction
  // function addInstruction(itemId, index) {
  //   for (const item of orderItems) {
  //     if (item.menuId === itemId) {
  //       // If the object's id matches the target id, update the specified property
  //       item.description = itemInstruction[index]; // Update the 'name' property
  //     }
  //   }
  // }

  // Place Order
  const placeOrder = () => {
    callAxiosAPI()
    clearItems()
  }

  // Paggination
  const loadNextMenuPage = () => {
    const newPage = menuItemPage+1;
    setMenuItemPage(menuItemPage+1)
    fetchData(newPage)
      .then((res) => {
        if(res.data.length>0) {
          setMenuItems(menuItems.concat(res.data))
        }
        setLoading(false)
      })
      .catch((e) => {
        console.log(e.message)
        setLoading(true)
      })
  }
  const loadNextCategoryPage = () => {
    const newPage = categoryItemPage+1
    setCategoryItemPage(categoryItemPage+1)
    fetchMenuByCategoryId(selectedCategoryId, newPage)
      .then((res) => {
        if(res.data.length>0) {
          setMenuItems(menuItems.concat(res.data))
        }
        setCategoryLoading(false)
      })
      .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
          setCategoryLoading(true); // Set loading to false in case of an error
      });
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
                        <Dropdown.Item  onClick={()=> showMenuByCategory(category)}>{category.name}</Dropdown.Item>
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
                {menuItems.map((menuItems, index) =>(
                  <Col key={index} className='p-2 ' xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Row className='cardDetailContainer h-100 rounded bg_LightDark p-0 m-0 d-flex justify-content-center align-items-center'>
                      <Col className='m-0 p-0 d-flex justify-content-center align-items-center' xs={3} sm={12}>
                        <div className='imageContainer'>
                          <Image className='cardImage w-100 h-100' src="https://howtostartanllc.com/images/business-ideas/business-idea-images/fast-food.jpg" />
                        </div>
                      </Col>
                      <Col className='itemDetailContainer' xs={6} sm={12}>
                        <h5 className='p-0 m-0'>{(`${menuItems.name}`).toLowerCase()}</h5>
                        <p className='p-0 m-0'>€{(`${menuItems.price}`).toLowerCase()}</p>
                        <p className='p-0 m-0 colorLightGray'>{(`${menuItems.description}`).toLowerCase()}</p>
                        <input
                          type="text"
                          // value={findItem(data._id) ? `${getInstruction(data._id)}` : `${itemInstruction[index]}`}
                          value={getInstruction(menuItems._id)}
                          onChange={(e) => handleItemInstruction(menuItems._id, index, e.target.value)}
                          placeholder="Add Instruction"
                        />
                      </Col>
                      <Col className='py-3' xs={3} sm={12}>
                        {
                          (
                            (findItem(menuItems._id) && getQuantity(menuItems._id)>0)
                            ?
                            <div className='countItemBtn d-flex justify-content-evenly'>
                              <div className='minusBtn' onClick={() => reduceItem(menuItems._id)} >
                                -
                              </div>
                              <div>
                              {getQuantity(menuItems._id)}
                              </div>
                              <div onClick={() => increaseItem(menuItems._id)}>
                                +
                              </div>
                            </div>
                            :
                            <div className='bg_Success countItemBtn text-light text-center' onClick={() => addItem(menuItems, index)}>
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
                {(selectedCategoryName === 'Category') ?
                  <Button onClick={()=>loadNextMenuPage()}>View More Menu</Button>
                  :
                  <Button onClick={()=>loadNextCategoryPage()}>View More Category</Button>
                }
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