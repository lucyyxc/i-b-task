import React from "react";

const Payment = ({updateView}) => {


  return (
    <div className="Payment">
        <div>Give us your moneys</div>
        <button onClick={() => {updateView('selected', 'checklist')}}>Give $$</button>
    </div>
  );
};

export default Payment;