# OME Electrical Ecommerce

## Project structure

```txt
Frontend/  React + Vite storefront
Backend/   Express API for protected orders, Firebase Admin and Paystack secret key
```

## Start the frontend

```bash
cd Frontend
npm install
npm run dev
```

## Start the backend

```bash
cd Backend
npm install
copy .env.example .env
npm run dev
```

## Important

- Firebase web config stays in `Frontend/.env`.
- Firebase Admin private key and Paystack secret key stay in `Backend/.env`.
- Checkout now requires login before saving an order or proceeding to payment.
- Add/edit products from `Frontend/src/data/products.js`.
