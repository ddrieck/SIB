$(document).ready(function(){

	//alert("Page Loaded!");
	//$(".product").find("img").fadeOut(2000);
	$(".details").on("click", function(){
		$(this).parent().find(".description").slideToggle();
		return false;
	});
	$(".eu-toggle").on("click", function(){
		$(".eu").show();
		$(".us").hide();
	})
	$(".us-toggle").on("click", function(){
		$(".us").show();
		$(".eu").hide();
	})

//Javascript code for cart logic
var cart = [];

$(".addtocart").on("click", function(){
	var productClass = $(this).closest(".product");
	var nameOfProduct = productClass.find("h2").text();
	var skuOfProduct = productClass.data("sku");

	if ($(".us").is(":visible")){
		var priceOfProduct = productClass.find(".us").text();
	} else {
		var priceOfProduct = productClass.find(".eu").text();
	}
	//Have to remove the currency symbol. Use slice to remove the symbol and parseFloat to convert it to a number.
	priceOfProduct = priceOfProduct.slice(1,3);
	priceOfProduct = parseFloat(priceOfProduct);


	var cartItem = { name: nameOfProduct,
	             	sku: skuOfProduct, 
	               	price: priceOfProduct, 
	               	quantity: 1 };
	
	//Looping through an array of objects is a pain in the ass so use JSON method to convert to string
	var cartArrayString = JSON.stringify(cart);

	//Use indexOf of the string to see if the object already exists in array. If so push cartItem.
	if (cartArrayString.indexOf(skuOfProduct) === -1 || cart.length === 0){
			cart.push(cartItem);
			$("#checkout").removeAttr("disabled");
	} else {
		//Use grep to search array and find where sku matches button click. Add one to quantity of found object.
		var cartSearch = $.grep(cart, function(n, i){
			if (n.sku === skuOfProduct) {
				n.quantity++;
			}
		});
	}

	
	function refreshCart(){
		total = 0;	
		$("#cart").empty();

		for(var i = 0; i < cart.length; i++) {
	 			var cartItem = cart[i];
	 			var quantity = cartItem.quantity;
	 			var price = cartItem.price;
	 			var name = cartItem.name;
	 			var sku = cartItem.sku;
	 			var itemDiv = $("<div>").addClass("cart-item");

	 			var skuString = $(".cart-item").children(".sku-text").text();

	 			var priceText = $("<div>").addClass("cart-price").text("$" + price + " x " + quantity);
	 			var nameText = $("<p>").text(name);
	 			var skuText = $("<p>").addClass("sku-text").text(sku);
	 			var itemText = $(itemDiv).append(priceText).append(nameText).append(skuText);

				$("#cart").append(itemText);

				total += quantity * price;

		} //end of for loop

	}

	refreshCart();
	
		if ($(".us").is(":visible")){
			$(".cart-total").text("Total $" + total);
		} else {
			$(".cart-total").text("Total \u20AC" + total);
		}

}); //end of on click function

//Checkout event handler
var publicToken = "pk_test_0zov70ZpodhcerncFctUkrWZ";

   $('#checkout').click(function(){
	   	var descriptionArray = [];
		for(var i=0;i<cart.length;i++) {
		   var cartItem = cart[i];
		   var sku = cartItem.sku;
		   var quantity = cartItem.quantity;

		   descriptionArray.push(sku);
		   descriptionArray.push(quantity);
		}

		console.log(token);

      var token = function(res){
    		$.post("/charge",{
		        token: res.id,
		        amount: total * 100,
		        description: descriptionArray.join(", "), 
		      });
      };

      StripeCheckout.open({
        key:         publicToken,
        address:     true,
        amount:      total * 100,
        currency:    'usd',
        name:        'T-Shirts',
        description: "One or more t-shirts",
        panelLabel:  'Checkout',
        token:       token
      });

      return false;
    });

}); //end of jquery