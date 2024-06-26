import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// Backend Code
export const updateCart = async (req, res) => {
  try {
    console.log("Received request to add product to cart:", req.body); // Log request body for debugging

    const { productId, quantity } = req.body; // Extract productId and quantity from the request body

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("User req ID:", req.user._id); // Log the userId for debugging

    // Access the user's information from the request object (assuming the user is authenticated)
    const userId = req.user._id; // Assuming the authenticated user's ID is stored in req.user._id
    console.log("User ID:", userId); // Log the userId for debugging

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the product is already in the user's cart
    const existingCartItemIndex = user.cart.findIndex(item => item.product.equals(product._id));
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, increment the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it with the specified quantity
      user.cart.push({ product: product._id, quantity: quantity });
    }

    // Save the updated user object with the modified cart
    await user.save();

    // Return a success response with the updated user's information
    res.json({ message: "Product added to cart successfully", user: user });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateQty = async (req, res) => {
  try {
    console.log("Received request to update cart:", req.body); // Log request body for debugging

    const { productId, quantity } = req.body; // Extract productId and quantity from the request body

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("User req ID:", req.user._id); // Log the userId for debugging

    // Access the user's information from the request object (assuming the user is authenticated)
    const userId = req.user._id; // Assuming the authenticated user's ID is stored in req.user._id
    console.log("User ID:", userId); // Log the userId for debugging

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the product is already in the user's cart
    const existingCartItemIndex = user.cart.findIndex(item => item.product.equals(product._id));
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity to the new value
      user.cart[existingCartItemIndex].quantity = quantity;
    } else {
      // Product is not in the cart, add it with the specified quantity
      user.cart.push({ product: product._id, quantity: quantity });
    }

    // Save the updated user object with the modified cart
    await user.save();

    // Return a success response with the updated user's information
    res.json({ message: "Cart updated successfully", user: user });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const myCartdetails = async (req, res) => {
  try {
    // Assuming the user is authenticated and their ID is stored in req.user._id
    const userId = req.user._id;
    
    // Find the user by their ID and populate the cart field to get product details
    const user = await User.findById(userId).populate('cart.product');
    
    // Extract the cart from the user object and map it to combine product details with quantities
    const cart = user.cart.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));

    // Return the cart products as an array
    res.json({ cart: cart || [] });
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCartItemCount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user by their ID and populate the cart field to get product details
    const user = await User.findById(userId).populate('cart.product');

    // Calculate the total count of items in the cart
    let itemCount = 0;
    user.cart.forEach(item => {
      itemCount += item.quantity;
    });

    // Return the count of items in the cart
    res.json({ count: itemCount });
  } catch (error) {
    console.error("Error fetching cart item count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const { type, text } = req.body;
    console.log(type + ": " + text);

    // Find the user by ID
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the new feedback to the user's feedbacks array
    user.feedbacks.push({ type, text });

    // Save the updated user object with the new feedback
    await user.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateOrder = async (req, res) => {
  try {
    // Find the user by ID (assuming it's stored in req.user._id)
    const userId = req.user._id;
    console.log("User ID:", userId); // Log the userId for debugging
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    const { deliveryAddress, paymentMethod, cart, totalAmount, deliveryAmount } = req.body;

    // Create a new order object
    const order = {
      items: cart,
      totalAmount,
      deliveryAmount,
      deliveryAddress,
      paymentMethod,
    };

    console.log("Order data:", order); // Log the order data for debugging

    // Push the new order to the user's orders array
    user.orders.push(order);

    // Empty the user's cart
    user.cart = [];

    // Save the user with the updated orders and empty cart
    await user.save();
    
    console.log("User after saving:", user); // Log the user data after saving for debugging

    // Return success response
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// user.controller.js

export const getInvoiceDetails = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming the user is authenticated and their ID is stored in req.user._id
    
    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Return all orders associated with the user along with the username
    res.json({ 
      username: user.username,
      orders: user.orders 
    });
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getOrderDetails = async (req, res) => {
  try {
    // Extract the invoiceId from request parameters
    const { invoiceId } = req.params;

    console.log(' manoj Fetching invoice details for invoiceId:', invoiceId);

    // Find the user by their ID and retrieve the order (invoice) by its ID
    const user = await User.findOne({ 'orders._id': invoiceId });

    console.log('User found:', user);

    // If user or invoice not found, return 404 error
    if (!user) {
      console.log('User not found. Returning 404 error.');
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Find the specific invoice within the user's orders array
    const invoice = user.orders.find(order => order._id.equals(invoiceId));

    console.log('Invoice found:', invoice);

    // If invoice not found, return 404 error
    if (!invoice) {
      console.log('Invoice not found. Returning 404 error.');
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // If invoice found, return it in the response
    console.log('Invoice details fetched successfully:', invoice);
    res.json(invoice);
  } catch (error) {
    // Handle server errors
    console.error('Error fetching invoice details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // Get the user ID from the request object
    const userId = req.user._id;

    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, return 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user profile details including the username
    res.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Add other controller functions below if needed

////////////////////////////////////////
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    console.log("Updated user1:", updatedUser);

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserData = async (req, res) => {
  try {
    // Fetch user data along with cards
    const user = await User.findById(req.user.id).populate('cards');
    console.log("Updated user26:", user);

    // Your response logic here
    res.json({ user });
  } catch (error) {
    console.error("Error in getUserData: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// New controller function for fetching user cards
// New controller function for fetching user cards based on date range
export const getUserCards = async (req, res) => {
  try {
    // Extract the start and end dates from the request body
    const { startDate, endDate } = req.body;

    // Fetch only the cards for the current user
    const user = await User.findById(req.user.id).select('cards');
    
    // Implement logic to filter cards based on the date range (startDate and endDate)
    const filteredCards = user.cards.filter((card) => {
      const cardCreatedAt = new Date(card.createdAt);
      return cardCreatedAt >= new Date(startDate) && cardCreatedAt <= new Date(endDate);
    });

    console.log("Filtered cards:", filteredCards);

    res.json({ cards: filteredCards || [] });
  } catch (error) {
    console.error("Error in getUserCards: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





export const getOneCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { updatedCardData } = req.body; // Assuming you send all updated card data in the request body

    // Find the user by ID and update the card with the new data
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id, 'cards._id': cardId },
      { $set: { 'cards.$': updatedCardData } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User or card not found" });
    }

    // Console logs for debugging
    console.log(`Card ${cardId} updated by user ${req.user.id}`);

    // Respond with the updated user data
    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in getOneCard: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




export const updateUser = async (req, res) => {
  try {
    // Extract updated user data from the request body
    const updatedUserData = req.body;

    // Find the user by email
    const existingUser = await User.findOne({ email: updatedUserData.email });
    console.log("Existing user:", existingUser);

    // If the user exists, update their information including the cards
    if (existingUser) {
      // Ensure user.cards is an array
      const existingCards = Array.isArray(existingUser.cards) ? existingUser.cards : [];

      // Merge existing cards with new cards based on unique identifier (_id)
      const mergedCards = [...existingCards];

      updatedUserData.cards.forEach((newCard) => {
        const existingCardIndex = existingCards.findIndex((card) => card._id === newCard._id);

        if (existingCardIndex !== -1) {
          // Replace existing card with new card
          mergedCards[existingCardIndex] = newCard;
        } else {
          // Add new card to the array
          mergedCards.push(newCard);
        }
      });

      // Update user information including the cards
      const updatedUser = await User.findOneAndUpdate(
        { email: updatedUserData.email },
        { ...updatedUserData, cards: mergedCards },
        { new: true }
      );
      console.log("Updated user:", updatedUser);

      // Your response logic here
      res.json({ user: updatedUser });
    } else {
      // Handle case when the user doesn't exist
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in updateUser: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Your other controllers
export const deleteCard = async (req, res) => {
  try {
    const cardId = req.params.cardId; // Adjusting parameter name to match the route

    // Find the user by ID
    const user = await User.findById(req.user.id);
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out the card to be deleted from the user's cards array
    user.cards = user.cards.filter((card) => card._id.toString() !== cardId);
    console.log("User after filtering cards:", user);

    // Save the updated user with the card removed
    const updatedUser = await user.save({ validateBeforeSave: false });
    console.log("Updated user after card deletion:", updatedUser);

    // Your response logic here
    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in deleteCard: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

import bcrypt from 'bcrypt';

export const passUpdate = async (req, res) => {
  const userId = req.user.id; // Assuming you have user information stored in the request
  const { oldPassword, newPassword, newUsername } = req.body; // Get old and new passwords from the request body

  try {
    // Retrieve the user from the database
    const user = await User.findById(userId);
    await User.findByIdAndUpdate(userId, { username: newUsername });

    // Check if the entered old password matches the existing one
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user document with the new password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' }); // Respond with a success message
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};
