'use client'
import React from 'react';  
import SearchAppBar from'./Pages/ProductDetail/appbar';
import Container from '@mui/material/Container';
import ProductList from './components/product-table';

function Home() {  



  return (  
    <> 
   <SearchAppBar/>
   <Container maxWidth="lg" sx={{ mt: 5}}>
        <ProductList />
      </Container>
    </>  
  );  
}  

export default Home;