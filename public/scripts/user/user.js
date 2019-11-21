
$(() => {

  //show total saved in localstorage
  const total = localStorage.getItem('cartTotal');
  const item = localStorage.getItem('cartItems');

  $(".item-total").text(item);
  $(".total").text(total);

  //get "/" when user cookie exists

  $.ajax('/user/profile', {
    method: 'GET',
    dataType: "json"
  }).done((data) => {
    $(".user-access").hide().removeClass('visible');
    $(".user-email1").text(data.first_name);
    $(".user-logged").show().addClass('visible');
  });


  //LOGIN BUTTON: get login form popup
  $(".user-login").on('click', (() => {
    if ($(".user-login-form").hasClass('visible')) {
      $(".user-login-form").hide().removeClass('visible');
      $(".user-login").hide().removeClass('visible');
      $(".user-logged").show().addClass('visible');
    } else {
      $(".user-login-form").show().addClass('visible');
      $(".user-signup-form").hide().removeClass('visible');
    }
  })
  );

  //SIGNUP BUTTON: get signup form popup
  $(".user-signup").on('click', (() => {
    if ($(".user-signup-form").hasClass('visible')) {
      $(".user-signup-form").hide().removeClass('visible');
    } else {
      $(".user-login-form").hide().removeClass('visible');
      $(".user-signup-form").show().addClass('visible');
    }
  })
  );

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


  //LOGOUT: logout, clear all localStorage (total, item, cart)

  $(".user-logout").on('click', (() => {
    localStorage.clear();
    $.ajax('/user/logout', {
      method: 'POST',
      dataType: "json",
    }).done((res) => {
      console.log(res);
    });
  }));


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
        // $(".user-order-now").trigger('click'); // menu section pop up once click login
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

  const anchorOffset = function() {
    document.querySelectorAll(".user-nav-menu")
      .forEach((element) => {
        console.log(element);
      });
  };

  const blurOn = function() {
    const elements = document.querySelectorAll("body > *");

    for (let element of elements) {
      element.className += " blurred";
      //element.style.filter = "blur(1px)";
    }

    let noBlur = document.getElementsByClassName('noblur');

    for (const element of noBlur) {
      recursiveBlurOff(element);
    }
  };

  const recursiveBlurOff = function(element) {
    element.classList.remove("blurred");
    //element.style.filter = "blur(0px)";

    for (const child of element.children) {
      recursiveBlurOff(child);
    }
  };

  const blurOff = function() {
    const elements = document.getElementsByTagName("*");

    for (let element of elements) {
      element.style.filter = '';
    }
  };

  document.querySelector(".user-close-form")
    .addEventListener("click", (event) => {
      document.querySelector(".user-order")
        .style.display = "none";
        recursiveBlurOff(document.querySelector("HTML"));
    });


});




