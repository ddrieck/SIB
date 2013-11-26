var stripe = require("stripe")(
  "sk_test_h2tF3rrVqvHICpS3BQPQYeaB"
);

stripe.setApiKey("sk_test_h2tF3rrVqvHICpS3BQPQYeaB");

var express = require('express');
var app = express();
var qs = require ('querystring');

app.use(express.static(__dirname + '/'));
app.use(express.bodyParser());

app.listen(process.env.PORT || 3000);

app.post('/charge', function(req, res) {
    console.log('Inside the post request!');

    console.log(req.body);

    var stripeToken = req.body.token;

	var charge = stripe.charges.create({
	  amount: req.body.amount, // amount in cents, again
	  currency: "usd",
	  card: stripeToken,
	  description: req.body.description,
	}, function(err, charge) {
	  if (err && err.type === 'StripeCardError') {
	    // The card has been declined
	  }
	});

	console.log(charge);	
});



