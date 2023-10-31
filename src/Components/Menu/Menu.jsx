import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Menu.css'
import '../../index.css'
import { Link } from 'react-router-dom'
import { Col, Container, Dropdown, Image, Row, Accordion, Card, Button, ListGroup} from 'react-bootstrap'
import { LiaLessThanSolid } from 'react-icons/lia'
import {GiCrossMark, GiShoppingCart} from 'react-icons/gi'
import {MdRestaurantMenu} from 'react-icons/md'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyOrder from '../VerifyOrder/VerifyOrder';
import MainMenu from './MainMenu/MainMenu';
import CategoryMenu from './CategoryMenu/CategoryMenu';
import Logo from '../Images/Table_Master_Logo.png'
import { BsMenuButton, BsSearch } from 'react-icons/bs';
import {FiMenu} from 'react-icons/fi'
import {RxCross1} from 'react-icons/rx'

const Menu = () => {

  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [selectedCategoryName, setSelectedCategoryName] = useState('Category')
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [orderItems, setOrderItems] = useState([])
  const [menuItemPage, setMenuItemPage] = useState(1)
  const [categoryItemPage, setCategoryItemPage] = useState(1)
  const [isViewItems, setIsViewItems] = useState(false)
  const [allOrderItems, setAllOrderItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const itemInstruction = []

  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const assetId = queryParameters.get("assetId")

  const fetchCategory = async () => {
    const response = await fetch('http://194.163.149.48:3002/admin/item-category')
    if (!response.ok) {
      throw new Error('Data coud not be fetched!')
    } else {
      return response.json()
    }
  }

  useEffect(()=> {
    setSelectedCategoryId(selectedCategoryId)
  }, [selectedCategoryId])

  useEffect(()=> {
    setMenuItemPage(menuItemPage)
  }, [menuItemPage])

  useEffect(()=> {
    setCategoryItemPage(categoryItemPage)
  }, [categoryItemPage])

  useEffect(() => {
    fetchCategory()
      .then((res) => {
        setCategory(res.data); 
        setCategoryLoading(false);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setCategoryLoading(true);
      });

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
  },[])

  const clearItems = () => {
    const updatedArray = [];
    setOrderItems([...updatedArray]);
    setAllOrderItems([...updatedArray]);
    localStorage.setItem('localItems', JSON.stringify(updatedArray));
    localStorage.setItem('localAllOrderItems', JSON.stringify(updatedArray));
  };

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
  
  const showMenuByCategory = (category) => {
    if(category==='All') {
      setSelectedCategoryName('Category')
    }
    else if(category._id !== selectedCategoryId){
      setCategoryItemPage(1)
      setSelectedCategoryName(category.name)
      setSelectedCategoryId(category._id)
    }
  }
  
  const handleItemInstruction = (itemId, index, newValue) => {
    const newupdatedValues = [...orderItems]
    for (const item of newupdatedValues) {
      if (item.menuId === itemId) {
        item.description = newValue;
      }
    }
    itemInstruction[index] = newValue
    setOrderItems(newupdatedValues)
    localStorage.setItem('localItems', JSON.stringify(orderItems));
  };

  function addItem(item, index) {
    addInAllOrderItems(item)
    orderItems.push({menuId: `${item._id}`, quantity: parseInt(`${'1'}`), description: itemInstruction[index]})
    setOrderItems([...orderItems])
    localStorage.setItem('localItems', JSON.stringify(orderItems));
    calculateTotalAmount()
  }
  
  function removeItem(itemId) {
    calculateTotalAmount()
    const indexToRemove = orderItems.findIndex(item => item.menuId === itemId);
    if (indexToRemove !== -1) {
      const updated = orderItems.splice(indexToRemove, 1);
      setOrderItems(updated);
    }
    localStorage.setItem('localItems', JSON.stringify(orderItems));
    calculateTotalAmount()
  }

  function increaseItem(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        item.quantity = item.quantity+1;
      }
    }
    setOrderItems([...orderItems])
    localStorage.setItem('localItems', JSON.stringify(orderItems));
    calculateTotalAmount()
  }

  function reduceItem(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        item.quantity = item.quantity-1; 
        if(item.quantity===0) {
          removeItem(itemId)
        }
      }
    }
    setOrderItems([...orderItems])
    localStorage.setItem('localItems', JSON.stringify(orderItems));
    calculateTotalAmount()
  }

  function findItem(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        return true;
      }
    }
    return false;
  }

  function getQuantity(itemId)  {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        return item.quantity 
      }
    }
  }

  function getInstruction(itemId) {
    for (const item of orderItems) {
      if (item.menuId === itemId) {
        return item.description
      }
    }
  }

    const loadNextCategoryPage = () => {
      const newPage = categoryItemPage+1
      setCategoryItemPage(newPage)
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

  function addInAllOrderItems(item) {
    if(!findInAllOrderItems(item._id)){
      allOrderItems.push({_id: item._id, name: item.name, price: item.price, description: item.description})
      localStorage.setItem('localAllOrderItems', JSON.stringify(allOrderItems));
    }
  }

  function getPrice(itemId) {
    for (const item of allOrderItems) {
      if (item._id === itemId) {
        return item.price
      }
    }
  }

  function calculateTotalAmount() {
    let total = 0;
    allOrderItems.forEach((data) => {
      if(findItem(data._id)) {
        const itemPrice = getPrice(data._id)
        const noOfItems = getQuantity(data._id)
        total = total + (itemPrice*noOfItems)
        } 
      })
      setTotalAmount(total)
    }

    function placeOrder() {
      calculateTotalAmount()
      setIsViewItems(true)
    }
    
    const confirmOrder = () => {
      callAxiosAPI()
      clearItems()
    }


    return (
    <>
    <Container className='menu-container h-full bg-light-gray p-0 m-0' fluid>
      <div className='d-flex bg-light justify-content-between align-items-center rounded m-2 p-2'>
        <div className='d-flex justify-content-center align-items-center'>
          <Image className='roomeatsLogo rounded-circle' src={Logo} />
          <h4 className='m-0 px-2'>Table Master</h4>
        </div>
        <div className='search-container d-none d-sm-block'>
          <input placeholder='Search'/>
          <BsSearch className='search-icon' />
        </div>
        {!showSidebar &&
        <div className='d-block d-sm-none'>
          <FiMenu onClick={()=>setShowSidebar(!showSidebar)} size="25"/>
        </div>}
      </div>

      {/* Sidebar for mobile */}
      {showSidebar && 
      <div className='mobile-sidebar'>
        <div className='mobile-sidebar-item-container bg-light h-100 rounded p-2 py-4'>
          <div className='d-flex justify-content-end bg-light pt-2'>
            <RxCross1 size="25" onClick={()=>setShowSidebar(!showSidebar)} />
          </div>
          <div className='d-flex justify-content-center pb-3'>
            <Image className='roomeatsLogo rounded-circle w-25 h-25' src={Logo} />
          </div>
            <ListGroup className='border-0'>
              <ListGroup.Item >Main Menu</ListGroup.Item>
              <ListGroup.Item className='p-0'>
                <Accordion className='' defaultActiveKey="0">
                <Accordion.Item className='border-0 p-0 m-0' eventKey="0">
                  <Accordion.Header>Category</Accordion.Header>
                  <Accordion.Body>
                  <div>
                    <ul>
                      <li onClick={()=> showMenuByCategory('All')}>All</li>
                      {category.map((category)=> (
                        <li onClick={()=> showMenuByCategory(category)}>{category.name}</li>
                      ))}
                    </ul>
                  </div>
                  </Accordion.Body>
                </Accordion.Item>
                </Accordion></ListGroup.Item>
              <ListGroup.Item>My Orders</ListGroup.Item>
            </ListGroup>
        </div>
      </div>
      }

      <div className='variable-item-container'>
        <Row className='m-0 p-0 h-100'>
          <div className='menuInfo d-none d-sm-block justify-content-center p-2 h-100'>
            <div className='sidebar-item-container bg-light h-100 rounded'>
            <ListGroup>
              <ListGroup.Item >Main Menu</ListGroup.Item>
              <ListGroup.Item className='p-0'>
                <Accordion className='' defaultActiveKey="0">
                <Accordion.Item className='border-0 p-0 m-0' eventKey="0">
                  <Accordion.Header>Category</Accordion.Header>
                  <Accordion.Body>
                  <div>
                    <ul>
                      <li onClick={()=> showMenuByCategory('All')}>All</li>
                      {category.map((category)=> (
                        <li onClick={()=> showMenuByCategory(category)}>{category.name}</li>
                      ))}
                    </ul>
                  </div>
                  </Accordion.Body>
                </Accordion.Item>
                </Accordion></ListGroup.Item>
              <ListGroup.Item>My Orders</ListGroup.Item>
            </ListGroup>
            </div>
          </div>
          <Col className='itemContainer h-100 m-0 bg-light-gray p-2'>
            <Row className='nav-category-container m-0  bg-light rounded mb-1'>
              <div className='categoryContainer rounded d-flex p-2 '>
              {category.map((category)=> (
                <div className='nav-category-item  border border-2 rounded border-dark p-1 m-1'>
                  <span onClick={()=> showMenuByCategory(category)}>{category.name}</span>
                </div>
              ))}
              </div>
            </Row>
            {!isViewItems ?
            <>
              { selectedCategoryName==='Category' ?
                <MainMenu 
                  getInstruction={getInstruction}
                  handleItemInstruction={handleItemInstruction}
                  findItem={findItem}
                  getQuantity={getQuantity}
                  reduceItem={reduceItem}
                  addItem={addItem}
                  increaseItem={increaseItem}
                  clearItems={clearItems}
                  placeOrder={placeOrder}
                  orderItems={orderItems}
                />
                :
                <CategoryMenu 
                  getInstruction={getInstruction}
                  handleItemInstruction={handleItemInstruction}
                  findItem={findItem}
                  getQuantity={getQuantity}
                  reduceItem={reduceItem}
                  increaseItem={increaseItem}
                  clearItems={clearItems}
                  addItem={addItem}
                  placeOrder={placeOrder}
                  orderItems={orderItems}
                  selectedCategoryId={selectedCategoryId}
                  categoryItemPage={categoryItemPage}
                  loadNextCategoryPage={loadNextCategoryPage}
                />
              }
            </>
            :
            <VerifyOrder className='d-md-none d-none' 
              orderItems={orderItems}
              getInstruction={getInstruction}
              handleItemInstruction={handleItemInstruction}
              findItem={findItem}
              getQuantity={getQuantity}
              addItem={addItem}
              reduceItem={reduceItem}
              increaseItem={increaseItem}
              confirmOrder={confirmOrder}
              cancelOrder={cancelOrder}
              clearItems={clearItems}
              hideViewItems={hideViewItems}
              allOrderItems={allOrderItems}
              totalAmount={totalAmount}
            />
          }
          </Col>
        </Row>
      </div>
    </Container>
    </>
  )
}

export default Menu