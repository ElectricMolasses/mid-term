//menu display - pull data from database
$(() => {

//get data from GET /menu
//loop through data and render to span??
  $(".user-order-now").on('click', (() => {
    event.preventDefault();
    
    $.ajax("user/menu", {
      method: 'GET',
      dataType: "json",
    }).done((data) => {
      console.log('test', data[0].name);
      $.each(data, (index) => {
        console.log('test1', data[index].name);
      })
    })
  }))

})