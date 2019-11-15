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
      $.each(data, (index) => {
        console.log('test1', data[index].name);
        $(".user-menu").append("<div>", data[index].name, data[index].cost / 100, "</div>");
      })
    })
  }))

})