"use strict";
const g_error = "Something went wrong. Please contact system administrator.";
let g_budgetData = [];
const v_options = {
  mode: "vega-lite",
  actions: false,
};
// Define a function to add a new row to the budget history table
function addTableRow(
  month,
  income,
  rentMortgage,
  utilities,
  groceries,
  transportation,
  entertainment,
  savings,
  totalExpenses,
  totalSavings
) {
  try {
    // Create a new row element
    let newRow = $("<tr>");

    // Add cells to the row with the data for each column
    let monthCell = $("<td>").text(month);
    let incomeCell = $("<td>").text(income);
    let rentMortgageCell = $("<td>").text(rentMortgage);
    let utilitiesCell = $("<td>").text(utilities);
    let groceriesCell = $("<td>").text(groceries);
    let transportationCell = $("<td>").text(transportation);
    let entertainmentCell = $("<td>").text(entertainment);
    let savingsCell = $("<td>").text(savings);
    let totalExpensesCell = $("<td>").text(totalExpenses);
    let totalSavingsCell = $("<td>").text(totalSavings);

    // Append the cells to the row
    newRow.append(
      monthCell,
      incomeCell,
      rentMortgageCell,
      utilitiesCell,
      groceriesCell,
      transportationCell,
      entertainmentCell,
      savingsCell,
      totalExpensesCell,
      totalSavingsCell
    );

    // Append the row to the budget history table
    $("#budget-history-body").append(newRow);
  } catch (error) {
    alert(g_error);
  }
}
function calculateBudget() {
  try {
    // Get the values of all the input fields
    let year = parseInt($("#budget-year").val());
    let month = $("#budget-month").val();
    let income = parseFloat($('input[name="budget-income"]').val()) || 0;
    let rentMortgage =
      parseFloat($('input[name="budget-rent-mortgage"]').val()) || 0;
    let utilities = parseFloat($('input[name="budget-utilities"]').val()) || 0;
    let groceries = parseFloat($('input[name="budget-groceries"]').val()) || 0;
    let transportation =
      parseFloat($('input[name="budget-transportation"]').val()) || 0;
    let entertainment =
      parseFloat($('input[name="budget-entertainment"]').val()) || 0;
    let savings = parseFloat($('input[name="budget-savings"]').val()) || 0;

    // Calculate the total expenses and total savings
    let totalExpenses =
      rentMortgage + utilities + groceries + transportation + entertainment;
    let totalSavings = income - totalExpenses - savings;

    // Update the DOM with the results
    $("#budget-total").text("$" + totalExpenses.toFixed(2));
    $("#budget-savings").text("$" + totalSavings.toFixed(2));
    // Add a new row to the budget history table with the current month's data
    let l_budgetData = {
      date: month + " " + year,
      income,
      rentMortgage,
      utilities,
      groceries,
      transportation,
      entertainment,
      savings,
      totalExpenses,
      totalSavings,
    };
    g_budgetData.push(l_budgetData);
    addTableRow(...Object.values(l_budgetData));
    let l_expense_data = [
      { Category: "Rent / Mortgage", value: rentMortgage },
      { Category: "Utilities", value: utilities },
      { Category: "Groceries", value: groceries },
      { Category: "Transportation", value: transportation },
      { Category: "Entertainment", value: entertainment },
    ];
    vegaEmbed("#expense-chart", expenseChartConfig(l_expense_data), v_options);
  } catch (error) {
    alert(g_error);
  }
}
function calculateSavingsNeed(p_change) {
  try {
    let savingsGoal, currentSavings;
    let savingsGoalInput = $('input[name="savings-goal"]');
    let currentSavingsInput = $('input[name="savings-amount"]');

    if (!p_change && localStorage.getItem("savings-goals")) {
      // Get the values of the savings goal and current savings local storage
      savingsGoal = localStorage.getItem("savings-goals");
      currentSavings = localStorage.getItem("current-savings");
      savingsGoalInput.val(savingsGoal);
      currentSavingsInput.val(currentSavings);
    } else {
      // Get the values of the savings goal and current savings input fields
      savingsGoalInput.val() || savingsGoalInput.val(1000);
      currentSavingsInput.val() || currentSavingsInput.val(457);
      savingsGoal = parseFloat(savingsGoalInput.val());
      currentSavings = parseFloat(currentSavingsInput.val());
      localStorage.setItem("savings-goals", savingsGoal);
      localStorage.setItem("current-savings", currentSavings);
    }
    // Check if the input values are valid
    let errors = [];
    if (isNaN(savingsGoal) || savingsGoal < 0) {
      errors.push("Please enter a valid savings goal.");
    }
    if (isNaN(currentSavings) || currentSavings < 0) {
      errors.push("Please enter a valid current savings amount.");
    }

    // Display error messages on the page if there are any errors
    let errorContainer = $("#savings-need");
    errorContainer.empty();
    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        let errorMessage = $("<p>").text(errors[i]);
        errorContainer.append(errorMessage);
        $(errorContainer).addClass("cls-error");
      }
      return;
    }

    // Calculate the savings need
    let savingsNeed = savingsGoal - currentSavings;

    // Update the DOM with the result
    $(errorContainer).removeClass("cls-error");
    $("#savings-need").text("$" + savingsNeed.toFixed(2));
    vegaEmbed(
      "#savings-chart",
      savingsChartConfig(savingsGoal, currentSavings),
      v_options
    );
  } catch (error) {
    alert(g_error);
  }
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

  $("#budget-form").submit(function (event) {
    event.preventDefault();
    calculateBudget();
  });
  $("#budget-btn").click(function () {
    calculateBudget();
  });
  $("#savings-btn").click(function () {
    calculateSavingsNeed(true);
  });

  calculateSavingsNeed();
  calculateBudget();
});

/* Functions for plugin configurations */
const savingsChartConfig = (p_goal, p_current) => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "Achievement",
    data: {
      values: [{ goal: p_goal, current: p_current }],
    },
    transform: [
      {
        calculate:
          "datum.goal ==0 ? 0 : datum.current/datum.goal > 0? datum.current/datum.goal : 0",
        as: "percent",
      },
    ],
    layer: [
      {
        mark: { type: "arc" },
        encoding: {
          theta: {
            field: "percent",
            type: "quantitative",
            scale: { domain: [0, 1] },
          },
          color: { value: "#E55655" },
        },
      },
      {
        mark: {
          type: "text",
          fontSize: 20,
          align: "center",
          dy: 100,
          dx: 100,
        },
        encoding: {
          text: { field: "percent", type: "quantitative", format: ".2%" },
        },
      },
    ],
  };
};
const expenseChartConfig = (p_data) => {
  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "Expense",
    data: {
      values: p_data,
    },
    layer: [
      {
        params: [
          {
            name: "Categoryy",
            select: { type: "point", fields: ["Category"] },
            bind: "legend",
          },
        ],
        mark: { type: "arc", innerRadius: 20, stroke: "#fff", align: "center" },
        encoding: {
          tooltip: { field: "value", format: "$.0f" },
        },
      },
    ],
    encoding: {
      theta: { field: "value", type: "quantitative", stack: true },
      radius: {
        field: "value",
        scale: { type: "sqrt", zero: true, rangeMin: 20 },
      },
      color: {
        field: "Category",
        type: "nominal",

        legend: {
          title: "Select Category",
          titleFontSize: 13,
          labelFontSize: 12,
        },
      },

      opacity: {
        condition: { param: "Categoryy", value: 1 },
        value: 0.2,
      },
    },
  };
};
