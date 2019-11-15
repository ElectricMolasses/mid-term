

//Add items to order cart

const orderSum = () => {
  const template = `
  <table class="user-order1">
    <tr>
      <td class="user-order-name"></td>
      <td class="user-order-quantity"></a>
      <td class="user-order-price"></td>
      <td>
        <button class="user-item-add" type="button"><img src="/resources/plus-circle.png"></button>
      </td>

    </tr>
    <tr class="user-order-subtotal"></tr>
    <tr class="user-order-tax"></tr>
    <tr class="user-order-total"></tr>
  </table>
  `;
  let subTotal = 0;
  const tax = 0.05;
  $(".user-item-add").on('click', function(event) {
    
    event.preventDefault();
    
    const $temp = $(template);
    var $foodName = $(this).closest('tr').find(".user-item-name").text();
    var $foodPrice = $(this).closest('tr').find(".user-item-price").text() / 100;
    
    $temp.find(".user-order-name").append($foodName);
    $temp.find(".user-order-quantity").append("1");
    $temp.find(".user-order-price").append($foodPrice);
    //sum order

    subTotal += ($foodPrice);
    taxTotal = (subTotal * tax);
    taxTotal.toFixed(2);
    $temp.find(".user-order-subtotal").append('Subtotal: ', subTotal);
    $(".user-order").append($temp);

  })

}


//-------------------------------------------------
//menu display - pull data from database
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
        <button class="user-item-add" type="button"><img src="/resources/plus-circle.png"></button>
      </td>
    </tr>
  </table>
  `;

//get data from GET /menu
//loop through data and render to table

  $(".user-order-now").on('click', ((event) => {
    event.preventDefault();
    $.ajax("user/menu", {
      method: 'GET',
      dataType: "json",
    }).done((data) => {
      $.each(data, (index) => {
        const $temp = $(template);
        $temp.find(".user-item-name").text(data[index].name);
        $temp.find(".user-item-description").text(data[index].description);
        $temp.find(".user-item-price").text(data[index].cost);
        $(".user-menu").append($temp);
      })
      orderSum();
    })  
  }))
  

})
