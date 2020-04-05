import React from 'react'
import { Button } from 'antd';

function UserCardBlock(props) {

  const { products, removeItem } = props;

  const renderItems = () => (
    products && products.map(product => (
      <tr key={ product._id }>
        <td>
          <img style={{ width: '70px' }} alt="product" src={`http://localhost:5000/${product.images[0]}`} />
        </td>
        <td>
          { product.quantity } EA
        </td>
        <td>
          { `$ ${product.price} (total: ${product.price * product.quantity})` }
        </td>
        <td>
          <Button 
            onClick={() => removeItem(product._id)}
          >
            Remove
          </Button>
        </td>
      </tr>
    ))
  );

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product Image</th>
            <th>Product Quantity</th>
            <th>Product Price</th>
            <th>Remove from Cart</th>
          </tr>
        </thead>
        <tbody>
          { renderItems() }
        </tbody>
      </table>
    </div>
  )
}

export default UserCardBlock
