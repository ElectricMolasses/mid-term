// template for Order Cart
const templateOrder = `
  
<div class="user-order1">
    <span class="user-item-name"></span>
    <span class="user-order-quantity"></span>
    <span>
      <img class="user-item-remove"src="/resources/minus.png">
    </span>
    <span class="user-item-price"></span>
    <span>
      <img class="user-item-add" src="/resources/plus.png">
    </span>
</div>
<div class="footer">
  <span class="order-subtotal">Subtotal: </span>
  <span class="order-tax">Tax: </span>
  <span class="order-total">Total: </span>
</div>
<input class="user-order-submit" type="submit" value="Place Order"></input>
`;

//helpers funtions 

//sum up total of each order to show in order cart

const totalOrder = (orders) => {
  let subTotal = 0;
  for (let order in orders) {
    subTotal += orders[order]["price"] * orders[order]["quantity"];
  }
  $(".order-subtotal").text(subTotal.toFixed(2));
  $(".order-tax").text((subTotal * 0.05).toFixed(2));
  $(".order-total").text((subTotal + (subTotal * 0.05)).toFixed(2));
}

//add all order items to order cart template

const addToCart = (orders) => {
  for (let order in orders) {    
    const $temp = $(templateOrder);
    $temp.find(".user-item-name").append(orders[order]["name"]);
    $temp.find(".user-order-quantity").append(orders[order]["quantity"]);
    $temp.find(".user-item-price").append((orders[order]["price"] * orders[order]["quantity"]) .toFixed(2));
    
    $(".footer, input").detach();
    $(".user-order").append($temp);
  }
  totalOrder(orders);
};

//------------------

// Pick items from menu and add to order cart or increase qty in order cart

const orderSum = () => {
  
  let orderItems = [];
  let $foodName = {};
  $("body").on('click', ".user-item-add", function(event) {
    event.preventDefault();
    $(".user-order1").detach();
    const $name = $(this).closest('div').find(".user-item-name").text();
    orderItems.push($name);
    if (Object.keys($foodName).length === 0) {
      $foodName[$name] = { 
        name: $name,
        quantity: 1,
        price: $((this).closest('div')).find(".user-item-price").text() / 100
      }
    } else {
      if ($foodName.hasOwnProperty($name)) {
        $foodName[$name].quantity += 1;
      } else {
        $foodName[$name] = { 
          name: $name,
          quantity: 1,
          price: $((this).closest('div')).find(".user-item-price").text() / 100
        };
      }
    }
    addToCart($foodName);   //add food item to cart

    //submit order to server

    $(".user-order-submit").on('click', ((event) => {
      event.preventDefault();
      $.ajax("user/order", {
        method: 'POST',
        dataType: "json",
        data: {
          items: orderItems,
        }
      }).done((res) => {
        // if (res === 500) {
        //   alert("Please sign in to place order");
        // } else {
          console.log(data);
          console.log($(".user-order").val());
          console.log(res.rows);
        // })
      //get update on order confirmation
      })
      .then(() => {
        $.ajax('/user/profile', {
          method: 'GET',
          dataType: "json"
        }).done((res) => {
          console.log(res.rows[0]);
        })
      })

    }))
  })

  //remove items from order cart
  //change the arr of order items sent to server
  //update the quantity, price and total of order

  $("body").on('click', ".user-item-remove", function(event) {
    event.preventDefault();

    $item = $(this).closest('div').find(".user-item-name").text();
    $qty = Number($(this).closest('div').find(".user-order-quantity").text());

    if ($qty <= 1) {
      delete $foodName[$item];
      $(this).closest(".user-order1").detach();
      orderItems.splice(orderItems.indexOf($item), 1);
      totalOrder($foodName);
    } else {
      $qty -= 1;
      orderItems.splice(orderItems.indexOf($item), 1);
      $foodName[$item]["quantity"] = $qty;
      $(this).closest('div').find(".user-order-quantity").text($foodName[$item]["quantity"]);
      $(this).closest('div').find(".user-item-price").text($foodName[$item]["price"] * $qty);
      totalOrder($foodName);
    }
  })
  
  


};

