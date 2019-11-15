
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
        email: $(".user-email").val(), //need store email in database
        password: $(".user-password").val()
      }

    })
      .done((res) => {
        console.log('1',res);
        if (res === "Invalid Email") {
          $(".user-error-message").text("Invalid Email/Password");
        } else if (res === "Invalid Password") {
          $(".user-error-message").text("Invalid Email/Password");
        } else {
          console.log('here');
          $(".user-login-form").hide().removeClass('visible');
          $(".user-access").hide().removeClass('visible');
          $(".user-logged").show().addClass('visible');
          // need add scroll down to menu section
        }
    })


    // $.get('/login')

    $.ajax('/user/profile', {
      method: 'GET',
      dataType: "json",

    })
  }));
  //need to check data with our database

    //false - pop up message
//   if (2) {
//     console.log('error')
//   } else {   // true
//     $("user-login-form").hide().removeClass('visible');
//     $("user-login").hide().removeClass('visible');
//     $("user-signup").hide().removeClass('visible');
//     //unhide logged info and shopping cart
//   }
//  })
//  );


});


//scroll down/unhide to nav and full menu


//user-nav-menu - click categories to scroll to specific table in full menu


//user-

