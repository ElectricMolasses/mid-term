$("document").ready(function(){
$(".restaurant-login-form").hide();

//Click log in button to dsiplay form
$(".restaurant-login-button").on("click", function() {
  console.log("hello")
    $(".restaurant-login-form").slideToggle("slow", function() {
      //animation complete;
    });
  })
});


