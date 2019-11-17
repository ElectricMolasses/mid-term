$(() => {

const $button = $(".restaurant-login-button-submit");
$button.on("click", () => {
  event.preventDefault();

  $.ajax('/restaurant/login', {
    method: 'POST',
    dataType: "json",
    data: {
      email: $(".restaurant-email").val(),
      password: $(".restaurant-password").val()
    }
  }).done((res) => {
    $(".restaurant-login-button-text").text("");
  });
});


});
