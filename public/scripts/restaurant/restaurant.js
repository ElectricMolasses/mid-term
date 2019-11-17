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
  <p></p>
  <span class="restaurant-customer-id">${i.customer}</span>
</div>
<div class="restaurant-time-display">
  <p>Time Placed</p>
  <span class="restaurant-time-started">${i.time_placed}</span>
</div>
<div class="restaurant-menu-items">
  <p>Menu Items<p>
  <ul>
    ${generateLi(i.order_item)}
  </ul>
</div>
<div class="restaurant-phonenumber">
  <p>phone Number</p>
  <span class="restaurant-phone">${i.phone_number}</span>
</div>
</div>`;
return markup;
}


$("document").ready(function(){
  let loaded = true;
  $.ajax('/restaurant/orders/', {
    method: 'GET'
  })
    .done((data, status, xhr) => {
      if (loaded) {
        renderOrder(data);
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
  this.className = "restaurant-fill";
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
  loaded = false;
  this.className = "restaurant-empty";
  this.append(fill);
}

// generate dynamic infomation for orders
}).catch(() => {
      console.log('failed');
    });
});

