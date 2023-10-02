import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Menu.css'
import '../../index.css'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Image, Dropdown, Button } from 'react-bootstrap'
import { LiaLessThanSolid } from 'react-icons/lia'
import {AiOutlineReload} from 'react-icons/ai'
import {GiShoppingCart} from 'react-icons/gi'
import {MdRestaurantMenu} from 'react-icons/md'
import {VscClearAll} from 'react-icons/vsc'
import {GiConfirmed} from 'react-icons/gi'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewItems from '../ViewItems/ViewItems';

const Menu = () => {

  const [loading, setLoading] = useState(true)
  const [menuItems, setMenuItems] = useState([])
  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [selectedCategoryName, setSelectedCategoryName] = useState('Category')
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [orderItems, setOrderItems] = useState([])
  const [itemInstruction, setItemInstruction] = useState([])
  const [menuItemPage, setMenuItemPage] = useState(1)
  const [categoryItemPage, setCategoryItemPage] = useState(1)
  const [isViewItems, setIsViewItems] = useState(false)
  const [allOrderItems, setAllOrderItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const assetId = queryParameters.get("assetId")

  const fetchData = async (page) => {
    const response = await fetch(`http://194.163.149.48:3002/admin/menu/get-menu?pageNo=${page}&size=10`)
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }
  const fetchMenuByCategoryId = async (id, page) => {
    const response = await fetch(`http://194.163.149.48:3002/admin/menu/get-menu?pageNo=${page}&size=10&categoryId=${id}`)
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
    // Fetch 
    const localStoredItems = localStorage.getItem('localItems');
    if(localStoredItems) {
      setOrderItems(JSON.parse(localStoredItems))
    }
    // Fetch All Order Items From Local Storage
    const fetchLocalAllOrderItems = localStorage.getItem('localAllOrderItems');
    if(fetchLocalAllOrderItems) {
      setAllOrderItems(JSON.parse(fetchLocalAllOrderItems))
    }
  }, [])

  const clearItems = () => {
    const updatedArray = [];
    setOrderItems([...updatedArray]);
    setAllOrderItems([...updatedArray]);
    localStorage.setItem('localItems', JSON.stringify(updatedArray));
    localStorage.setItem('localAllOrderItems', JSON.stringify(updatedArray));
  };

  // Function to delete the stored array from localStorage
  const cancelOrder = () => {
    clearItems();
    localStorage.removeItem('localItems');
    localStorage.removeItem('localAllOrderItems');
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
  
  // setCategory by id
  function showMenuByCategory(category) {
    
    if(category==='All') {
      setCategoryItemPage(1)
      setSelectedCategoryName('Category')
      fetchMenuItem()
    }
    else{
      setCategoryItemPage(1)
      setSelectedCategoryName(category.name)
      setSelectedCategoryId(category._id)
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
  };
  
  // Order Section
  // 1. Add items
  function addItem(item, index) {
    addInAllOrderItems(item)
    orderItems.push({menuId: `${item._id}`, quantity: parseInt(`${'1'}`), description: itemInstruction[index]})
    setOrderItems([...orderItems])
    localStorage.setItem('localItems', JSON.stringify(orderItems));
    calculateTotalAmount()
  }
  
  // 2. Remove Item
  function removeItem(itemId) {
    calculateTotalAmount()
    // Find the index of the item to remove
    const indexToRemove = orderItems.findIndex(item => item.menuId === itemId);
    // Check if the item exists in the array
    if (indexToRemove !== -1) {
      // Use splice to remove the item from the copied array
      const updated = orderItems.splice(indexToRemove, 1);
      setOrderItems(updated);
      // console.log('order item', orderItems)
    }
    localStorage.setItem('localItems', JSON.stringify(orderItems));
    calculateTotalAmount()
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
    calculateTotalAmount()
  }

  // 4. reduce Item
  function reduceItem(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        // If the object's id matches the target id, update the specified property
        item.quantity = item.quantity-1; // Update the 'name' property
        // console.log('item quantity', item.quantity)
        if(item.quantity===0) {
          removeItem(itemId)
        }
      }
    }
    setOrderItems([...orderItems])
    localStorage.setItem('localItems', JSON.stringify(orderItems));
    calculateTotalAmount()
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

  // 6. Get quantity
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

  
  // Paggination
  const loadNextMenuPage = () => {
    const newPage = menuItemPage+1;
    setMenuItemPage(newPage)
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
    setCategoryItemPage(newPage)
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
      
      // toggle view added items
      function hideViewItems() {
        setIsViewItems(false);
      }
      
      // find item in all order items
    function findInAllOrderItems(itemId) {
    for (const item of allOrderItems) {
      if (item._id === itemId) {
        return true;
      }
    }
    return false;
  }

  // store all added items 
  function addInAllOrderItems(item) {
    if(!findInAllOrderItems(item._id)){
      allOrderItems.push({_id: item._id, name: item.name, price: item.price, description: item.description})
      // setOrderItems([...allOrderItems])
      localStorage.setItem('localAllOrderItems', JSON.stringify(allOrderItems));
    }
  }

  // get price
  function getPrice(itemId) {
    for (const item of allOrderItems) {
      if (item._id === itemId) {
        return item.price
      }
    }
  }

  // total amount
  function calculateTotalAmount() {
    let total = 0;
    allOrderItems.map((data, i)=> {
      if(findItem(data._id)) {
        const itemPrice = getPrice(data._id)
        const noOfItems = getQuantity(data._id)
        total = total + (itemPrice*noOfItems)
        } 
      })
      setTotalAmount(total)
    }

    // Store All Order Item Array in Local Storage
    const localAllOrderItems = localStorage.getItem('localAllOrderItems');
    if(localAllOrderItems) {

    }

    // Place order
    function placeOrder() {
      calculateTotalAmount()
      setIsViewItems(true)
    }
    
    // Confirm Order
    const confirmOrder = () => {
      callAxiosAPI()
      clearItems()
    }

    return (
    <>
    {!isViewItems ?
      <Container className='menuContainer text-light bg_Dark p-0 d-xs-flex' fluid>
        
        <div className='fixedNavbar d-flex justify-content-between align-items-center'>
          <div className='d-flex text-light align-items-center py-2'>
            <Link to="/" className='text-light'>
              <div className='menuLogo d-flex align-items-center mx-3 p-2'>
                <LiaLessThanSolid size={20} />
              </div>
            </Link>
            <div>
              <h4 className='m-0'>Room Eats Menu</h4>
            </div>
          </div>
          <div className='d-flex align-items-center'>
            <Dropdown className='bg-none borderSuccess'>
              <Dropdown.Toggle variant='success' className="d-flex align-items-center categoryDropdown bold-text dropdown-basic bg-none border-2 border-success px-2 mx-2">
                <MdRestaurantMenu className='mx-1' /> <span className='mx-1'> {selectedCategoryName} </span> 
              </Dropdown.Toggle>
              <Dropdown.Menu className='p-2'>
                <Dropdown.Item className='' onClick={()=> showMenuByCategory('All')}>All</Dropdown.Item>
                {
                  categoryLoading 
                  ?
                  <p>Loading...</p>
                  :
                  <>
                    {category.map((category, index)=>(
                      <>
                        <Dropdown.Item key={index} onClick={()=> showMenuByCategory(category)}>{category.name}</Dropdown.Item>
                      </>
                    ))}
                  </>
                }
              </Dropdown.Menu>
            </Dropdown>
            {orderItems.length>0 && 
            <div className='position-relative c-pointer' onClick={()=>placeOrder()}>
              <div className='orderItemsCount position-absolute bg-danger'>
                <p className='m-0 p-1'>{orderItems.length}</p>
              </div>
              <GiShoppingCart size={30} className='mx-2' />
            </div>}
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
            <h3 className='text-center mt-5 py-4 h-100'>Loading...</h3>
            :
            <>
              <Row className='cardContainer p-0 m-0 mt-5 py-4 px-2'>
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
                { (menuItems.length>0) ? ((selectedCategoryName === 'Category') ?
                    <Button variant='info' className='py-1 my-3 d-flex align-items-center' onClick={()=>loadNextMenuPage()}> <AiOutlineReload className='mx-1' /> <span className='mx-1'>View More</span> </Button>
                    :
                    <Button variant='info' className='py-1 my-3 d-flex align-items-center' onClick={()=>loadNextCategoryPage()}><AiOutlineReload className='mx-1' /> <span className='mx-1'>View More</span></Button>
                  )
                  :
                  <h3>No Items</h3>
                }
              </div>
              <div className='d-flex justify-content-center m-5' varient="bottom">
                {
                  orderItems.length ?
                  <>
                    <button onClick={() => clearItems()} className='basicButton bg-danger countItemBtn text-light border-danger text-center mx-3'><VscClearAll className='mx-1'/>Clear Items</button>
                    <button onClick={()=>placeOrder()}  className='basicButton bg_Success countItemBtn text-light text-center '> <GiConfirmed className='mx-1'/>Place Order</button>
                  </>
                  :
                  <h6>Please slelect items to pLace order</h6>
                }
              </div>
            </>
        }
      </Container >
      :
      <ViewItems className='d-md-none d-none' 
        menuItems={menuItems} 
        orderItems={orderItems}
        getInstruction={getInstruction}
        handleItemInstruction={handleItemInstruction}
        findItem={findItem}
        getQuantity={getQuantity}
        reduceItem={reduceItem}
        increaseItem={increaseItem}
        confirmOrder={confirmOrder}
        cancelOrder={cancelOrder}
        clearItems={clearItems}
        itemInstruction={itemInstruction}
        addItem={addItem}
        hideViewItems={hideViewItems}
        allOrderItems={allOrderItems}
        totalAmount={totalAmount}
      />
    }
    </>
  )
}

export default Menu