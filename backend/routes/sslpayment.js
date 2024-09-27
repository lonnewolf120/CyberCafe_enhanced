const express = require('express')
const router = express.Router()

const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = '<your_store_id>'
const store_passwd = '<your_store_password>'
const is_live = false //true for live, false for sandbox


//sslcommerz init
router.get('/init_payment', (req, res) => {
    const product = req.body.product;
    const user = req.body.user;

    const data = {
        total_amount: product.amount,
        currency: 'BDT',
        tran_id: 'REF123', // use unique tran_id for each api call
        success_url: 'http://localhost:3030/success',
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: product.name,
        product_category: product.category,
        product_profile: product.profile,
        cus_name: user?.name,
        cus_email: user?.email,
        cus_add1: user?.addr? user.addr : 'Dhaka',
        cus_add2: user?.addr? user.addr : 'Dhaka',
        cus_city: user?.addr? user.addr : 'Dhaka',
        cus_state: user?.addr? user.addr : 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: user?.phone? user.phone : '01711111111',
        cus_fax: '01711111111',
        ship_name: user?.name,
        ship_add1: user?.addr? user.addr : 'Dhaka',
        ship_add2: user?.addr? user.addr : 'Dhaka',
        ship_city: user?.addr? user.addr : 'Dhaka',
        ship_state: user?.addr? user.addr : 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

    sslcz.init(data)
        .then(apiResponse => {
            // Redirect the user to payment gateway
            let GatewayPageURL = apiResponse.GatewayPageURL
            res.redirect(GatewayPageURL)
            console.log('Redirecting to: ', GatewayPageURL)
        })
        .catch(error => {
            console.log("Error while doing payment: ", error);
            return res.status(500).json({ success: false, message: error.message, error: error });
        })
})


//sslcommerz validation 

app.get('/validate', (req, res) => {
    const data = {
        val_id:ADGAHHGDAKJ456454 //that you go from sslcommerz response
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.validate(data).then(data => {
        //process the response that got from sslcommerz 
       // https://developer.sslcommerz.com/doc/v4/#order-validation-api
    });
}) 


//SSLCommerz initiateRefund

app.get('/initiate-refund', (req, res) => {
    const data = {
        refund_amount:req.body.refund_amount,
        refund_remarks:req.body.refund_remarks? req.body.refund_remarks : 'Refund',
        bank_tran_id: req.body.bank_tran_id ?req.body.bank_tran_id : CB5464321445456456,
        refe_id: req.body.refe_id? req.body.refe_id: EASY5645415455,
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.initiateRefund(data).then(data => {
        //TODO: process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#initiate-the-refund
    });
})

//SSLCommerz refundQuery

app.get('/refund-query', (req, res) => {
    const data = {
        refund_ref_id:SL4561445410,
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.refundQuery(data).then(data => {
        //process the response that got from sslcommerz
        //https://developer.sslcommerz.com/doc/v4/#initiate-the-refund
    });
})


//SSLCommerz transactionQueryByTransactionId
//you also use this as internal method
app.get('/transaction-query-by-transaction-id', (req, res) => {
    const data = {
        tran_id:AKHLAKJS5456454,
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.transactionQueryByTransactionId(data).then(data => {
        //process the response that got from sslcommerz
        //https://developer.sslcommerz.com/doc/v4/#by-session-id
    });
})

//SSLCommerz transactionQueryBySessionId
//you also use this as internal method
app.get('/transaction-query-by-session-id', (req, res) => {
    const data = {
        sessionkey:AKHLAKJS5456454,
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.transactionQueryBySessionId(data).then(data => {
        //process the response that got from sslcommerz
        //https://developer.sslcommerz.com/doc/v4/#by-session-id
    });
})