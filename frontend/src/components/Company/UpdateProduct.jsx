import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../../public/Elitez.png'

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', price: '', image: '' });
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost/api/view_products.php`)
      .then(response => {
        const productToEdit = response.data.find(p => p.id === id);
        if (productToEdit) setProduct(productToEdit);
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('update_product_id', product.id);
    formData.append('update_product_name', product.name);
    formData.append('update_product_price', product.price);
    if (newImage) {
      formData.append('update_product_image', newImage);
    } else {
      formData.append('current_product_image', product.image);
    }

    axios.post('http://localhost/api/update_product.php', formData)
      .then(response => {
        if (response.data.success) {
          navigate('/');
        } else {
          setMessage(response.data.error);
        }
      })
      .catch(error => console.error('Error updating product:', error));
  };

  return (

    <div>
      {message && <div className="display_message">{message}</div>}
      <div className="edit_container">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="update_product product_container_box" >
        <img src={`http://localhost/images/${product.image}`} alt={product.name} />
        <input type="hidden" name="update_product_id" value={product.id} />
        <input type="hidden" name="current_product_image" value={product.image} />
        <input type="text" className="input_fields fields" name="update_product_name" value={product.name} onChange={handleChange} required />
        <input type="number" className="input_fields fields" name="update_product_price" value={product.price} onChange={handleChange} required />
        <input type="file" className="input_fields fields" name="update_product_image" onChange={handleFileChange} accept="image/*" />
        <div className="btns">
        <input type="submit" className="edit_btn" value="Update Product" name="update_product"></input>
        <input type="reset" id="close-edit" className="cancel_btn" value="Cancel"></input>
        </div>
      </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
