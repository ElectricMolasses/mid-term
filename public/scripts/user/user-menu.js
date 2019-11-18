//-------------------------------------------------
//menu display - pull data from database
$(() => {
  $(".user-order-now").on('click', ((event) => {
    event.preventDefault();
  }));  

  $(".user-order-submit").on('click', ((event) => {
    event.preventDefault();
  })); 

  //template for full menu
  const template = `
  <div class="user-menu-table">
    <span class="user-menu-category"></span>
    <span>
        <a class="user-item-name">name</a>
        <a class="user-item-description">description</a>
        <a class="user-item-price">$</a>
        <img class="user-item-add"src="/resources/plus.png">
    </span>
  </div>
  `;

  //get data from GET /menu
  //loop through data and render to table

  $(".user-order-now").on('click', ((event) => {
    // event.preventDefault();
    let category = [];
    $.ajax("user/menu", {
      method: 'GET',
      dataType: "json",
    }).done((data) => {
      $.each(data, (index) => {
        const $temp = $(template);
        let $category = data[index].menu_category
        if (!category.includes($category)) {
          category.push($category);
          
          $temp.find(".user-menu-category"). text($category);
          $temp.find(".user-item-name").text(data[index].name);
          $temp.find(".user-item-description").text(data[index].description);
          $temp.find(".user-item-price").text(data[index].cost);
        } else {
          $temp.find(".user-item-name").text(data[index].name);
          $temp.find(".user-item-description").text(data[index].description);
          $temp.find(".user-item-price").text(data[index].cost);
        }
        
        $(".user-menu").append($temp);
        
      });
      $.each(category, (index) => {
        $(".user-nav-menu").append("<span>",category[index],"</span>");
      })
      orderSum();

    });
  }));



});
