
$(() => {

  //LOGIN BUTTON: get login form popup
  $(".user-login").on('click',(() => {
    if ($(".user-login-form").hasClass('visible')) {
      $(".user-login-form").hide().removeClass('visible');
      
    } else {
      $(".user-login-form").show().addClass('visible');
      $(".user-signup-form").hide().removeClass('visible');
    }
  })
  );

  //SIGNUP BUTTON: get signup form popup
  $(".user-signup").on('click',(() => {
    if ($(".user-signup-form").hasClass('visible')) {
      $(".user-signup-form").hide().removeClass('visible');
    } else {
      $(".user-login-form").hide().removeClass('visible');
      $(".user-signup-form").show().addClass('visible');
    }
  })
  );
  //CANCEL BUTTON: close the form
  $(".user-close-form").on('click',(() => {
    if ($(".user-login-form").hasClass('visible')) {
      $(".user-login-form").hide().removeClass('visible');
    } else {
      $(".user-login-form").show().addClass('visible');
    }
  })
  );
  $(".user-close-form1").on('click',(() => {
    if ($(".user-signup-form").hasClass('visible')) {
      $(".user-signup-form").hide().removeClass('visible');
    } else {
      $(".user-signup-form").show().addClass('visible');
    }
  })
  );

  
  //LOGOUT BUTTON: stretch work

  //SHOPPING CART: Order Summary Popup

  $(".user-logged img").on('click',(() => {
    if ($(".user-order").hasClass('visible')) {
      $(".user-order").hide().removeClass('visible');
    } else {
      $(".user-order").show().addClass('visible');
    }
  })
  );


  /*POST signin data.
  Login button changed to logged - DONE
  Hide Register button - DONE
  Show shopping cart and total amount
  logout button - DONE
  */

  let $button = $(".user-login-button");
  $button.on('click', ((event) => {
    event.preventDefault();

    $.ajax('/user/login', {
      method: 'POST',
      dataType: "json",
      data: {
        email: $(".user-email").val(),
        password: $(".user-password").val()
      }
    }).done((res) => {
        if (res === "Invalid Email") {
          $(".user-error-message").text("Invalid Email/Password");
        } else if (res === "Invalid Password") {
          $(".user-error-message").text("Invalid Email/Password");
        } else {
          $(".user-login-form").hide().removeClass('visible');
          $(".user-order-now").trigger('click'); // menu section pop up once click login
        }
        
      }).then (() => {
        $.ajax('/user/profile', {
          method: 'GET',
          dataType: "json"
        }).done((data) => {
          $(".user-access").hide().removeClass('visible');
          $(".user-email1").text(data.first_name);
          $(".user-logged").show().addClass('visible');
        });
      })

  }));
});




