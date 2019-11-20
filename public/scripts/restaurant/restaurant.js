// import { create } from "domain";

// import { object } from "twilio/lib/base/serialize";
let object = {};
let pushArray = [];
let IdArray = [];

$("document").ready(function() {
  loadOrders()
  .then(function() {
    setInterval(sendOrderIds, 5000);
  });
  // loadOrders();
  $("#restaurant-deny-order").hide();
  $(".deny-orders").on("click", function() {
    $("#restaurant-deny-order").slideToggle("fast", function() {
      //animation complete
    });
  });

  function confirmOrderAccepted() {
    $.ajax('/restaurant/orders', {
      method: 'PUT',
      data: {
        orderId: 3,
        orderStatus: 'confirm',
        time_estimate: moment(new Date(1995, 5, 1, 12, 12, 12)).format("YYYY-MM-DD HH:mm:ss")
      }
    });
  }

  function loadOrders() {
    return $.ajax('/restaurant/orders/', {
      method: 'GET'
    })
      .done((data, status, xhr) => {
        renderOrder(data);
      }).catch(() => {
        console.log('failed');
      });

}

  function sendOrderIds() {
    $.ajax('/restaurant/update', {
      method: "POST",
      data: {
        orderIds: IdArray
      }
    }).then((data) => {
      renderOrder(data);
    })
  }


  function orderComplete() {
    $.ajax('/restaurant/orders', {
      method: 'PUT',
      data: {
        orderId: 3,
        orderStatus: 'complete'
      }
    });
  }

  function denyOrder() {
    event.preventDefault();
    $.ajax('/restaurant/orders', {
      method: 'PUT',
      data: {
        orderId: 3,
        orderStatus: 'deny'
      }
    });
    console.log("deny-Order has been called!");
  }

  function parseTimeStamp(time) {
    const properTime = time.slice(11,19);
    return properTime;
  }

  function renderOrder(orders) {
    const incoming = document.querySelector("#restaurant-incoming");
    const complete = document.querySelector("#restaurant-complete");
    for (let i = 0; orders.length; i++) {
      if (orders[i].time_complete) {
        complete.append(createOrder(orders[i]));
      } else {
        incoming.append(createOrder(orders[i]));
      }
    }
  }

  function generateLi(orderItemsObject) {
    let itemHTML = ``;
    for (const i of orderItemsObject) {
      itemHTML += `<li>${i.name}</li> `;
    }
    return itemHTML;
  }

  function createOrder(i) {
    let timeStamp = i.time_placed.slice(0, 19);
    let div = document.createElement('div');
    div.setAttribute('draggable', 'true');
    div.setAttribute('id', `${i.id}`);
    div.setAttribute('class', 'restaurant-fill');
    div.innerHTML = (`<div class="restaurant-name-display">
      <p>Name</p>
      <span class="restaurant-customer-id">${i.customer}</span>
      </div>
      <div class="restaurant-time-display">
      <p class="restaurant-time-status">Time Placed</p>
      <span class="restaurant-time-started">${parseTimeStamp(i.time_placed)}</span>
      </div>
      <div class="restaurant-menu-items">
      <p>Menu Items<p>
      <ul>
        ${generateLi(i.items)}
      </ul>
      </div>
      <div class="restaurant-phonenumber">
      <p>phone Number</p>
      <span class="restaurant-phone">${i.phone_number}</span>
      </div>
      <div class="restaurant-current-time-holder">
      <p class="restaurant-current-time-elasped">Time Elapsed</p>
      <span class="restaurant-current-time">${(moment(timeStamp).fromNow())}<span>
      </div>`);


    object[div.getAttribute("id")] = div;
    div.addEventListener('dragstart', dragStart);
    div.addEventListener('dragend', dragEnd);
    IdArray.push(i.id);
    return div;
  }


  const deny = document.querySelector("#restaurant-deny-order");
  deny.addEventListener('dragover', dragOver);
  deny.addEventListener('dragenter', dragEnter);
  deny.addEventListener('dragleave', dragLeave);
  deny.addEventListener('drop', dragDrop);

  const empties = document.querySelectorAll(".restaurant-empty");
  for (const empty of empties) {
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('drop', dragDrop);
  }

  function dragStart() {
    pushArray.push(event.toElement.attributes.id.nodeValue);
    this.className += ' hold';
    setTimeout(() => {
      this.className = 'invisible';
    }, 0);
  }

  function dragEnd() {
    this.className = 'restaurant-fill';
    pushArray.pop();
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
    this.className += ' hovered';
  }

  function dragLeave() {
    this.className = 'restaurant-empty';
  }

  function dragDrop(event) {
    for (const i in object) {
      if (this === document.getElementById("restaurant-incoming") && pushArray[pushArray.length - 1] === i) {
        $("#restaurant-incoming").append($(`#${pushArray[0]}`));
      } else if (this === document.getElementById("restaurant-in-progress") && pushArray[pushArray.length - 1] === i) {
        $("#restaurant-in-progress").append($(`#${pushArray[0]}`));
        confirmOrderAccepted();
      } else if (this === document.getElementById("restaurant-complete") && pushArray[pushArray.length - 1] === i) {
        $("#restaurant-complete").append($(`#${pushArray[0]}`));
        $(`#${pushArray[0]} .restaurant-time-started`).text(moment());
        $(`#${pushArray[0]} .restaurant-time-status`).text("Time Complete");
        orderComplete();
      } else if (this === document.getElementById("restaurant-deny-order") && pushArray[pushArray.length - 1] === i) {
        denyOrder();
        $("#restaurant-deny-order").append($(`#${pushArray[0]}`));
      }
      this.className = "restaurant-empty";
    }
  }

  $(".restaurant-login-form").hide();
  //Click log in button to dsiplay form
  $(".restaurant-login-button").on("click", function() {
    $(".restaurant-login-form").slideToggle("slow", function() {
      //animation complete;
    });
  });

});

