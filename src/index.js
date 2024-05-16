import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, HashRouter, Routes, Route } from 'react-router-dom';
import Products from './Authorized/Products';
import Orders from './Authorized/Orders';
import Cart from './Authorized/Cart';
import { Loader } from "@googlemaps/js-api-loader"
import api from './api';

const App = ()=> {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [auth, setAuth] = useState({});
  const el = useRef();

  const attemptLoginWithToken = async()=> {
    await api.attemptLoginWithToken(setAuth);
  }

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      await api.fetchProducts(setProducts);
    };
    fetchData();
  }, []);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        await api.fetchOrders(setOrders);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        await api.fetchAddresses(setAddresses);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        await api.fetchLineItems(setLineItems);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    const setup = async()=> {
      const loader = new Loader({
        apiKey: window.GOOGLE_API_KEY,
      });
     await loader.load();
     const { Map } = await google.maps.importLibrary("places");
      const map = new google.maps.Map(el.current, {
        center: { lat: 40.749933, lng: -73.98633 },
        zoom: 13,
        mapTypeControl: false,
      });
    }
    setup();
  }, []);

  const createLineItem = async(product)=> {
    await api.createLineItem({ product, cart, lineItems, setLineItems});
  };

  const createAddress = async(address)=> {
    await api.createAddress({ address, setAddresses });
  };

  const updateLineItem = async(lineItem)=> {
    await api.updateLineItem({ lineItem, cart, lineItems, setLineItems });
  };
  
  const updateProduct = async(product)=> {
    await api.updateProduct({ product, products, setProducts });
  };

  const updateOrder = async(order)=> {
    await api.updateOrder({ order, setOrders });
  };

  const removeFromCart = async(lineItem)=> {
    await api.removeFromCart({ lineItem, lineItems, setLineItems });
  };

  const cart = orders.find(order => order.is_cart) || {};

  const cartItems = lineItems.filter(lineItem => lineItem.order_id === cart.id);

  const cartCount = cartItems.reduce((acc, item)=> {
    return acc += item.quantity;
  }, 0);

  return (
    <div>
      <div ref={ el } style={{ height: '30px'}}/>
      <nav>
        <Link to='/products'>Products ({ products.length })</Link>
        <Link to='/orders'>Orders ({ orders.filter(order => !order.is_cart).length })</Link>
        <Link to='/cart'>Cart ({ cartCount })</Link>
        <Link to='/addresses'>Addresses ({ addresses.length })</Link>
        {auth.id && (
          <span>
            Welcome { auth.username }!
            <button onClick={ () => api.logout(setAuth) }>Logout</button>
          </span>
        )}
      </nav>
      <main>
        <Routes>
          <Route path='/addresses' element={ 
              <addresses createAddress={ createAddress } addresses={ addresses } />
            }
          />
          <Route path='/products/search/:term' element={
            <Products
              auth = { auth }
              products={ products }
              cartItems = { cartItems }
              createLineItem = { createLineItem }
              updateLineItem = { updateLineItem }
              updateProduct = { updateProduct }
            />
          } />
          <Route path='/products' element={
            <Products
              auth = { auth }
              products={ products }
              cartItems = { cartItems }
              createLineItem = { createLineItem }
              updateLineItem = { updateLineItem }
              updateProduct = { updateProduct }
            />
          } />
          <Route path='/cart' element={
            <Cart
              cart = { cart }
              lineItems = { lineItems }
              products = { products }
              updateOrder = { updateOrder }
              removeFromCart = { removeFromCart }
            />
          } />
          <Route path='/orders' element={
            <Orders
              orders = { orders }
              products = { products }
              lineItems = { lineItems }
            />
          } />
        </Routes>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<HashRouter><App /></HashRouter>);