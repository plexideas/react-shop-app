import React from 'react'
import { Carousel } from 'antd'

function ImageSlider(props) {
  const { images } = props;

  return (
    <div>
      <Carousel autoplay>
        {
          images && images.length > 0 && images.map((image, index) => (
            <div key={index}>
              <img 
                style={{ width: '100%', height: '150px' }}
                src={`http://localhost:5000/${image}`}
                alt={`productImage-${index}`} 
              />
            </div>
          ))
        }
      </Carousel>
    </div>
  )
}

export default ImageSlider

