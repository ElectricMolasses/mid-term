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

const updateCartTotal = () => {
  let subTotal = 0;
  const $order = $(".user-order1")
  for (let i = 0; i < $order.length; i++) {
    console.log($order[i])
    console.log(($order[i]).find(".user-item-price").text())
    // const $itemTotal = Number($order[i].closest('tr').find(".user-item-price").text()) * Number($(".user-order-quantity"));
    console.log($itemTotal)
    // console.log($order[i].find(".user-item-price").text())
    subTotal += ($itemTotal);
    console.log(subTotal);
    }
    $(".order-subtotal").val(subTotal.toFixed(2));
    $(".order-tax").val(Number((0.05 * subTotal).toFixed(2)));
    $(".order-total").val(Number((subTotal + subTotal* 0.05).toFixed(2)));
  
}

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
  $(".order-subtotal").append(subTotal.toFixed(2));
  $(".order-tax").append(Number((0.05 * subTotal).toFixed(2)));
  $(".order-total").append(Number((subTotal + subTotal* 0.05).toFixed(2)));
  
}

//Add items to order cart

const orderSum = () => {
  
  
  let yourOrder = [];
  let orderItems = []; //send to server

  $("body").on('click', ".user-item-add", function(event) {
    event.preventDefault();
    $(".user-order1").detach();
    
    let $foodName = {};
    $foodName["name"] = $(this).closest('tr').find(".user-item-name").text();
    addToOrder($foodName, yourOrder); //add food name to order summary
    $foodName["quantity"] = 1;
    $foodName["price"] = $(this).closest('tr').find(".user-item-price").text() / 100;

    addToCart(yourOrder);

     //submit order to server
    orderItems.push($foodName["name"]);
    $(".user-order-submit").on('click', ((event) => {

      // event.preventDefault();
      
      $.ajax("user/order", {
        
        method: 'POST',
        dataType: "json",
        data: {
          items: orderItems,
          
        }
      }).done((res) => {
        console.log(data);
        console.log($(".user-order").val());
        console.log(res.rows);
      })
    }))
  });
  $("body").on('click', ".user-item-remove", function(event) {
    event.preventDefault();

    $item = $(this).closest('tr').find(".user-item-name").text();
    $qty = Number($(this).closest('tr').find(".user-order-quantity").text());
    $price = Number($(this).closest('tr').find(".user-item-price").text());
    $unitPrice = ($price / $qty).toFixed(2);

    if ($qty <= 1) {
      $(this).closest(".user-order1").detach();
      orderItems.splice(orderItems.indexOf($item), 1);
      yourOrder
    } else {
      $qty -= 1;
      console.log(yourOrder)
      orderItems.splice(orderItems.indexOf($item), 1);
      $(this).closest('tr').find(".user-order-quantity").text($qty);
      $(this).closest('tr').find(".user-item-price").text($qty * $unitPrice);
      updateCartTotal();
    }
  })
};

