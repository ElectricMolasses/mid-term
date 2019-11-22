
$(() => {

  //show total saved in localstorage
  const total = localStorage.getItem('cartTotal');
  const item = localStorage.getItem('cartItems');

  $(".item-total").text(item);
  $(".total").text(total);
  $(".user-logout").hide();

  let loggedIn = false; //check login to switch login/logout
  //get "/" when user cookie exists

  $.ajax('/user/profile', {
    method: 'GET',
    dataType: "json"
  }).done((data) => {

    $(".user-access").hide().removeClass('visible');
    $(".user-email1").text(data.first_name);
    $(".user-logged").show().addClass('visible');
  });


  //toggle nav bar for logout button

  $(".menu-nav-icon").on('click', () => {
    $(".user-logout").slideToggle("slow"), () => {
      $(".user-logout").show();
    }
  })


  //LOGIN BUTTON: get login form popup

  $(".user-login").on('click', ((event) => {
    event.preventDefault();
    if (loggedIn) {
      localStorage.clear();
      loggedIn = false;   //switch to login feature on user-menu-navbar
      $.ajax('/user/logout', {
        method: 'POST',
        dataType: "json",
      }).done((res) => {
        // loggedIn = false;   //switch to login feature on user-menu-navbar
      });
      $(".user-email1").empty();
    } else {
      if ($(".user-login-form").hasClass('visible')) {
        $(".user-login-form").hide().removeClass('visible');
      } else {
        $(".user-login-form").show().addClass('visible');
      }
    }
  }));
  //SIGNUP BUTTON: get signup form popup
  // $(".user-signup").on('click', (() => {
  //   if ($(".user-signup-form").hasClass('visible')) {
  //     $(".user-signup-form").hide().removeClass('visible');
  //   } else {
  //     $(".user-login-form").hide().removeClass('visible');
  //     $(".user-signup-form").show().addClass('visible');
  //   }
  // })
  // );

  //CLOSE BUTTON

  $("body").on('click', ".user-close-form", () => {
    let $this = $(".user-close-form");
    if ($this.closest("div").hasClass('visible')) {
      $this.closest("div").hide().removeClass('visible');
      blurOff();
    } else {
      $this.closest("div").show().addClass('visible');
    }
  });

  //SHOPPING CART: Order Summary Popup

  $(".order-cart-icon").on('click', ((event) => {
    if ($(".user-order").hasClass('visible')) {
      $(".user-order").hide().removeClass('visible');
    } else {
      $(".user-order").show().addClass('visible');
      $(".user-order1").show().addClass('visible');
      blurOn();
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
      },
    }).done((res) => {
      if (res["success"] === "Logged in") {
        $(".user-login-form").hide().removeClass('visible');
        loggedIn = true; // switch to logout feature on user-menu-navbar
      } else {
        alert("Your email/password is wrong. Please try again!");
      }
    }).then(() => {
      $.ajax('/user/profile', {
        method: 'GET',
        dataType: "json"
      }).done((data) => {
        $(".user-access").hide().removeClass('visible');
        $(".user-email1").text(data.first_name);
        $(".user-logged").show().addClass('visible');
      });
    });
  }));



  document.querySelectorAll(".user-nav-menu > span")
    .forEach((element) => {
      console.log(element);
    });
});




