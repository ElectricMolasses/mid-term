//menu display - pull data from database




//-------------------------------------------------
$(() => {

  //template for menu
  const template = `
  <table class="user-menu-table">
    <tr>
      <td>
        <a class="user-item-name">name</a>
        <a class="user-item-description">description</a>
      </td>
      <td class="user-item-price">$</td>
      <td>
        <input class="user-item-add" type="submit"><img scr="/resources/plus-circle.png"></input>
      </td>
    </tr>
  </table>
  `;

//get data from GET /menu
//loop through data and render to span??

  $(".user-order-now").on('click', (() => {
    event.preventDefault();
    
    
    $.ajax("user/menu", {
      method: 'GET',
      dataType: "json",
    }).done((data) => {
      
      $.each(data, (index) => {
        const $temp = $(template);
        console.log('test1', index, data[index].name);
        $temp.find(".user-item-name").text(data[index].name);
        $temp.find(".user-item-description").text(data[index].description);
        $temp.find(".user-item-price").text(data[index].cost);
        $(".user-menu").append($temp);
      })
      
    })
  }))

})
