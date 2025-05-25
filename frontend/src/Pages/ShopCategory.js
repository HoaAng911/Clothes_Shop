import React, { useEffect, useState } from 'react';
import './CSS/ShopCategory.css';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/Item';
import useProductStore from '../store/useProductStore';

const ShopCategory = (props) => {
    const { products, fetchAllProducts, loading } = useProductStore();

    const [filterCriteria, setFilterCriteria] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        fetchAllProducts();
    }, []);

    // Hàm lọc và sắp xếp
    const getFilteredSortedProducts = () => {
        let filtered = products.filter(item => item.category === props.category);

        if (minPrice !== '' && maxPrice !== '') {
            filtered = filtered.filter(item => item.new_price >= minPrice && item.new_price <= maxPrice);
        }

        if (searchTerm !== '') {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        switch (filterCriteria) {
            case 'priceLowToHigh':
                return [...filtered].sort((a, b) => a.new_price - b.new_price);
            case 'priceHighToLow':
                return [...filtered].sort((a, b) => b.new_price - a.new_price);
            case 'name':
                return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return filtered;
        }
    };

    const filteredSorted = getFilteredSortedProducts();

    // Phân trang
    const totalPages = Math.ceil(filteredSorted.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredSorted.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className='shop-category'>
            <img className='shopcategory-banner' src={props.banner} alt="" />

            {/* Bộ lọc mở rộng */}
            <div className="shopcategory-filters">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <button onClick={() => setCurrentPage(1)}>Apply Filters</button>
            </div>

            <div className="shopcategory-indexSort">
                <p>
                    <span>Showing {filteredSorted.length === 0 ? 0 : `${indexOfFirstProduct + 1}-${Math.min(indexOfLastProduct, filteredSorted.length)}`}</span>
                    out of {filteredSorted.length} products
                </p>
                <div className="shopcategory-sort">
                    Sort by
                    <select onChange={(e) => setFilterCriteria(e.target.value)} value={filterCriteria}>
                        <option value="">Select</option>
                        <option value="priceLowToHigh">Price: Low to High</option>
                        <option value="priceHighToLow">Price: High to Low</option>
                        <option value="name">Name</option>
                    </select>
                    <img src={dropdown_icon} alt="" />
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', margin: '2rem' }}>Loading products...</p>
            ) : (
                <div className="shopcategory-products">
                    {currentProducts.map((item, index) => (
                        <Item

                            key={item._id}
                            id={item._id}
                            name={item.name}
                            image={item.image}
                            new_price={item.new_price}
                            old_price={item.old_price}
                        />
                    ))}
                </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="shopcategory-pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </div>
            )}

        </div>
    );
};

export default ShopCategory;
