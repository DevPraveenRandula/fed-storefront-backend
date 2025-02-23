import express, { ErrorRequestHandler } from "express";

import "dotenv/config"; // This must be at the very top of your file
import { productRouter } from "./api/product";
import { connectDB } from "./infrastructure/db";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { categoryRouter } from "./api/category";
import cors from "cors";
import { orderRouter } from "./api/order";
import { clerkMiddleware } from "@clerk/express";
import { paymentsRouter } from "./api/payment";

const stripe = require("stripe")(process.env.STRIPE_SECRET);
// console.log(stripe);

const app = express();
app.use(express.json());
app.use(clerkMiddleware({
    publishableKey:process.env.VITE_CLERK_PUBLISHABLE_KEY,
    secretKey:process.env.CLERK_SECRET_KEY,
}))
app.use(cors({
    origin: "https://fed-storefront-frontend-praveen.netlify.app",
    credentials: true
}));

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentsRouter);

// console.log("Publishable Key:", process.env.VITE_CLERK_PUBLISHABLE_KEY);
// console.log("Secret Key:", process.env.CLERK_SECRET_KEY);

// Stripe Payment Route
// app.post("/api/payments/create-checkout-session", async (req, res) => {
//     try {
//         const { items } = req.body;

//         const lineItems = items.map((item) => ({
//             price_data: {
//                 currency: "usd",
//                 product_data: {
//                     name: item.name,
//                 },
//                 unit_amount: item.price * 100,
//             },
//             quantity: item.quantity,
//         }));

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: lineItems,
//             mode: "payment",
//             success_url: "http://localhost:5173/shop/complete",
//             cancel_url: "http://localhost:5173/shop/cancel",
//         });

//         res.json({ id: session.id });
//     } catch (error) {
//         console.error("Error creating Stripe checkout session:", error);
//         res.status(500).json({ error: "Failed to create checkout session" });
//     }
// });


app.use(globalErrorHandlingMiddleware);

connectDB();
app.listen(8000, () => console.log(`Server running on port ${8000}`));
