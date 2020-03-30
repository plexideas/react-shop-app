import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Icon, Button, Row, Col, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'

function LandingPage() {

  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(0);

  const getProducts = (variables) => {
    Axios.post('/api/product/getProducts', variables)
      .then(response => {
        if (response.data.success) {

          setProducts([
            ...Products,
            ...response.data.products
          ]);
          setPostSize(response.data.postSize);
        } else {
          alert('Failed to fetch product data')
        }
      })
  }

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit
    }

    getProducts(variables)
  }, [])

  const onLoadMore = (event) => {
    let skip = Skip + Limit;

    const variables = {
      skip,
      limit: Limit
    }
    
    getProducts(variables)

    setSkip(skip);
  }

  const renderCard = Products.map((product, index) => {
    const { title,  price } = product
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          hoverable={true}
          cover={<ImageSlider images={product.images} />}
        >
          <Meta 
            title={title}
            description={`$${price}`}
          />
        </Card>
      </Col>
    )
  })

  return (
    <div
      style={{
        width: '75%',
        margin: '3rem auto'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2> Let's Travel Anywhere <Icon type='rocket' /></h2>
      </div>

      {/* Filter */}

      {/* Search */}

      {
        Products.length === 0
        ? 
          <div
            style={{
              display: 'flex',
              height: '300px',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <h2>No post yet... </h2>
          </div>
        : 
          <div>
            <Row gutter={[16, 16]}>
              { renderCard }
            </Row>
          </div>
      }
      <br /><br />
      {
        PostSize >= Limit &&
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onLoadMore}>Load More</Button>
          </div>
      }
    </div>
  )
}

export default LandingPage
