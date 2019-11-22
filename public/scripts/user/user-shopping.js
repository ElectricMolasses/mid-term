// template for Order Cart
const templateOrder = `

<div class="user-order1">
  <span class="user-item-name"></span>
  <span class="user-order-quantity"></span>
  <span class="user-item-price"></span>
  <img class="user-item-remove"src="/resources/minus.png">
  <img class="user-item-add" src="/resources/plus.png">
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
  let totalItem = 0;
  for (let order in orders) {
    subTotal += orders[order]["price"] * orders[order]["quantity"];
    totalItem += orders[order]["quantity"];
  }
  $(".order-subtotal").text(`SubTotal: ${subTotal.toFixed(2)}`);
  $(".order-tax").text(`Tax: ${(subTotal * 0.05).toFixed(2)}`);
  $(".order-total").text(`Total: ${(subTotal + (subTotal * 0.05)).toFixed(2)}`);
  $(".cart").attr('data',`${totalItem}`);
  $(".total").text((subTotal + (subTotal * 0.05)).toFixed(2));

  localStorage.setItem('cartItems', totalItem);
  localStorage.setItem('cartTotal', (subTotal + (subTotal * 0.05)).toFixed(2));
};

//add all order items to order cart template
const addToCart = (orders) => {

  for (let order in orders) {
    const $temp = $(templateOrder);
    $temp.find(".user-item-name").append(orders[order]["name"]);
    $temp.find(".user-order-quantity").append(orders[order]["quantity"]);
    $temp.find(".user-item-price").append((orders[order]["price"] * orders[order]["quantity"]) .toFixed(2));


    $(".footer").detach();
    $(".user-order-submit").detach();
    $(".user-order").append($temp);
  }
  totalOrder(orders);

};


//render orders in local storage first before add more items
const renderCookieCart = () => {
  const cartLocalStorage = JSON.parse(localStorage.getItem('sessionCart'));
  if (cartLocalStorage !== null) {
    addToCart(cartLocalStorage);
  }
  totalOrder(cartLocalStorage);
};

// Pick items from menu and add to order cart or increase qty in order cart


const orderSum = () => {

  let orderItems = [];
  let $foodName = {};
  let storage = JSON.parse(localStorage.getItem('sessionCart'));
  if (storage !== null) {
    $foodName = Object.assign(storage, $foodName);
  }

  renderCookieCart();
  $("body").on('click', ".user-item-add", function(event) {
    event.preventDefault();
    $(".user-order1").detach();
    const $name = $(this).closest('div').find(".user-item-name").text();
    orderItems.push($name);
    if (Object.keys($foodName).length === 0) {
      $foodName[$name] = {
        name: $name,
        quantity: 1,
        price: $((this).closest('div')).find(".user-item-price").text()
      };
    } else {
      if ($foodName.hasOwnProperty($name)) {
        $foodName[$name].quantity += 1;
      } else {
        $foodName[$name] = {
          name: $name,
          quantity: 1,
          price: $((this).closest('div')).find(".user-item-price").text()
        };
      }
    }

    addToCart($foodName);   //add food item to cart

    localStorage.setItem('sessionCart', JSON.stringify($foodName));


    //submit order to server then send thankyou message to customer waiting for
    //confirmation from restarant. Estimated complete time of the order will show up
    //in the interval of 5s.



    let id;
    $(".user-order-submit").on('click', ((event) => {
      event.preventDefault();
      $(".cart").attr('data',`0`);
      $(".total").text("0.00");
      $(".user-time-confirm").text(`Restaurant is confirming your order`);
      //get update on order confirmation
      $(".user-order").hide().removeClass('visible');
      $(".order-confirmation").show().addClass('visible');
      localStorage.clear();
      $.ajax("user/order", {
        method: 'POST',
        dataType: "json",
        data: {
          items: orderItems,
        }
      })
        .then((res) => {
          console.log(res);
          id = res;
          console.log(id);;
          repeatCheck();
        });

      // eslint-disable-next-line func-style
      function repeatCheck() {
        setTimeout(() => {
          checkData().then(res => {
            if (!res) repeatCheck();
          });
        }, 5000);
      }

      // eslint-disable-next-line func-style
      function checkData() {
        return $.ajax('/user/update', {
          method: 'POST',
          dataType: "json",
          data: {
            order: id
          }
        }).then((data) => {
          console.log("Response received.");
          if (data.time_estimate !== null) {
            const time =
            moment(data.time_estimate.replace('T', ' ')).fromNow();
            console.log(time);
            console.log(moment(time).local());
            $(".user-time-confirm").text(`Your order was confirmed. The estimate pick-up time is ${time}.`);
            return true;
          }
          return false;
        });
      }

    }))
  });

  //remove items from order cart
  //change the arr of order items sent to server
  //update the quantity, price and total of order

  $("body").on('click', ".user-item-remove", function(event) {
    event.preventDefault();
    // console.log($foodName);
    const $item = $(this).closest('div').find(".user-item-name").text();
    let $qty = Number($(this).closest('div').find(".user-order-quantity").text());

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
      $(this).closest('div').find(".user-item-price").text(($foodName[$item]["price"] * $qty).toFixed(2));
      totalOrder($foodName);
    }
    localStorage.setItem('sessionCart', JSON.stringify($foodName));
  });
};

const blurOn = function() {
  const elements = document.querySelectorAll("body > *");

  for (let element of elements) {
    element.className += " blurred";
    //element.style.filter = "blur(1px)";
  }

  let noBlur = document.getElementsByClassName('noblur');

  for (const element of noBlur) {
    recursiveBlurOff(element);
  }
};

const recursiveBlurOff = function(element) {
  element.classList.remove("blurred");
  //element.style.filter = "blur(0px)";

  for (const child of element.children) {
    recursiveBlurOff(child);
  }
};

const blurOff = function() {
  recursiveBlurOff(document.querySelector("HTML"))
};


