import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './InvoiceDetailsPage.module.css'; // Import CSS styles
import { Link } from 'react-router-dom';
import phoneCallIcon from "/ph_phone-call-light.png";
import projectLogo from "/project_logo.png";
import LogoutButton from "/src/components/LogoutButton";


const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = async (productId) => {
    const productDetails = await fetchProductDetails(productId);
    setSelectedProduct(productDetails);
  };

  useEffect(() => {
    fetchInvoiceDetails();
    fetchUserData();
  }, [invoiceId]);

  useEffect(() => {
    // Set default product details when the component mounts
    if (invoice && invoice.items && invoice.items.length > 0) {
      const firstItem = invoice.items[0];
      handleProductClick(firstItem.product);
    }
  }, [invoice]);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(`/api/users/invoices/${invoiceId}`);
      setInvoice(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/users/profile`);
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      if (!productId) {
        console.error('Product ID is undefined');
        return null;
      }
      const response = await axios.get(`/api/users/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const { deliveryAddress, paymentMethod, items, totalAmount } = invoice;

  return (
    <div className={styles.checkoutContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <img src={phoneCallIcon} alt="Phone call" />
          <span>912121131313</span>
        </div>
        <div className={styles.headerContent}>
          <span>Get 50% off on selected items&nbsp; | &nbsp; Shop Now</span>
        </div>
        <div className={styles.logoutButton}>
  <LogoutButton /> 
  </div>
      </header>
      <div className={styles.home}>

      {/* Menu Bar */}
      <div className={styles.menubar}>
        <div className={styles.leftSection}>
          <div className={styles.menuItem}>
            <img src={projectLogo} alt="Project Logo" />
          </div>
          <div className={styles.menuItem}>
            <Link to="/home" className={styles.homeLink}>Home</Link>
          </div>
          <div className={styles.menuItem}>
            <Link to="/invoices" className={styles.invoiceLink}>Invoice</Link>
          </div>
        </div>
        <div className={styles.rightSection}></div>
      </div>

      <div className={styles.menuItem}>
        <Link to="/mycart"><button className={styles.backToCartButton}>Back to Cart</button></Link>
      </div>

      <h1 className={styles.checkoutHeader}>Invoice</h1>

      <div className={styles.checkoutSections}>
        <div className={styles.leftColumn}>
          {/* Row 1 */}
          <div className={styles.row}>
            <div className={`${styles.column} ${styles.col1}`}>
              <span>1. Delivery Address</span>
            </div>
            <div className={styles.column}>
              <span className={styles.username}>{username}</span>
              <div className={styles.deliveryInputContainer}>
              
              <div className={styles.deliveryInput}>
               {deliveryAddress}
              </div>

              </div>
            </div>
          </div>
          <div className={styles.line}></div> {/* Line between rows */}

          {/* Row 2 */}
          <div className={styles.row}>
            <div className={`${styles.column} ${styles.col1}`}>
              <span>2. Payment Method</span>
            </div>
            <div className={styles.column}>
              <select value={paymentMethod} disabled>
                <option value="payOnDelivery">Pay on Delivery</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>
          <div className={styles.line}></div> {/* Line between rows */}

          {/* Row 3 */}
          <div className={styles.row}>
            <div className={`${styles.column} ${styles.col1}`}>
              <span>3. Review Items and Delivery</span>
            </div>
            <div className={styles.column}>
              <div className={styles.productImages}>
                {items && items.map((item, index) => (
                  <div key={index} onClick={() => handleProductClick(item.product)}>
                    <ItemDetails item={item} fetchProductDetails={fetchProductDetails} />
                  </div>
                ))}
              </div>

              {selectedProduct && (
                <div className={styles.selectedProductDetails}>
                  <p>{selectedProduct.name} </p>
                  <p className={styles.deliveryColor}>Color: {selectedProduct.color}</p>
                  <p className={styles.deliveryText}>
                    Estimated delivery:
                    <br /> {/* Add a line break */}
                    <span>Monday - FREE Standard Delivery</span>
                  </p>
                </div>
              )}

            </div>
          </div>
          <div className={styles.line}></div> {/* Line between rows */}
        </div>

        <div className={styles.rightColumn}>
         
          <div className={styles.orderSummaryBox}>
            
            <h3>Order Summary</h3>
            <p>Items Total: ₹{totalAmount.toFixed(2)}</p>
            <p>Delivery Amount: ₹45</p>
            <hr />
            <h3 className={styles.orderTotal}>Order Total: ₹{(totalAmount + 45).toFixed(2)}</h3>
          </div>
        </div>
      </div>
      </div>
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>Musicart | All rights reserved</span>
        </div>
      </footer>
    </div>
  );
};

const ItemDetails = ({ item, fetchProductDetails }) => {
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchProductDetails(item.product);
        setProductDetails(response);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchDetails();
  }, [item, fetchProductDetails]);

  return (
    <div>
      {productDetails && productDetails.images && productDetails.images.length > 0 ? (
        <img src={productDetails.images[0]} alt={productDetails.name} className={styles.productImage} />
      ) : (
        <div>No image available</div>
      )}
    </div>
  );
};

export default InvoiceDetails;