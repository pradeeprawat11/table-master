import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Menu.css'
import '../../index.css'
import { Link } from 'react-router-dom'
import { Col, Container, Dropdown, Image, Row} from 'react-bootstrap'
import { LiaLessThanSolid } from 'react-icons/lia'
import {GiShoppingCart} from 'react-icons/gi'
import {MdRestaurantMenu} from 'react-icons/md'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyOrder from '../VerifyOrder/VerifyOrder';
import MainMenu from './MainMenu/MainMenu';
import CategoryMenu from './CategoryMenu/CategoryMenu';
import Logo from '../Images/Table_Master_Logo.png'

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
  },[category])

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
    <Row className='bg-light h-min-100vh m-0 p-0'>
      <div className='menuInfo border d-none d-sm-block justify-content-center'>
        <div className='d-flex justify-content-center '>
          <Image className='roomeatsLogo rounded-circle' src={Logo} />
        </div>
        <div>
          <ul>
            <li onClick={()=> showMenuByCategory('All')}>All</li>
            {category.map((category)=> (
              <li onClick={()=> showMenuByCategory(category)}>{category.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <Col className='m-0 p-0'>
      {/* <div className='categoryContainer d-flex'>
      {category.map((category)=> (
        <div className=''>
          <Image className='categoryItemLogo' src={Logo} />
          <h6>{category.name}</h6>
        </div>
      ))}
        
      </div> */}
      { selectedCategoryName==='Category' ?
          <MainMenu 
            getInstruction={getInstruction}
            handleItemInstruction={handleItemInstruction}
            findItem={findItem}
            getQuantity={getQuantity}
            reduceItem={reduceItem}
            increaseItem={increaseItem}
            addItem={addItem}
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
      </Col>
    </Row>
    <div className='bg-light d-flex'>
      
      
    </div>
    {!isViewItems ?
      <Container className='menuContainer text-light bg_Dark p-0 d-xs-flex' fluid>
        
        {/* <div className='fixedNavbar d-flex justify-content-between align-items-center'>
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
                        <Dropdown.Item key={index} onClick={()=> showMenuByCategory(category)}>{category.name}</Dropdown.Item>
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
        </div> */}
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
        {/* { selectedCategoryName==='Category' ?
          <MainMenu 
            getInstruction={getInstruction}
            handleItemInstruction={handleItemInstruction}
            findItem={findItem}
            getQuantity={getQuantity}
            reduceItem={reduceItem}
            increaseItem={increaseItem}
            addItem={addItem}
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
        } */}
      </Container >
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
    </>
  )
}

export default Menu