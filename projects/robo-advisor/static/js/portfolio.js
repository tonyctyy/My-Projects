// Load portfolio preferences from localStorage
function loadPreferences(){
  const savedData = localStorage.getItem('portfolioPreferences');
  return savedData ? JSON.parse(savedData) : null;
}

// Update the UI fields with stored portfolioPreferences for the new parameters
function loadPortfolioPreferences() {
  const prefs = loadPreferences();
  if (prefs) {
    // Portfolio Parameters section
    if (prefs.rebalance_period !== undefined) {
      let rbSelect = document.getElementById('rebalancePeriod');
      for (let i = 0; i < rbSelect.options.length; i++) {
        if (parseInt(rbSelect.options[i].value) === prefs.rebalance_period) {
          rbSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (prefs.short_w !== undefined) {
      document.getElementById('shortW').value = prefs.short_w;
      document.getElementById('shortW-value').textContent = prefs.short_w;
    }
    if (prefs.long_w !== undefined) {
      document.getElementById('longW').value = prefs.long_w;
      document.getElementById('longW-value').textContent = prefs.long_w;
    }
    if (prefs.total_position !== undefined) {
      document.getElementById('totalPosition').value = prefs.total_position;
      document.getElementById('totalPosition-value').textContent = prefs.total_position;
    }

    // Advanced Options section
    if (prefs.long_short_position !== undefined) {
      document.getElementById('longShortPosition').value = prefs.long_short_position;
      document.getElementById('longShortPosition-value').textContent = prefs.long_short_position;
    }
    if (prefs.turnover_ratio !== undefined) {
      document.getElementById('turnoverRatio').value = prefs.turnover_ratio;
      document.getElementById('turnoverRatio-value').textContent = prefs.turnover_ratio;
    }
    if (prefs.gamma !== undefined) {
      document.getElementById('gamma').value = prefs.gamma;
      document.getElementById('gamma-value').textContent = prefs.gamma;
    }
    if (prefs.risk_tolerance !== undefined) {
      document.getElementById('riskTolerance').value = prefs.risk_tolerance;
      document.getElementById('riskTolerance-value').textContent = prefs.risk_tolerance;
    }
  }
}

// Load assessment data and portfolio preferences on portfolio page load
function loadAssessmentDataToPortfolio() {
  const preferencesData = loadPreferences();
  if (preferencesData) {
    // Update the form with preferences data as soon as the page loads.
    loadPortfolioPreferences();
  } else {
    // If not set, force the user to complete the assessment.
    window.location.href = "/assessment";
  }
}

// Compute portfolios function that merges UI inputs with stored portfolioPreferences
function computePortfolios() {
  // Show loading state
  document.getElementById("loadingIndicator").classList.remove("d-none");
  document.getElementById("plotPlaceholder").classList.remove("d-none");
  document.getElementById("plotImage").classList.add("d-none");
  
  // Get the values from the UI form (new parameters)
  const formParams = {
    rebalancePeriod: parseInt(document.getElementById('rebalancePeriod').value, 10),
    shortW: parseFloat(document.getElementById('shortW').value),
    longW: parseFloat(document.getElementById('longW').value),
    totalPosition: parseFloat(document.getElementById('totalPosition').value),
    longShortPosition: parseFloat(document.getElementById('longShortPosition').value),
    turnoverRatio: parseFloat(document.getElementById('turnoverRatio').value),
    gamma: parseFloat(document.getElementById('gamma').value),
    risk_tolerance: parseFloat(document.getElementById('riskTolerance').value),
  };

  const params = {
    // UI-controllable parameters
    rebalance_period: formParams.rebalancePeriod,
    short_w: formParams.shortW,
    long_w: formParams.longW,
    total_position: formParams.totalPosition,
    long_short_position: formParams.longShortPosition,
    turnover_ratio: formParams.turnoverRatio,
    gamma: formParams.gamma,
    risk_tolerance: formParams.risk_tolerance,
  };

  // Save the updated preferences to localStorage
  localStorage.setItem('portfolioPreferences', JSON.stringify(params));

  // Convert to URL parameters (this can be adjusted to a POST in the future)
  const queryString = new URLSearchParams(params).toString();
  
  // Make fetch call with parameters to compute portfolios
  fetch('/compute_portfolios?' + queryString)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Hide loading state
      document.getElementById("loadingIndicator").classList.add("d-none");

      // Display dynamic portfolio plot if available
      if (data.plot) {
        document.getElementById("plotPlaceholder").classList.add("d-none");
        document.getElementById("plotImage").src = "data:image/png;base64," + data.plot;
        document.getElementById("plotImage").classList.remove("d-none");
      } else {
        document.getElementById("plotImage").alt = "No dynamic portfolio plot available";
      }
      

      // Display evaluation metrics if available
      if (data.evaluation) {
        displayEvaluationTable(data.evaluation);
      }

      // Display weights if available (using tickers and rebalance dates)
      if (data.weights && data.rebalance_date && data.tickers) {
        displayWeightsTable(data.weights, data.tickers, data.rebalance_date);
      }
    })
    .catch(error => {
      // Hide loading state
      console.log(error)
      document.getElementById("loadingIndicator").classList.add("d-none");
      document.getElementById("output").textContent = "Error: " + error.message;
      const errorAlert = document.createElement("div");
      errorAlert.className = "alert alert-danger mt-3";
      errorAlert.innerHTML = `<i class="bi bi-exclamation-triangle"></i> ${error.message}. Please try again later.`;
      document.getElementById("output").insertAdjacentElement("beforebegin", errorAlert);
      setTimeout(() => {
        errorAlert.remove();
      }, 5000);
    });
}

// Initialize custom select dropdowns (if needed)
function initCustomSelects() {
  // This function remains largely the same as your assessment.js version.
  // It initializes any custom select elements.
  const selectElements = document.querySelectorAll('.custom-select, .form-select');
  selectElements.forEach(selectElement => {
    const selectOptions = selectElement.querySelector('select');
    if (!selectOptions && selectElement.tagName === 'SELECT') return;
    if (selectElement.classList.contains('form-select')) return;
    const existingSelectedItem = selectElement.querySelector('.select-selected');
    const existingOptionList = selectElement.querySelector('.select-items');
    if (existingSelectedItem) existingSelectedItem.remove();
    if (existingOptionList) existingOptionList.remove();
    const selectedItem = document.createElement("DIV");
    selectedItem.setAttribute("class", "select-selected");
    selectedItem.innerHTML = selectOptions.options[selectOptions.selectedIndex].innerHTML;
    selectElement.appendChild(selectedItem);
    const optionList = document.createElement("DIV");
    optionList.setAttribute("class", "select-items select-hide");
    for (let j = 0; j < selectOptions.length; j++) {
      const optionItem = document.createElement("DIV");
      optionItem.innerHTML = selectOptions.options[j].innerHTML;
      optionItem.setAttribute("data-value", selectOptions.options[j].value);
      optionItem.addEventListener("click", function() {
        const originalSelect = this.parentNode.parentNode.querySelector("select");
        const selectedDisplay = this.parentNode.previousSibling;
        const optionValue = this.getAttribute("data-value");
        for (let k = 0; k < originalSelect.length; k++) {
          if (originalSelect.options[k].value === optionValue) {
            originalSelect.selectedIndex = k;
            selectedDisplay.innerHTML = this.innerHTML;
            const event = new Event('change', { bubbles: true });
            originalSelect.dispatchEvent(event);
            break;
          }
        }
        this.parentNode.classList.add("select-hide");
        selectedDisplay.classList.remove("select-arrow-active");
      });
      optionList.appendChild(optionItem);
    }
    selectElement.appendChild(optionList);
    selectedItem.addEventListener("click", function(e) {
      e.stopPropagation();
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
      closeAllSelect(this);
    });
  });
}

function closeAllSelect(element) {
  const items = document.getElementsByClassName("select-items");
  const selected = document.getElementsByClassName("select-selected");
  let arrNo = [];
  for (let i = 0; i < selected.length; i++) {
    if (element === selected[i]) {
      arrNo.push(i);
    } else {
      selected[i].classList.remove("select-arrow-active");
    }
  }
  for (let i = 0; i < items.length; i++) {
    if (arrNo.indexOf(i) === -1) {
      items[i].classList.add("select-hide");
    }
  }
}

// Initialize expandable sections
function initExpandableSections() {
  document.querySelectorAll('.expandable-header').forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      content.classList.toggle('active');
      const icon = this.querySelector('i:last-child');
      if (icon) {
        if (content.classList.contains('active')) {
          icon.classList.remove('bi-chevron-down');
          icon.classList.add('bi-chevron-up');
        } else {
          icon.classList.remove('bi-chevron-up');
          icon.classList.add('bi-chevron-down');
        }
      }
    });
  });
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  loadAssessmentDataToPortfolio();
  initExpandableSections();
  initCustomSelects();
  document.addEventListener("click", closeAllSelect);
});

