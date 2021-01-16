import React from "react";

import {loadStripe} from '@stripe/stripe-js';

import Footer from './Footer';

const stripePromise = loadStripe('pk_test_51I9iRxKX2bGZIfblIuVdvbVIAJV1PxHx1XWSNOSXBzMWg44ibfZXEjg7PpgvGUW7BFCJf4E7DfcITcHIRliyfeL900GVeXuDQO')

const Payment = ({updateView}) => {
  const query = new URLSearchParams(window.location.search);
  console.log('query', query);

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

  //TODO FIGURE OUT COUPONS
  //TODO TAXES?
  //TODO GET IMAGE
  //TODO WHAT GOES ON THIS PAGE

  return (
    <div className="Payment">
      <button onClick={() => startCheckout()}>START CHECKOUT</button>
      <a href="/#/checklist">Give $$</a>
      <Footer />
    </div>
  );
};

export default Payment;