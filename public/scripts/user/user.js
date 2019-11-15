//get login/register form popup
$(() => {
  $(".user-login").on('click',(() => {
    if ($(".user-login-form").hasClass('visible')) {
      $(".user-login-form").hide().removeClass('visible');
    } else {
      $(".user-login-form").show().addClass('visible');
    }
  })
  );
});

$(() => {
  $(".user-signup").on('click',(() => {
    if ($(".user-signup-form").hasClass('visible')) {
      $(".user-signup-form").hide().removeClass('visible');
    } else {
      $(".user-signup-form").show().addClass('visible');
    }
  })
  );
});

/*POST signin data.
Login button changed to logged
Hide Register button
Show shopping cart and total amount
*/

$(() => {
 $button = $(".user-login-form button").on('click', (() => {
  const userInfo = {
    email: $(".user-email").val(), //need store email in database
    password: $(".user-password").val()
  }

  //need to check data with our database

    //false - pop up message
  if (2) {
    console.log('error')
  } else {   // true
    $("user-login-form").hide().removeClass('visible');
    $("user-login").hide().removeClass('visible');
    $("user-signup").hide().removeClass('visible');
  }



 })
 );
});
//scroll down/unhide to nav and full menu


//user-nav-menu - click categories to scroll to specific table in full menu


//user-

