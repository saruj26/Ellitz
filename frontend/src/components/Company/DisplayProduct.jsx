import React, { useEffect, useState } from 'react';

function DisplayProduct() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Biscuit', price: 100, image: 'biscuit.jpg' },
        { id: 2, name: 'Sunlight', price: 200, image: 'sunlight.jpg' },
    
    ]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost/backend/api/display_products.php');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setSuccess(null);
        setError(null);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        try {
            const response = await fetch('http://localhost/backend/api/update_product.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 'success') {
                setSuccess(result.message);
                setError(null);
                setSelectedProduct(null);
                fetchProducts();
            } else {
                setError(result.message);
                setSuccess(null);
            }
        } catch (error) {
            setError('Failed to update product');
            setSuccess(null);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`http://localhost/backend/api/delete_product.php?id=${productId}`, {
                    method: 'GET',
                });
                const result = await response.json();

                if (result.status === 'success') {
                    setProducts(products.filter((product) => product.id !== productId));
                    setError(null);
                    setSuccess(result.message);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError('Failed to delete product');
            }
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="heading">View Products</h3>
            {loading ? <div>Loading...</div> : (
                <>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    {products.length > 0 ? (
                        <table className="table">
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
                                        <td>
                                            <img src={`http://localhost/backend/images/${product.image}`} alt={product.name} style={{ width: '50px' }} />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            <button className="btn btn-primary" onClick={() => handleEdit(product)}>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty_text">No Products Available</div>
                    )}
                </>
            )}

            {selectedProduct && (
                <div className="edit_container mt-5">
                    <h3 className="heading">Update Product</h3>
                    <form onSubmit={handleUpdate} className="update_product product_container_box" encType="multipart/form-data">
                        <input type="hidden" name="update_product_id" value={selectedProduct.id} />
                        <input type="hidden" name="current_product_image" value={selectedProduct.image} />
                        <div className="form-group">
                            <label htmlFor="update_product_name">Product Name</label>
                            <input type="text" className="form-control" id="update_product_name" name="update_product_name" defaultValue={selectedProduct.name} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="update_product_price">Product Price</label>
                            <input type="number" className="form-control" id="update_product_price" name="update_product_price" defaultValue={selectedProduct.price} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="update_product_image">Product Image</label>
                            <input type="file" className="form-control" id="update_product_image" name="update_product_image" accept="image/png,image/jpg,image/jpeg" />
                        </div>
                        <button type="submit" className="btn btn-success mt-3">Update Product</button>
                        <button type="button" className="btn btn-secondary mt-3" onClick={() => setSelectedProduct(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default DisplayProduct;
