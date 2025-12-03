# E-Commerce web shop fullstack project with Fraud Detection

## Features
- User authentication: **Login & Register** using JWT
- Secure password storage and hashing with bycrypt
- Frontend built with **HTML, CSS, JavaScript**
- Backend API using **Node.js / Express** and **Flask** for fraud detection model
- Data storage with **MongoDB**
- Dummy data usage with `dummy.json`
- Responsive UI
- RESTful API structure


## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express, Python, Flask
- **Database:** MongoDB
- **Authentication:** JWT
- **Data:** `dummy.json` (for testing/demo)


### Home Page
![Home Page](./assets/home-page.png)

### Login Page
![Login Page](./assets/login-page.png)

### Register Page
![Register page](./assets/register-page.png)

### Account Page
![Account page](./assets/account-info-page.png)

### Product Page
![Product page](./assets/single-product-png.png)

### Cart Page
![Cart page](./assets/cart-page.png)

### Order Page
![Order page](./assets/order-page.png)

## MongoDB storing
## Users collection: -stores registered users 
-_id: ObjectId
-email: String
-password: String(hashed)
-cart: Array 
-createdAt: Date
## Orders collection: -stores orders made by users
-_id: ObjectId
-userId: ObjectId(reference to users)
-items: Array(consists of Object(productId: Number, quantity: Number,price:Number)) 
-totalAmount: Number
-paymentMethod: String
-shippingAddress: String
-status: String
-riskScore: Number exp.(0.005654)
-isFraudulent: Bool
-createdAt: Date

## Commments collection: -stores comments made by users 
-_id: ObjectId
-userId: ObjectId(reference to users)
-productId: String
-content: String 
-createdAt: Date

