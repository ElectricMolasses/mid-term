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


  /*POST signin data. 
  Login button changed to logged
  Hide Register button
  Show shopping cart and total amount
  */

  //scroll down/unhide to nav and full menu 


  //user-nav-menu - click categories to scroll to specific table in full menu


  //user-

