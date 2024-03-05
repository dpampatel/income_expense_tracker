"use strict";

let g_barIncomeData = [];
let g_barExpenseData = [];

const loadMask = {
  element: document.getElementById("loadingMask"),

  showLoadingMask: function () {
    this.element.style.display = "block";
  },
  hideLoadingMask: function () {
    this.element.style.display = "none";
  },
};

const v_options = {
  mode: "vega-lite",
  actions: false,
};
// Define a function to add a new row to the budget history table
function addTableRowHistory(i_amt, i_cat, i_mon, i_his, p_obj) {
  let amount = parseFloat($(`input[name="${i_amt}"]`).val()) || 0;
  let category = $(`#${i_cat}`).val();
  let month = $(`#${i_mon}`).val();

  let l_object = {};
  l_object.amount = amount;
  l_object.category = category;
  l_object.month = month;
  p_obj.push(l_object);

  appendTableRow(i_his, amount, category, month);
}
function appendTableRow(i_his, amount, category, month) {
  // Create a new row element
  let newRow = $("<tr>");

  // Add cells to the row with the data for each column
  let amountCell = $("<td>").text(amount);
  let categoryCell = $("<td>").text(category);
  let monthCell = $("<td>").text(month);

  // Append the cells to the row
  newRow.append(monthCell, categoryCell, amountCell);
  // Append the row to the budget history table
  $(`#${i_his}`).append(newRow);
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

  loadMask.showLoadingMask();

  // Call the first fetch API
  fetch("https://64dfbe1d71c3335b25830374.mockapi.io/income")
    .then((response) => response.json())
    .then((data) => {
      // Process the fetched data from API 1
      g_barIncomeData = data;
      // Call the second fetch API
      return fetch("https://64dfbe1d71c3335b25830374.mockapi.io/expense");
    })
    .then((response) => response.json())
    .then((data) => {
      g_barExpenseData = data;
      loadMask.hideLoadingMask(); // Hide the loading mask once both APIs are fetched
    })
    .then(() => {
      g_barIncomeData.forEach(function (obj) {
        appendTableRow(
          "budget-history-body",
          obj.amount,
          obj.category,
          obj.month
        );
      });
      vegaEmbed(
        "#income-chart-bar",
        barChartConfig("Income", g_barIncomeData),
        v_options
      );
      g_barExpenseData.forEach(function (obj) {
        appendTableRow(
          "budget-history-body1",
          obj.amount,
          obj.category,
          obj.month
        );
      });
      vegaEmbed(
        "#expense-chart-bar",
        barChartConfig("Expense", g_barExpenseData),
        v_options
      );
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      loadMask.hideLoadingMask(); // Hide the loading mask in case of error
    });

  $("#budget-btn").click(function () {
    addTableRowHistory(
      "budget-amount",
      "budget-category",
      "budget-month",
      "budget-history-body",
      g_barIncomeData
    );
    vegaEmbed(
      "#income-chart-bar",
      barChartConfig("Income", g_barIncomeData),
      v_options
    );
  });
  $("#budget-btn1").click(function () {
    addTableRowHistory(
      "budget-amount1",
      "budget-category1",
      "budget-month1",
      "budget-history-body1",
      g_barExpenseData
    );
    vegaEmbed(
      "#expense-chart-bar",
      barChartConfig("Expense", g_barExpenseData),
      v_options
    );
  });
});

/* Functions for plugin configurations */
const barChartConfig = (p_text, p_data) => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    config: {
      view: { stroke: "transparent" },
      axis: {
        grid: false,
        domainWidth: 1,
        tickSize: 10,
        tickWidth: 1,
        labelFontSize: 14,
        titleFontSize: 16,
      },
    },
    width: 450,
    data: { values: JSON.parse(JSON.stringify(p_data)) },
    mark: "bar",
    encoding: {
      x: {
        field: "month",
        type: "nominal",
        axis: { title: "Month" },
        sort: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        scale: {
          domain: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          paddingOuter: 1,
          padding: 0.2,
        },
      },
      y: {
        aggregate: "sum",
        field: "amount",
        type: "quantitative",
        axis: { title: p_text },
        sort: ["amount"],
      },
      color: {
        field: "category",
        type: "nominal",
        scale: {
          range: ["#fdb462", "#b3de69", "#80b1d3", "#fb8072", "#bebada"],
        },
      },
    },
  };
};
