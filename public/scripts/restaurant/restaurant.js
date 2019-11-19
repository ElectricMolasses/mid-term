// import { object } from "twilio/lib/base/serialize";
$("document").ready(function() {
let object = {};
let pushArray = [];

function parseTimeStamp(time) {
  const properTime = time.slice(11,19);
  return properTime;
}

//Generate a Random Id for each Html Element
function randomId() {
  let random = "";
  const values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'g', 'h', 'r', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (let i = 0; i < 7; i++) {
    random += values[Math.floor(Math.random() * (values.length - 1))];
  }
  return random;
}

function renderOrder(orders) {
  const appendTothis = document.querySelector(".restaurant-empty");
  for (i = 0; i < orders.length; i++) {
    appendTothis.append(createOrder(orders[i]));
  }
  return console.log("orders loaded");
}

function loadOrders() {
  $.ajax('/restaurant/orders/', {
    method: 'GET'
  })
    .done((data, status, xhr) => {
      renderOrder(data);
    }).catch(() => {
      console.log('failed');
    });
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
  div.setAttribute('id', `${randomId()}`);
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
  console.log("div", div);
  console.log(div === object[div.getAttribute('id')]);

  div.addEventListener('dragstart', dragStart);
  div.addEventListener('dragend', dragEnd);
  return div;
}

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

function dragEnd(event) {
  this.className = 'restaurant-fill';
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
      console.log("drop-1");
      console.log(i)
    } else if (this === document.getElementById("restaurant-in-progress") && pushArray[pushArray.length - 1] === i) {
      $("#restaurant-in-progress").append($(`#${pushArray[0]}`));
      console.log("drop-2");
      console.log(i)
    } else if (this === document.getElementById("restaurant-complete") && pushArray[pushArray.length - 1] === i) {
      $("#restaurant-complete").append($(`#${pushArray[0]}`));
      $(".restaurant-time-started").text(moment());
      $(".restaurant-time-status").text("Time Complete");
    }
    this.className = "restaurant-empty";
  }
  }

  loadOrders();
      $(".restaurant-login-form").hide();
      //Click log in button to dsiplay form
      $(".restaurant-login-button").on("click", function() {
        $(".restaurant-login-form").slideToggle("slow", function() {
          //animation complete;
        });
      });

      console.log(object);
});

