import React from "react";

import {loadStripe} from '@stripe/stripe-js';

import Footer from './Footer';

const stripePromise = loadStripe('pk_test_51I9iRxKX2bGZIfblIuVdvbVIAJV1PxHx1XWSNOSXBzMWg44ibfZXEjg7PpgvGUW7BFCJf4E7DfcITcHIRliyfeL900GVeXuDQO')

const Payment = () => {
  const startCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      alert(result.error.message)
    }
  };

  return (
    <div className="Payment">
      <span onClick={startCheckout()}></span>
      <Footer />
    </div>
  );
};

export default Payment;