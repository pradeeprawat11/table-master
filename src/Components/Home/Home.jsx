import React from 'react'
import '../../index.css'
import './Home.css'
import { Container, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom'
import Logo from '../Images/Table_Master_Logo.png'

const Home = () => { 

  const currentURL = window.location.href;
  console.log('current url', currentURL)

  let currentAssetId = currentURL.substring(currentURL.length - 24); //'6502fd62e0ae56858959419e'
  console.log('curr asset id', currentAssetId)
  console.log('local', localStorage.getItem('assetId'))
  if(localStorage.getItem('assetId')!=currentAssetId || !localStorage.getItem('assetId')) {
    localStorage.setItem('assetId', currentAssetId)
  }

  console.log('local id', localStorage.getItem('assetId'))

  const targetURL = 'http://localhost:3008/menu';

  const orderNow = () => {
    // targetURL = 'http://localhost:3008/menu'
    window.location.href = targetURL;
  }


  return (
    <>
        <Container className='homeContainer text-light d-flex justify-content-center align-items-center' fluid> 
          <div className='text-center'>
            <Image className='pb-5' size={5} src={Logo} />
            <Link className='d-block' to="/menu"> <button onClick={orderNow} className='bg_Success w-100 border-0 text-light p-2 px-5'>Order Now</button> </Link>
          </div>
          
        </Container>
    </>
  )
}

export default Home