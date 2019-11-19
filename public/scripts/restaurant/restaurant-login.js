$(() => {

const $button = $(".restaurant-login-button-submit");
$button.on("click", () => {
  event.preventDefault();

  // currently works without validtion
  // For demo purposes only right now
  $.ajax('/restaurant/login', {
    method: 'POST',
    dataType: "json",
    data: {
      email: $(".restaurant-email").val(),
      password: $(".restaurant-password").val()
    }
  }).done((res) =>  {
    $(".restaurant-login-button-text").text("logged in!")
    $(".restaurant-login-form").hide();
    console.log("sucess");
  }).catch(err => {
    //TODO make sure error message is sent properly
    $(".restaurant-login-button-text").text("Please Enter a valid Email/Password!");
  });
});


});
