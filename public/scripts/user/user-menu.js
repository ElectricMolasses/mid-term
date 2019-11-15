//menu display - pull data from database
<template class="user-menu">
  <table>
    <tr>
      <td>
        <a>name</a>
        <a>description</a>
      </td>
      <td>price</td>
      <td>
        <input class="user-item-add" type="submit" scr="/resources/plus-circle.png"></input>
      </td>
    </tr>
  </table>
</template>

//-------------------------------------------------
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
        $(".user-menu").append(
        );
      })
    })
  }))

})
