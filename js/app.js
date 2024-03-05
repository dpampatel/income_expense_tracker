"use strict";

$(document).ready(function () {
  /* animation for navigation*/
  $("nav").hover(
    function () {
      $(this).stop().animate({ width: "240px" }, 100);
    },
    function () {
      $(this).stop().animate({ width: "80px" }, 100);
    }
  );

  /* Accordion widget is used for infographics section in Home page*/
  $("#infographics").accordion({
    event: "click", // expand collapse on h3 click
    heightStyle: "content", // panel height based on content height
    collapsible: true,
  });
});
