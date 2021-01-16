import React from "react";
import _isEmpty from "lodash/isEmpty";
import axios from "axios";

import Footer from './Footer';

const Confirmation = () => {
    const [customer, updateCustomer] = React.useState({})

    if (_isEmpty(customer)){
        const session_id = window.location.href.split("=")[1]
        axios.post('/create-confirmation-session', { session_id })
        .then( response => {
            console.log(response.data);
        })
    }

    return (
        <div>
            Confirmation stuff goes here;
            <a href="/#/checklist">Go to checklist</a>
            <Footer />
        </div>
    );
}

export default Confirmation;