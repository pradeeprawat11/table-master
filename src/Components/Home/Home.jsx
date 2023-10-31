import React from 'react'
import '../../index.css'
import './Home.css'
import { Container, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom'
import Logo from '../Images/Table_Master_Logo.png'

const Home = () => { 

  return (
    <>
        <Container className='homeContainer text-light d-flex justify-content-center align-items-center' fluid> 
          <div className='text-center'>
            <Image className='pb-5' size={5} src={Logo} />
            <Link className='d-block' to="/menu"> <button className='bg_Success w-100 border-0 text-light p-2 px-5'>Order Now</button> </Link>
          </div>
        </Container>
    </>
  )
}

export default Home