// Function to display evaluation metrics in a table
function displayEvaluationTable(evaluationData) {
    const tableHead = document.getElementById('evaluationTableHead');
    const tableBody = document.getElementById('evaluationTableBody');
    
    // Clear existing table header and body content
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    
    // If no data, show message
    if (!evaluationData || evaluationData.length === 0) {
      const noDataRow = document.createElement('tr');
      const noDataCell = document.createElement('td');
      noDataCell.textContent = 'No evaluation data available';
      noDataCell.colSpan = 2;
      noDataRow.appendChild(noDataCell);
      tableBody.appendChild(noDataRow);
      return;
    }
    
    // Create header row
    const headerRow = document.createElement('tr');
    
    // First header cell is "Metric"
    const headerMetric = document.createElement('th');
    headerMetric.textContent = 'Metric';
    headerMetric.scope = 'col';
    headerRow.appendChild(headerMetric);
    
    // Get portfolio names from first row of data
    const firstRow = evaluationData[0];
    const portfolioNames = Object.keys(firstRow).filter(key => key !== 'metric');
    
    // Add portfolio names as column headers
    portfolioNames.forEach(name => {
      const th = document.createElement('th');
      th.textContent = name;
      th.scope = 'col';
      headerRow.appendChild(th);
    });
    
    tableHead.appendChild(headerRow);
    
    // Add each evaluation row
    evaluationData.forEach(rowData => {
      const row = document.createElement('tr');
      
      // First cell: metric name
      const metricCell = document.createElement('td');
      // If the row has a 'metric' property, use it; otherwise use the first index
      const metricName = rowData.metric || Object.keys(rowData)[0];
      metricCell.textContent = metricName;
      metricCell.style.fontWeight = 'bold';
      row.appendChild(metricCell);
      
      // Cells for each portfolio
      portfolioNames.forEach(portfolio => {
        const valueCell = document.createElement('td');
        const value = rowData[portfolio];
        
        // Format the value based on the metric type
        if (metricName.includes('Return') || metricName.includes('Drawdown')) {
          valueCell.textContent = (value * 100).toFixed(2) + '%';
        } else if (metricName.includes('Volatility')) {
          valueCell.textContent = (value * 100).toFixed(2) + '%';
        } else {
          valueCell.textContent = value.toFixed(4);
        }
        
        // Add color coding for some metrics
        if (metricName.includes('Return') && value > 0) {
          valueCell.style.color = '#4cd964'; // Green for positive returns
        } else if (metricName.includes('Return') && value < 0) {
          valueCell.style.color = '#ff3b30'; // Red for negative returns
        } else if (metricName === 'Sharpe Ratio' && value > 1) {
          valueCell.style.color = '#4cd964'; // Green for a good Sharpe ratio
        } else if (metricName === 'Maximum Drawdown') {
          valueCell.style.color = '#ff9500'; // Orange for drawdowns
        }
        
        row.appendChild(valueCell);
      });
      
      tableBody.appendChild(row);
    });
  }

