//time elapsed
function clock() {
  const today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();
  minutes = renderTime(minutes);
  seconds = renderTime(seconds);
  $(".restaurant-current-time").text(`${hours} : ${minutes} : ${seconds}`);
  setTimeout(clock, 500);
}

function renderTime(i) {
  if (i < 10) {i = "0" + i};
  return i;
}



//time stamp
const currentdate = new Date();
const datetime = currentdate.getDate() + "/"
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();

function renderOrder(orders) {
  const appendTothis = document.querySelector(".restaurant-empty");
  for (i = 0; i < orders.length; i++) {
    appendTothis.insertAdjacentHTML('afterbegin', createOrder(orders[i]));
  };
  return console.log("orders loaded");
}

function generateLi(orderItemsArray) {
  if (!Array.isArray(orderItemsArray)) {
    return `<li>${orderItemsArray}</li>`
  } else {
    let $item = ``;
    for (const j of orderItemsArray) {
      $item += `<li>${j}</li>`
    }
    return $item;
  }
}

function createOrder(i) {
  let markup =
`<div draggable="true" class="restaurant-fill">
  <div class="restaurant-name-display">
    <p>Name</p>
  <span class="restaurant-customer-id">${i.customer}</span>
</div>
<div class="restaurant-time-display">
  <p class="restaurant-time-status">Time Placed</p>
  <span class="restaurant-time-started">${i.time_placed}</span>
</div>
<div class="restaurant-menu-items">
  <p>Menu Items<p>
  <ul>
    ${generateLi(i.items[0].name)}
  </ul>
</div>
<div class="restaurant-phonenumber">
  <p>phone Number</p>
  <span class="restaurant-phone">${i.phone_number}</span>
</div>
<div class="restaurant-current-time-holder">
  <p class="restaurant-current-time-elasped>Time elapsed">
  <span class="restaurant-current-time"><span>
</div>
</div>`;
console.log(markup);
return markup;
}


$("document").ready(function(){
  let loaded = true;
  $.ajax('/restaurant/orders/', {
    method: 'GET'
  })
    .done((data, status, xhr) => {
      if (loaded) {
        console.log(data);
        renderOrder(data);
        clock();
      }
$(".restaurant-login-form").hide();
//Click log in button to dsiplay form
$(".restaurant-login-button").on("click", function() {
    $(".restaurant-login-form").slideToggle("slow", function() {
      //animation complete;
    });
  })

// drag and drop
const fill = document.querySelector(".restaurant-fill");
const empties = document.querySelectorAll(".restaurant-empty");


//loop through empties;
for (const empty of empties) {
  empty.addEventListener('dragover', dragOver);
  empty.addEventListener('dragenter', dragEnter);
  empty.addEventListener('dragleave', dragLeave);
  empty.addEventListener('drop', dragDrop);
}

fill.addEventListener('dragstart', dragStart);
fill.addEventListener('dragend', dragEnd);

//drag function
function dragStart() {
  this.className += ' hold';
  setTimeout(() => {
    this.className = 'invisible'
  }, 0);
}

function dragEnd() {
  this.className = "hold2"

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

function dragDrop() {
  if (this === document.getElementById("restaurant-incoming")) {
    console.log("drop-1");
  } else if (this === document.getElementById("restaurant-in-progress")) {
    console.log("drop-2");
  } else if (this === document.getElementById("restaurant-complete")) {
    $(".restaurant-time-started").text(datetime);
    $(".restaurant-time-status").text("Time Complete");

  }
  loaded = false;
  this.className = "restaurant-empty";
  this.append(fill);
}

// generate dynamic infomation for orders
}).catch(() => {
      console.log('failed');
    });
});

