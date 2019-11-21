// import { create } from "domain";

// import { object } from "twilio/lib/base/serialize";
let object = {};
let originList = [];
let inprogressList = [];
let IdArray = [];
// let denyList = [];
// let completedList = [];
// let incomingList = [];
$(() => {
  //Insert Blur hide here
  $(".restaurant-login-form").hide();
  $("#restaurant-popup").hide();
})

$("document").ready(function() {
  loadOrders()
  .then(function() {
    setInterval(sendOrderIds, 10000);
  });

  function confirmOrderAccepted(id, time) {
    console.log('id', id);
    console.log('time', time);
    $.ajax('/restaurant/orders', {
      method: 'PUT',
      data: {
        orderId: id,
        orderStatus: 'confirm',
        time_estimate: time
      }
    })
    blurOff();
    $("#restaurant-popup").show();
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

  function denyOrder(id) {
    $.ajax('/restaurant/orders', {
      method: 'PUT',
      data: {
        orderId: id,
        orderStatus: 'deny'
      }
    });
  }

  function parseTimeStamp(time) {
    const properTime = time.slice(11,19);
    return properTime;
  }

  function renderOrder(orders) {
    const incoming = document.querySelector("#restaurant-incoming");
    const complete = document.querySelector("#restaurant-complete");
    const inProgress = document.querySelector("#restaurant-in-progress");
    const deny = document.querySelector("#restaurant-deny-order");
    orders.forEach(order => {
      if (order.time_confirmed === "1990-01-01T00:00:00.000Z") {
        deny.append(createOrder(order));
      } else if (order.time_complete) {
        complete.append(createOrder(order));
      } else if (order.time_confirmed) {
        inProgress.append(createOrder(order));
      } else {
        incoming.append(createOrder(order));
      }
    })
  }

  function generateLi(orderItemsObject) {
    let itemHTML = ``;
    for (const i of orderItemsObject) {
      itemHTML += `<li>${i.name}</li> `;
    }
    return itemHTML;
  }

  function createOrder(i) {
    console.log(i);
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
      <p class="restaurant-current-time-elasped">Time complete</p>
      <span class="restaurant-current-time">${parseTimeStamp(i.time_complete)}<span>
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
    originList.push(event.toElement.attributes.id.nodeValue);
    // if (event.path[1].attributes[0].nodeValue === "restaurant-incoming") {
    //   incomingList.push(event.path[1].attributes[0].nodeValue);
    // }
    // if (event.path[1].attributes[0].nodeValue === "restaurant-complete") {
    //   completedList.push(event.path[1].attributes[0].nodeValue);
    // }
    // if (event.path[1].attributes[0].nodeValue === "restaurant-deny-order") {
    //   denyList.push(event.path[1].attributes[0].nodeValue);
    // }
    // if (event.path[1].attributes[0].nodeValue === "restaurant-in-progress") {
    //   inprogressList.push(event.path[1].attributes[0].nodeValue);
    // }
    this.className += ' hold';
    setTimeout(() => {
      this.className = 'invisible';
    }, 0);
  }

  function dragEnd() {
    this.className = 'restaurant-fill';
    originList.pop();
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
      if (this === document.getElementById("restaurant-incoming") && originList[originList.length - 1] === i) {
        $("#restaurant-incoming").append($(`#${originList[0]}`));
      } else if (this === document.getElementById("restaurant-in-progress") && originList[originList.length - 1] === i) {
        $("#restaurant-popup").show();
        //insert Blur Show here
        blurOn();
        inprogressList.push(originList[0]);
        $("#restaurant-in-progress").append($(`#${originList[0]}`));
        $("#restaurant-pop-submit").on("click", () => {
          confirmOrderAccepted(inprogressList[0], $(".restaurant-time-data").val());
          inprogressList.pop();
        })
      } else if (this === document.getElementById("restaurant-complete") && originList[originList.length - 1] === i) {
        $("#restaurant-complete").append($(`#${originList[0]}`));
        $(`#${originList[0]} .restaurant-time-started`).text(moment());
        $(`#${originList[0]} .restaurant-time-status`).text("Time Complete");
        orderComplete();
      } else if (this === document.getElementById("restaurant-deny-order") && originList[originList.length - 1] === i) {
        denyOrder(originList[0]);
        $("#restaurant-deny-order").append($(`#${originList[0]}`));
      }
      this.className = "restaurant-empty";
    }
  }




  //Click log in button to dsiplay form
  $(".restaurant-login-button").on("click", function() {
    $(".restaurant-login-form").slideToggle("slow", function() {
      //animation complete;
    });
  });


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
    const elements = document.getElementsByTagName("*");

    for (let element of elements) {
      element.style.filter = '';
    }
  };

  document.querySelector(".restaurant-pop-up-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      document.querySelector(".restaurant-pop-up-holder")
        .style.display = "none";
        recursiveBlurOff(document.querySelector("HTML"));
    });

});





