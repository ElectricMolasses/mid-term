
$(() => {

  //get login/signup form popup
  $(".user-login").on('click',(() => {
    if ($(".user-login-form").hasClass('visible')) {
      $(".user-login-form").hide().removeClass('visible');
    } else {
      $(".user-login-form").show().addClass('visible');
    }
  })
  );

  $(".user-signup").on('click',(() => {
    if ($(".user-signup-form").hasClass('visible')) {
      $(".user-signup-form").hide().removeClass('visible');
    } else {
      $(".user-signup-form").show().addClass('visible');
    }
  })
  );

  /*POST signin data.
  Login button changed to logged
  Hide Register button
  Show shopping cart and total amount
  logout button
  */

  let $button = $(".user-login-button");
  $button.on('click', (() => {
    event.preventDefault();
    
    $.ajax('/user/login', {
      method: 'POST',
      dataType: "json",
      data: {
        email: $(".user-email").val(),
        password: $(".user-password").val()
      }
    })
      .done((res) => {
        if (res === "Invalid Email") {
          $(".user-error-message").text("Invalid Email/Password");
        } else if (res === "Invalid Password") {
          $(".user-error-message").text("Invalid Email/Password");
        } else {
          $(".user-login-form").hide().removeClass('visible');
          // need add scroll down to menu section
        }
      });
    $.ajax('/user/profile', {
      method: 'GET',
      dataType: "json"
    }).done((data) => {
      $(".user-access").hide().removeClass('visible');
      $(".user-email1").text(data.first_name);
      $(".user-logged").show().addClass('visible');
    });
  }));
});




