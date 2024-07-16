import Image from "next/image";
import Example from './Pages/ProductDetail/productId';

const productPage =async ()=>{
// const res =await fetch('https://dummyjson.com/products')
// const products = Product[] =await res.json ();
}
export default function Home() {  
  return (  
    <>
    {/* <h1>Products</h1> */}
    <Example/>
    {/* <ul>
    {products.map(product => <li key ={product.id}>{product.title}</li>)}
    </ul> */}
    </>
     
  );  
}