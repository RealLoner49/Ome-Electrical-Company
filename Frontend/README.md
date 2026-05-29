# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Finalization notes

- Product/category updates are centralized in `src/data/products.js`.
- Firebase config is in `src/firebase.js`; copy `.env.example` to `.env` and add your Firebase values.
- Login/signup is handled through `src/context/AuthContext.jsx` and `src/components/AuthModal.jsx`.
- Checkout/payment is protected: users must be logged in before proceeding to payment.
- Orders are saved to Firestore in an `orders` collection from `src/Pages/Checkout/Checkout.jsx`.
- The hamburger menu has been redesigned for mobile with a drawer, animated backdrop, and premium transitions.

Before running, install dependencies:

```bash
npm install
npm install firebase
npm run dev
```
