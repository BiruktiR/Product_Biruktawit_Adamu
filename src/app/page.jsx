'use client'
import React, { useState, useEffect } from 'react';  
import Example from './Pages/ProductDetail/productId';
import SearchAppBar from'./Pages/ProductDetail/appbar';
import SimpleContainer from './Pages/ProductDetail/procont';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ProductionQuantityLimitsSharp } from '@mui/icons-material';

function Home() {  
  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null);

  useEffect(() => {  
    setIsLoading(true);
    setError(null);
      fetch('https://dummyjson.com/products')  
      
          .then(response => {
            if (!response.ok){
              throw new Error ('network response was not ok');
            }  
             return response.json();
          })  
          .then(data => {  
            if (data && data.products && Array.isArray(data.products)) {  
              setProducts(data.products);  
            } else {  
              console.error('Products array not found in data:', data);  
            }  
          }) 
          .catch(error => {  
              console.error('Error fetching data:', error);  
              setError(error);
          })
          .finally(()=>{
            setIsLoading(false);
          });
  }, []);  

  return (  
    <> 
   <SearchAppBar/>
   <Container maxWidth="lg" sx={{ mt: 5}}>
      {isLoading && <p> Loading Products ...</p>}

      {error&& <p>Error :{error.message}</p>}

      {!isLoading && !error &&(
        <Example products={products}/>
      )}
        
    
      <h1>Products</h1>  
      <ul>  
        {products.map(product => (  
          <li key={product.id}>  
            {product.name}: {product.title} :{product.price}:{product.tags} {product.rating} {product.description}   
          </li>  
        ))}  
      </ul>  
      </Container>
    </>  
  );  
}  

export default Home;