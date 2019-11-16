$("document").ready(function(){
$(".restaurant-login-form").hide();

// $.ajax('/restaurant/orders/', {
//   method: 'GET'
// })
//   .done((data, status, xhr) => {
//     console.log(data);
//   }).catch(() => {
//     console.log('failed');
//   });

//Click log in button to dsiplay form
$(".restaurant-login-button").on("click", function() {
  console.log("hello")
    $(".restaurant-login-form").slideToggle("slow", function() {
      //animation complete;
    });
  })
});
