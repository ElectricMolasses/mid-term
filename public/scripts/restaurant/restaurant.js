$("document").ready(function(){
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
console.log(empties);

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
  this.className = "restaurant-empty";
  this.append(fill);
}
});


