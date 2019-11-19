<<<<<<< HEAD
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
=======
//helpers function

const addToOrder = (food,order) => {

  if (order.length === 0) {
    order.push(food);
  } else {
    let checkItem = true;
    order.forEach(item => {
      if (item["name"] === food["name"]) {
        item["quantity"] += 1;
        checkItem = false;
        return;
      }
    });
    if (checkItem) order.push(food);
  }
  return order;
};

const updateCart = (cart, item) => {
  for (let i in cart) {
    if (cart[i] === item) {
       cart .splice(0,1);
       return cart;
    }
>>>>>>> 327513ea3cc78a09f2e33825dcdac6a1e1fd4401
  }
  $(".order-subtotal").text(subTotal.toFixed(2));
  $(".order-tax").text((subTotal * 0.05).toFixed(2));
  $(".order-total").text((subTotal + (subTotal * 0.05)).toFixed(2));
}

<<<<<<< HEAD
//add all order items to order cart template

const addToCart = (orders) => {
  for (let order in orders) {    
    const $temp = $(templateOrder);
    console.log(typeof orders[order]);
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
=======
const templateOrder = `

  <table class="user-order1">
    <tr>
      <td class="user-item-name"></td>
      <td class="user-order-quantity"></a>
      <td>
        <img class="user-item-remove"src="/resources/minus.png">
      </td>
      <td class="user-item-price"></td>
      <td>
        <img class="user-item-add" src="/resources/plus.png">
      </td>

    </tr>
  </table>
  <footer >
    <span class="order-subtotal">Subtotal: </span>
    <span class="order-tax">Tax: </span>
    <span class="order-total">Total: </span>
  </footer>
  <input class="user-order-submit" type="submit" value="Place Order"></input>
  `;

const addToCart = (orders) => {
  let subTotal = 0;
  for (let order of orders) {

    const $temp = $(templateOrder);
    const $itemTotal = Number((order["price"] * order["quantity"]).toFixed(2));
    subTotal += ($itemTotal);

    $temp.find(".user-item-name").append(order["name"]);
    $temp.find(".user-order-quantity").append(order["quantity"]);
    $temp.find(".user-item-price").append($itemTotal);

    $("footer, input").detach();
    $(".user-order").append($temp);
  }
  $(".order-subtotal").append(subTotal);
  $(".order-tax").append(Number((0.05 * subTotal).toFixed(2)));
  $(".order-total").append(Number((subTotal + subTotal* 0.05).toFixed(2)));

  }
//Add items to order cart

const orderSum = () => {


  let yourOrder = [];
  let orderItems = []; //send to server

>>>>>>> 327513ea3cc78a09f2e33825dcdac6a1e1fd4401
  $("body").on('click', ".user-item-add", function(event) {
    event.preventDefault();
    $(".user-order1").detach();
<<<<<<< HEAD
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
=======

    let $foodName = {};
    $foodName["name"] = $(this).closest('tr').find(".user-item-name").text();
    addToOrder($foodName, yourOrder);
    $foodName["quantity"] = 1;
    $foodName["price"] = $(this).closest('tr').find(".user-item-price").text() / 100;

    addToCart(yourOrder);

    // for (let order of yourOrder) {

    //   const $temp = $(templateOrder);
    //   const $itemTotal = Number((order["price"] * order["quantity"]).toFixed(2));
    //   subTotal += ($itemTotal);

    //   $temp.find(".user-item-name").append(order["name"]);
    //   $temp.find(".user-item-quantity").append(order["quantity"]);
    //   $temp.find(".user-item-price").append($itemTotal);

    //   $("footer, input").detach();
    //   $(".user-order").append($temp);
    // }
    // $(".order-subtotal").append(subTotal);
    // $(".order-tax").append(Number((0.05 * subTotal).toFixed(2)));
    // $(".order-total").append(Number((subTotal + subTotal* 0.05).toFixed(2)));





>>>>>>> 327513ea3cc78a09f2e33825dcdac6a1e1fd4401

    $(".user-order-submit").on('click', ((event) => {
<<<<<<< HEAD
      $.ajax("user/order", {
=======
      // event.preventDefault();

      console.log($(".user-order").val());
      console.log('test');
      $.ajax("user/order", {

>>>>>>> 327513ea3cc78a09f2e33825dcdac6a1e1fd4401
        method: 'POST',
        dataType: "json",
        data: {
          items: orderItems,
<<<<<<< HEAD
=======


>>>>>>> 327513ea3cc78a09f2e33825dcdac6a1e1fd4401
        }
      }).done((res) => {
        console.log(data);
        console.log($(".user-order").val());
        console.log(res.rows);
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

