//helpers function
//remove or add quantity

// const updateQuantity = function(data) {

// };


// //update price for each item

// const updatePrice = function(data) {

// };



$(() => {
  //Add Button -> change quantity order
  //Order quantity, name, price shown in shopping cart
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
    </table>
    `;

    // $(".user-item-add").on('click', ((event) => {
      
    //   event.preventDefault();
    //   console.log($('user-item-name'));
    //   console.log('hello');
    //   const $temp = $(template);
    //   $temp.find(".user-order-name").text("hello");
    //   $temp.find(".user-order-quantity").text("there");
    //   $temp.find(".user-order-price").text("$2");
    //   $(".user-order").append($temp);
      
    // }))
  }
})  

