import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {FaTrash,FaEdit } from 'react-icons/fa';
import axios from 'axios';

const ViewProducts = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Biscuit', price: 100, image: 'biscuit.jpg' },
    { id: 2, name: 'Sunlight', price: 200, image: 'sunlight.jpg' },

  ]);

  useEffect(() => {
    axios.get('http://localhost/api/view_products.php')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.get(`http://localhost/api/delete_product.php?delete=${id}`)
        .then(response => {
          if (response.data.success) {
            setProducts(products.filter(product => product.id !== id));
          } else {
            console.error('Error deleting product:', response.data.error);
          }
        })
        .catch(error => console.error('Error deleting product:', error));
    }
  };

  return (
    <div className="container">
      <section className="display_product">
        {products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>S No</th>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td><img src={`http://localhost/images/${product.image}`} alt={product.name} /></td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    <button className="delete_product_btn" onClick={() => handleDelete(product.id)}><FaTrash/></button>
                    <Link className="update_product_btn" to={`/update/${product.id}`}><FaEdit /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty_text">No Products Available</div>
        )}
      </section>
    </div>
  );
};

export default ViewProducts;
