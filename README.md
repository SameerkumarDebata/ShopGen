# ShopGen 🛒
ShopGen is a modern, full-featured MERN (MongoDB, Express, React, Node.js) stack e-commerce application. It includes a user-friendly shopping experience, robust admin dashboard, secure authentication, cart management, and payment gateway integration.

---

## 🚀 Features

*   **Secure Authentication:** User sign-up, login, and authorization using JWT (JSON Web Tokens).
*   **Product Catalog:** Filter, search, and sort products by categories, price, and rating.
*   **Shopping Cart:** Add, remove, and manage item quantities with persistent state.
*   **Checkout & Payments:** Integration with Razorpay for secure checkout.
*   **Admin Dashboard:** Full admin management panels for products, orders, coupons, and user statistics.
*   **Media Uploads:** Cloudinary integration for smooth product image hosting.
*   **Responsive UI:** Styled with Tailwind CSS, custom components, and responsive grid layouts.

---

## 📁 Project Structure

```text
ShopGen/
├── Backend/                 # Express & Node.js API
│   ├── config/              # DB connection config
│   ├── controllers/         # Request handling logic
│   ├── middleware/          # JWT & role verification middlewares
│   ├── models/              # Mongoose database schemas
│   ├── routes/              # API endpoints routing
│   ├── seed.js              # Database seed script
│   └── index.js             # Entry point
└── Frontend/                # React & Vite client
    ├── src/
    │   ├── api/             # Axios API config
    │   ├── components/      # UI components
    │   ├── pages/           # Pages (User, Admin, Public)
    │   └── main.jsx         # Client entry point
    └── vite.config.js       # Vite configuration
```

---

## 🛠️ Local Development Setup

### Prerequisites
*   Node.js (v18+)
*   npm
*   MongoDB Account (MongoDB Atlas or Local MongoDB)
*   Cloudinary and Razorpay developer keys

### 1. Backend Setup
1. Navigate to the `Backend` directory:
    ```bash
    cd Backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the `Backend` directory and define your environment variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password
    ```
4. Seed mock data into the database:
    ```bash
    npm run seed
    ```
5. Start the backend development server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1. Navigate to the `Frontend` directory:
    ```bash
    cd ../Frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the client development server:
    ```bash
    npm run dev
    ```
4. Access the web app at `http://localhost:5173/`.

---

## 🌐 Deployment (Vercel & Render)

For detailed deployment instructions, checkout the split deployment method:
*   **Backend:** Hosted on **Render** (Root directory: `Backend`, Build command: `npm install`, Start command: `npm start`).
*   **Frontend:** Hosted on **Vercel** (Root directory: `Frontend`, Build command: `npm run build`, Output directory: `dist`, Environment Variable: `VITE_API_URL` pointing to your Render Backend URL).
