//
// module.exports = function(app, db, rcons) {
//     require("./api/index")(app, db);
//     app.get("/PaypalTest", (req, res) => {
//         paypal.payment.create({
//             "intent": "sale",
//             "payer": {
//                 "payment_method": "paypal"
//             },
//             "redirect_urls": {
//                 "return_url": "http://localhost:1403/",
//                 "cancel_url": "http://localhost:1403/login"
//             },
//             "transactions": [{
//                 "item_list": {
//                     "items": [{
//                         "name": "package_name",
//                         "sku": "package_name",
//                         "price": 25,
//                         "currency": "USD",
//                         "quantity": 1
//                     }]
//                 },
//                 "amount": {
//                     "currency": "USD",
//                     "total": 25
//                 },
//                 "description": "My description - Oh yeah"
//             }]
//         }, (err, payment) => {
//             if (err) throw err;
//             console.log(payment);
//             res.redirect(payment.links[1].href);
//         });
//     })

//     require("./routes/staff/index")(app, db, rcons);
// }


const rts = [
    require("./routes/api"),
    require("./routes/client"),
    require("./routes/account"),
    require("./routes/staff"),
    require("./routes/errors")
];

/** @type {import("./routes")} */
module.exports = function routes(app, ...args) {
    function exec(v) {v(...args)};
    
    for (const Route of rts) {
        exec(Route);
        app.use(Route.thisRoute, Route.r);
    }
}
