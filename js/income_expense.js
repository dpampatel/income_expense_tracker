"use strict";

const loadMask = (function () {
  //IIFE
  //private
  const element = document.getElementById("loadingMask");

  return {
    //public
    showLoadingMask: function () {
      element.style.display = "block";
    },
    hideLoadingMask: function () {
      element.style.display = "none";
    },
  };
})();

// Define a function to add a new record
function addTableRowHistory(i_amt, i_cat, i_mon, p_operation) {
  let amount = parseFloat($(`input[name="${i_amt}"]`).val()) || 0;
  let category = $(`#${i_cat}`).val();
  let month = $(`#${i_mon}`).val();

  let newRecord = {};
  newRecord.amount = amount;
  newRecord.category = category;
  newRecord.month = month;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRecord),
  };

  fetch(
    "https://64dfbe1d71c3335b25830374.mockapi.io/" + p_operation,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(p_operation + "-msg").innerHTML =
        "Success! Please go to History & Analysis!";
      loadMask.hideLoadingMask();
    })
    .catch((error) => {
      console.error("Error adding new record:", error);
      document.getElementById(p_operation + "-msg").innerHTML = "Failure!";
      loadMask.hideLoadingMask();
    });
}

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

  $("#budget-btn").click(function () {
    loadMask.showLoadingMask();
    addTableRowHistory(
      "budget-amount",
      "budget-category",
      "budget-month",
      "income"
    );
  });
  $("#budget-btn1").click(function () {
    loadMask.showLoadingMask();
    addTableRowHistory(
      "budget-amount1",
      "budget-category1",
      "budget-month1",
      "expense"
    );
  });
});