// Function to display portfolio weights in a table
function displayWeightsTable(weightsData, tickers, rebalanceDates) {
    const tableHead = document.getElementById('weightsTableHead');
    const tableBody = document.getElementById('weightsTableBody');
    
    // Clear existing table header and body content
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    
    // If no data, show message
    if (!weightsData || weightsData.length === 0) {
      const noDataRow = document.createElement('tr');
      noDataRow.innerHTML = '<td colspan="2">No weights data available</td>';
      tableBody.appendChild(noDataRow);
      return;
    }
    
    // Create header row
    const headerRow = document.createElement('tr');
    
    // First header cell for the window/date label
    const thWindow = document.createElement('th');
    thWindow.textContent = 'Rebalance Date';
    thWindow.scope = 'col';
    headerRow.appendChild(thWindow);
    
    // Then add ticker names as column headers
    tickers.forEach(ticker => {
      const th = document.createElement('th');
      th.textContent = ticker;
      th.scope = 'col';
      headerRow.appendChild(th);
    });
    
    // Add the header row to the thead
    tableHead.appendChild(headerRow);
    
    // Show all windows (or limit to a specific count if needed)
    const maxWindowsToShow = Math.min(10, weightsData.length); // Limit to 10 rows for mobile
    
    // Add each rebalancing window as a row
    for (let i = 0; i < maxWindowsToShow; i++) {
      const row = document.createElement('tr');
      
      // Add date/window label as first column
      const windowCell = document.createElement('td');
      // Use rebalance date if available, otherwise fall back to window number
      windowCell.textContent = rebalanceDates && rebalanceDates[i] 
        ? rebalanceDates[i] 
        : `Window ${i+1}`;
      windowCell.style.fontWeight = 'bold';
      row.appendChild(windowCell);
      
      // Add weights for each ticker for the current window
      weightsData[i].forEach(weight => {
        const weightCell = document.createElement('td');
        
        // Handle near-zero values
        const epsilon = 1e-5;
        const displayWeight = (Math.abs(weight) < epsilon ? 0 : weight);
        weightCell.textContent = (displayWeight * 100).toFixed(2) + '%';
        
        // Add color coding for weights
        if (weight > 0.1) {
          weightCell.style.color = '#4cd964'; // Green for high weights
        } else if (weight < -epsilon) {
          weightCell.style.color = '#ff3b30'; // Red for short positions
        }
        
        row.appendChild(weightCell);
      });
      
      tableBody.appendChild(row);
    }
    
    // Add a note if there are more windows than shown
    if (weightsData.length > maxWindowsToShow) {
      const noteRow = document.createElement('tr');
      const noteCell = document.createElement('td');
      noteCell.textContent = `+ ${weightsData.length - maxWindowsToShow} more rebalancing windows`;
      noteCell.colSpan = tickers.length + 1;
      noteCell.style.textAlign = 'center';
      noteCell.style.fontStyle = 'italic';
      noteCell.style.color = 'var(--text-secondary)';
      noteRow.appendChild(noteCell);
      tableBody.appendChild(noteRow);
    }
  }