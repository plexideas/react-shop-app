import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Icon, Button, Row, Col, Card } from 'antd';
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { continents, price } from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';

function LandingPage() {

  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(0);
  const [SearchTerms, setSearchTerms] = useState("")
  const [Filters, setFilters] = useState({
    continents: [],
    price: [],
  });

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    }

    getProducts(variables)
  }, []);

  const getProducts = (variables) => {
    Axios.post('/api/product/getProducts', variables)
      .then(response => {
        if (response.data.success) {
          if (variables && variables.loadMore) {
            setProducts([
              ...Products,
              ...response.data.products
            ]);
          } else {
            setProducts(response.data.products);
          }
          setPostSize(response.data.postSize);
        } else {
          alert('Failed to fetch product data')
        }
      })
  }

  const onLoadMore = (event) => {
    let skip = Skip + Limit;

    const variables = {
      skip,
      limit: Limit,
      loadMore: true,
    }
    
    getProducts(variables)

    setSkip(skip);
  };

  const renderCards = Products.map((product, index) => {
    const { title,  price, _id } = product
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          hoverable={true}
          cover={
            <a href={`/product/${_id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Card.Meta 
            title={title}
            description={`$${price}`}
          />
        </Card>
      </Col>
    )
  })

  const showFilteredResults = (filters) => {

    const variables = {
      skip: 0,
      limit: Limit,
      filters: filters
    }

    getProducts(variables)
    setSkip(0);
  }

  const handlePrice = (value) => price[value].array;

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };
    newFilters[category] = filters;

    if (category === "price") {
      newFilters[category] = handlePrice(filters);
    }

    showFilteredResults(newFilters);

    setFilters(newFilters);
  }

  const updateSearchTerms = (newSearchTerm) => {
    setSearchTerms(newSearchTerm);

    const variables = {
      skip: 0,
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    }

    setSkip(0);

    getProducts(variables);
  }

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

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <CheckBox
            list={ continents }
            handleFilters={filters => handleFilters(filters, "continents")}
          />
        </Col>
        <Col lg={12} xs={24}>
          <RadioBox
            list={ price }
            handleFilters={filters => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* Search */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '1rem auto'
        }}
      >
        <SearchFeature
          refreshFunction={updateSearchTerms}
        />
      </div>

      {
        Products.length === 0
        ? <div
            style={{
              display: 'flex',
              height: '300px',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <h2>No post yet... </h2>
          </div>
        : <div>
            <Row gutter={[16, 16]}>
              { renderCards }
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

export default LandingPage;
