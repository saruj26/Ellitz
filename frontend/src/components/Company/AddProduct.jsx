import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRegTimesCircle } from "react-icons/fa";

function AddProduct() {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [productNameError, setProductNameError] = useState('');
    const [productPriceError, setProductPriceError] = useState('');
    const [productImageError, setProductImageError] = useState('');
    const [message, setMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (productName.trim()) {
            setProductNameError('');
        }
    }, [productName]);

    useEffect(() => {
        if (productPrice.trim()) {
            setProductPriceError('');
        }
    }, [productPrice]);

    useEffect(() => {
        if (productImage) {
            setProductImageError('');
        }
    }, [productImage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setProductNameError('');
        setProductPriceError('');
        setProductImageError('');

        let formValid = true;

        if (!productName.trim()) {
            setProductNameError('Product name is required');
            formValid = false;
        }

        if (!productPrice.trim()) {
            setProductPriceError('Product price is required');
            formValid = false;
        }

        if (!productImage) {
            setProductImageError('Product image is required');
            formValid = false;
        }

        if (!formValid) {
            setMessage('Invalid input. Please check.');
            setIsMessageVisible(true);
            setTimeout(() => {
                setIsMessageVisible(false);
            }, 5000);
            return;
        }

        const formData = new FormData();
        formData.append('product_name', productName);
        formData.append('product_price', productPrice);
        formData.append('product_image', productImage);

        try {
            const response = await axios.post('http://localhost/Project-01/Project-1/backend/Company/add_product.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message);
            setIsMessageVisible(true);
            setProductName('');
            setProductPrice('');
            setProductImage(null);
            fileInputRef.current.value = '';

            setTimeout(() => {
                setIsMessageVisible(false);
            }, 5000);
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to add product. Please try again later.');
            setIsMessageVisible(true);

            setTimeout(() => {
                setIsMessageVisible(false);
            }, 5000);
        }
    };

    const handleCloseMessage = () => {
        setIsMessageVisible(false);
    };

    return (
        <div className="container mt-5">
            {isMessageVisible && message && (
                <div className="display_message">
                    {message}
                    <FaRegTimesCircle onClick={handleCloseMessage} />
                </div>
            )}
            <h3 className="heading">Add Products</h3>
            <form onSubmit={handleSubmit} className="add_product">
                <div className="form-group">
                    <input
                        type="text"
                        className="input_fields form-control"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    {productNameError && <div className="error_message">{productNameError}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        className="input_fields"
                        placeholder="Enter product price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                    {productPriceError && <div className="error_message">{productPriceError}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="file"
                        className="input_fields"
                        ref={fileInputRef}
                        onChange={(e) => setProductImage(e.target.files[0])}
                    />
                    {productImageError && <div className="error_message">{productImageError}</div>}
                </div>
                <button type="submit" className="submit_btn">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
