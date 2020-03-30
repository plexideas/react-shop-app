import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd'
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const Contitnents = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europa" },
  { key: 3, value: "Asia" },
  { key: 4, value: "North America" },
  { key: 5, value: "South America" },
  { key: 6, value: "Australia" },
  { key: 7, value: "Antarctica" },
]

export default function UploadProductPage(props) {

  const [TitleValue, setTitleValue] = useState("");
  const [DescriptionValue, setDescriptionValue] = useState("");
  const [PriceValue, setPriceValue] = useState("");
  const [ContinentValue, setContinentValue] = useState(1);
  const [Images, setImages] = useState([]);

  const onTitleChange = (event) => {
    setTitleValue(event.currentTarget.value);
  }

  const onDescriptionChange = (event) => {
    setDescriptionValue(event.currentTarget.value);
  }

  const onPriceChange = (event) => {
    setPriceValue(event.currentTarget.value);
  }

  const onContinentsSelect = (event) => {
    setContinentValue(event.currentTarget.value);
  }

  const updateImages = (newImages) => {
    setImages(newImages)
  }

  const onSubmit = (event) => {
    event.preventDefault();

    // TODO: add validate to Submit method

    const variables = {
      writer: props.user.userData._id,
      title: TitleValue,
      description: DescriptionValue,
      price: PriceValue,
      images: Images,
      contitnents: ContinentValue,
    }

    Axios.post('/api/product/uploadProdutc', variables)
      .then(response => {
        if (response.data.success) {
          alert('Product successully upload');
          props.history.push('/');
        } else {
          alert('Failed to upload Product');
        }
      });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2em auto'}}>
      <div style={{ textAlign: 'center', marginBottom: '2em' }}>
        <Title level={2}>Upload Travel Product</Title>
      </div>
      <Form onSubmit={onSubmit}>

        {/* DropZone */}
        <FileUpload refreshFunction={updateImages}/>

        <br />
        <br />
        <label>Title</label>
        <Input
          onChange={onTitleChange}
          value={TitleValue}
        />
        <br />
        <br />
        <label>Description</label>
        <TextArea 
          onChange={onDescriptionChange}
          value={DescriptionValue}
        />
        <br />
        <br />
        <label>Price ($)</label>
        <Input
          onChange={onPriceChange}
          value={PriceValue}
          type='number'
        />
        <select onChange={onContinentsSelect}>
          {
            Contitnents.map(item => 
              <option key={item.key} value={item.value}>
                { item.value }
              </option>
            ) 
          }
        </select>
        <br />
        <br />
        <Button
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Form>
    </div>
  )
}

