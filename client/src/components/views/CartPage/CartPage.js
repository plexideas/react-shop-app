import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Result, Empty } from 'antd';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions';
import Paypal from '../../utils/Paypal';
import UserCardBlock from './Sections/UserCardBlock';
import Axios from 'axios';

function CartPage(props) {

  const { userData, cartDetails } = props.user;
  const [Total, setTotal] = useState(0)
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    let cartItems = [];
    console.log(userData)
    if (userData && userData.cart){
      if (userData.cart.length > 0) {
        userData.cart.forEach(item => {
          cartItems.push(item.id)
        });
        dispatch(getCartItems(cartItems, userData.cart))
      }
    }
  }, [userData]);
  
  useEffect(() => {
    if (cartDetails && cartDetails.length > 0) {
      calculateTotal(cartDetails);
    } else {
      setShowTotal(false);
    }
  }, [cartDetails]);

  const calculateTotal = (cartDetails) => {
    let total = 0;
    cartDetails.map(item => {
      total += parseInt(item.price, 10) * item.quantity;
    })

    setTotal(total);
    setShowTotal(true)
  }

  const removeFromCart = (productId) => {
    dispatch(removeCartItem(productId))
      .then(

      );
  }

  const transactionSuccess = (paymentData) => {
    let variables = {
      cartDetails, paymentData
    };

    Axios.post('/api/users/successBuy', variables)
      .then(response => {
        if (response.data.success) {
          setShowSuccess(true);
          setShowTotal(false);
          dispatch(onSuccessBuy({ 
            cart: response.data.cart,
            cartDetails: response.data.cartDetails,
          }))
        } else {
          console.log('Failed to buy it')
        }
      });
  }

  const transactionError = () => {
    console.log('Paypal error')
  }

  const transactionCanceled = () => {
    console.log('Transaction has canceled')
  }

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <h1>My cart</h1>
      <div>
        <UserCardBlock products={cartDetails} removeItem={removeFromCart}/>
        {
          ShowTotal 
          ? <div style={{ marginTop: '3rem' }}>
            <h2>Total amount: {Total}</h2>
          </div>
          : ShowSuccess 
            ? <Result 
                status="success"
                title="Successfully Purchased Items"
              />
            : <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <br />
                <Empty description={false}/>
                <p>No Items In the Cart</p>
              </div>
        }

        {
          ShowTotal && <Paypal
            toPay={Total}
            transactionSuccess={transactionSuccess}
            transactionError={transactionError}
            transactionCanceled={transactionCanceled}
          />
        }
      </div>
    </div>
  )
}

export default CartPage
