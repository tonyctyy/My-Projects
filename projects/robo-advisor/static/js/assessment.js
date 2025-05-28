// Handle steps navigation
function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.assessment-step').forEach(step => {
      step.style.display = 'none';
    });
    
    // Show current step
    document.getElementById(`step${stepNumber}`).style.display = 'block';
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
      if (index + 1 < stepNumber) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (index + 1 === stepNumber) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  }
  
  // Handle range sliders
  function initRangeSliders() {
    document.querySelectorAll('.range-slider input[type="range"]').forEach(slider => {
      const valueDisplay = document.getElementById(`${slider.id}-value`);
      
      // Initialize with current value
      if (valueDisplay) {
        valueDisplay.textContent = slider.value;
      }
      
      // Update when changed
      slider.addEventListener('input', function() {
        if (valueDisplay) {
          valueDisplay.textContent = this.value;
        }
      });
    });
  }
  
  // Custom Select Dropdown - Fixed Version
  function initCustomSelects() {
    // Get all custom select elements
    const selectElements = document.querySelectorAll('.custom-select');
    
    selectElements.forEach(selectElement => {
      const selectOptions = selectElement.querySelector('select');
      if (!selectOptions) return;
      
      // Clear any existing custom elements first (to prevent duplicates)
      const existingSelectedItem = selectElement.querySelector('.select-selected');
      const existingOptionList = selectElement.querySelector('.select-items');
      
      if (existingSelectedItem) existingSelectedItem.remove();
      if (existingOptionList) existingOptionList.remove();
      
      // Create a new DIV to act as the selected item
      const selectedItem = document.createElement("DIV");
      selectedItem.setAttribute("class", "select-selected");
      selectedItem.innerHTML = selectOptions.options[selectOptions.selectedIndex].innerHTML;
      selectElement.appendChild(selectedItem);
      
      // Create a new DIV for the option list
      const optionList = document.createElement("DIV");
      optionList.setAttribute("class", "select-items select-hide");
      
      // Add options to the new DIV
      for (let j = 0; j < selectOptions.length; j++) {
        const optionItem = document.createElement("DIV");
        optionItem.innerHTML = selectOptions.options[j].innerHTML;
        optionItem.setAttribute("data-value", selectOptions.options[j].value);
        
        // When an item is clicked, update the original select box and the selected item
        optionItem.addEventListener("click", function() {
          const originalSelect = this.parentNode.parentNode.querySelector("select");
          const selectedDisplay = this.parentNode.previousSibling;
          const optionValue = this.getAttribute("data-value");
          
          for (let k = 0; k < originalSelect.length; k++) {
            if (originalSelect.options[k].value === optionValue) {
              originalSelect.selectedIndex = k;
              selectedDisplay.innerHTML = this.innerHTML;
              
              // Trigger change event
              const event = new Event('change', { bubbles: true });
              originalSelect.dispatchEvent(event);
              break;
            }
          }
          
          // Hide the option list after selection
          this.parentNode.classList.add("select-hide");
          selectedDisplay.classList.remove("select-arrow-active");
        });
        
        optionList.appendChild(optionItem);
      }
      
      selectElement.appendChild(optionList);
      
      // When the selected item is clicked, toggle showing the options
      selectedItem.addEventListener("click", function(e) {
        e.stopPropagation();
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
        
        // Close all other select boxes
        closeAllSelect(this);
      });
    });
  }
  
  // Close all select boxes except the current one
  function closeAllSelect(element) {
    const items = document.getElementsByClassName("select-items");
    const selected = document.getElementsByClassName("select-selected");
    let arrNo = [];
    
    // Get the index of current element if it's a selected item
    for (let i = 0; i < selected.length; i++) {
      if (element === selected[i]) {
        arrNo.push(i);
      } else {
        selected[i].classList.remove("select-arrow-active");
      }
    }
    
    // Hide all items except the one at the current index
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
        
        // Update icon
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
  
  // Store assessment data to localStorage
  function saveAssessment(data) {
    const portfolioPreferences = initializePreferences(data);
    localStorage.setItem('portfolioPreferences', JSON.stringify(portfolioPreferences))
    localStorage.setItem('portfolioAssessment', JSON.stringify(data));
  }
  
  // Load assessment data from localStorage
  function loadAssessment() {
    const savedData = localStorage.getItem('portfolioAssessment');
    return savedData ? JSON.parse(savedData) : null;
  }
  
  // Initialize form with saved data if available
  function initAssessmentForm() {
    const savedData = loadAssessment();
    
    if (savedData) {
      // Populate form fields with saved data
      Object.keys(savedData).forEach(key => {
        let element = document.getElementById(key);
        // If not found, try to get one by name (this works for radio groups).
        if (!element) {
            element = document.querySelector(`input[name="${key}"]`);
        }
        if (element) {
          if (element.type === 'range' || element.type === 'select-one') {
            element.value = savedData[key];
            
            // Trigger change event for custom elements
            const event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);
            // Update the custom displayed value if it exists
            const customDisplay = element.parentElement.querySelector('.select-selected');
            if (customDisplay) {
                customDisplay.innerHTML = element.options[element.selectedIndex].innerHTML;
            }
            
          } else if (element.type === 'radio') {
            document.querySelector(`input[name="${element.name}"][value="${savedData[key]}"]`).checked = true;
          }
        }
      });
    }
  }
  
  // When DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initAssessmentForm();
    initRangeSliders();
    initCustomSelects();
    initExpandableSections();
    
    // Add click listener to document to close dropdowns when clicking outside
    document.addEventListener("click", closeAllSelect);
    
    // Set first step active by default
    goToStep(1);
  });


/**
 * initializePreferences(assessment)
 * 
 * This function accepts an object representing the user's portfolio assessment 
 * responses and converts (maps) them into a set of default technical preferences 
 * (portfolioPreferences) that will be used by the optimization model.
 * 
 * The mapping leverages predefined arrays of parameter values (indices 0 to 4), where 
 * the index reflects the level of aggressiveness versus conservatism (0 being the lowest 
 * and 4 being the highest for a given parameter). In several cases, multiple assessment 
 * responses affect a parameter, and the mapping function uses conditional logic to adjust 
 * the final value.
 *
 * Expected keys in the assessment object:
 *  - investmentGoal: "growth", "income", "preservation", "balanced"
 *  - timeHorizon: "short", "medium", "long", "verylong"
 *  - riskTolerance: (number/string between 1 and 5, from a slider)
 *  - marketReaction: "sell", "sellsome", "hold", "buymore"
 *  - annualIncome: "under50k", "50to100k", "100to200k", "over200k"
 *  - liquidAssets: (similarly structured as income – optional mapping)
 *  - targetReturn: (the desired annual return percentage)
 *  - rebalancePeriod: "monthly", "quarterly", "biannually", "annually"
 *
 * Returns:
 *  An object containing the following portfolio preferences to be used by the optimizer:
 *    - rebalance_period
 *    - gamma
 *    - short_w
 *    - long_w
 *    - long_short_position
 *    - total_position
 *    - risk_tolerance
 *    - turnover_ratio
 *    - targetReturn
 */
function initializePreferences(assessment) {
    let preferences = {};
  
    const rebalancePeriodArray = [3, 5, 10, 21, 30];
    const gammaArray = [0.5, 1, 1.5, 2.0, 2.5];
    const shortWArray = [-0.2, -0.15, -0.1, -0.05, 0];  // From allowing shorts to no shorts
    const longWArray = [0.05, 0.1, 0.15, 0.2, 0.25];
    const longShortPositionArray = [1, 0.9, 0.8, 0.7, 0.6]; // Higher value implies more conservative net-long mandate
    const totalPositionArray = [0.8, 0.9, 1, 1.1, 1.2];      // Allows for leverage if >1
    // Predefined parameter arrays (indices 0–4)
    const riskToleranceArray = [0.01, 0.03, 0.05, 0.1, 0.15];
    const turnoverRatioArray = [0.05, 0.1, 0.15, 0.2, 0.25];
  

    // === Investment Goals Mapping ===
    // These mappings set several parameters based on the user's primary investment goal.
    // They do not cover every parameter; adjustments can be made in subsequent mapping steps.
    if (assessment.investmentGoal === "growth") {
      preferences.risk_tolerance = 3;  
      preferences.gamma = 2;                 
      preferences.long_w = 3;                
      preferences.short_w = 4;           
      preferences.total_position = 3;
    } else if (assessment.investmentGoal === "income") {
      preferences.risk_tolerance = 1; 
      preferences.gamma = 3;                 
      preferences.long_w = 1;                  
      preferences.short_w = 4;               
      preferences.total_position = 1; 
    } else if (assessment.investmentGoal === "preservation") {
      preferences.risk_tolerance = 0; 
      preferences.gamma = 4;                 
      preferences.long_w = 0;              
      preferences.short_w = 4;           
      preferences.total_position = 0;  
    } else if (assessment.investmentGoal === "balanced") {  // Balanced Growth & Income
      preferences.risk_tolerance = 2;  
      preferences.gamma = 3;                   
      preferences.long_w = 2;                  
      preferences.short_w = 4;                
      preferences.total_position = 2;  
    }
  
    // === Investment Time Horizon Mapping ===
    // These responses help set the rebalance period and turnover ratio.
    if (assessment.timeHorizon === "short") {
      preferences.rebalance_period = 0;  
      preferences.turnover_ratio = 3;
      preferences.long_short_position = 2;
    } else if (assessment.timeHorizon === "medium") {
      preferences.rebalance_period = 1; 
      preferences.turnover_ratio = 3;
      preferences.long_short_position = 2;
    } else if (assessment.timeHorizon === "long") {
      preferences.rebalance_period = 2;
      preferences.turnover_ratio = 2;  
      preferences.long_short_position = 2;
    } else if (assessment.timeHorizon === "verylong") {
      preferences.rebalance_period = 3;
      preferences.turnover_ratio = 1;
      preferences.long_short_position = 0; 
    }
  
    // Convert risk tolerance slider (expected as "1"-"5") into index (0 to 4)
    // (Assume that the slider value is a string that can be parsed into an integer)
    let rtIndex = parseInt(assessment.riskTolerance, 10) - 1;
    rtIndex = Math.max(0, Math.min(rtIndex, 4));  // Clamp between 0 and 4
    // Adjust gamma inversely relative to risk tolerance:
    if (rtIndex === 0) {
      preferences.gamma = Math.min(preferences.gamma+1, 4); 
      preferences.risk_tolerance = Math.max(preferences.risk_tolerance-1, 0);
    } else if (rtIndex === 4) {
      preferences.gamma = Math.max(preferences.gamma-1, 0);
      preferences.risk_tolerance = Math.min(preferences.risk_tolerance+1, 4);
    } 
  
    // === Market Reaction Mapping ===
    // Adjust based on how the user would react to a 20% loss.
    if (assessment.marketReaction === "sell") {
      preferences.risk_tolerance = Math.max(preferences.risk_tolerance - 1, 0);
      preferences.gamma = Math.min(preferences.gamma + 1, 4);
      preferences.turnover_ratio = Math.min(preferences.turnover_ratio + 1, 4);
    } else if (assessment.marketReaction === "buymore") {
      // Increase risk tolerance by one index step if possible, and lower gamma accordingly.
      preferences.risk_tolerance = Math.min(preferences.risk_tolerance + 1, 4);
      preferences.gamma = max(preferences.gamma - 1, 0);
      preferences.turnover_ratio = Math.min(preferences.turnover_ratio + 1, 4);
    }
    // "sellsome" or "hold" produce no further change.
  
    // === Financial Situation Mapping ===
    // Annual Income mapping adjusts short position limit and total_position.
    if (assessment.annualIncome === "under50k") {
      preferences.total_position = Math.max(preferences.total_position - 1, 0); 
    } else if (assessment.annualIncome === "100to200k") {
      preferences.short_w = Math.max(preferences.short_w - 1, 0); 
    } else if (assessment.annualIncome === "over200k") {
      preferences.short_w = Math.max(preferences.short_w - 1, 0); 
      preferences.total_position = Math.min(preferences.total_position + 1, 4);
    }
  
    // === Liquid Assets Mapping ===
    if (assessment.liquidAssets === "under50k") {
      preferences.total_position = Math.max(preferences.total_position - 1, 0); 
    } else if (assessment.liquidAssets === "100to200k") {
      preferences.long_w = Math.min(preferences.long_w + 1, 3);
      preferences.total_position = Math.min(preferences.total_position + 1, 4);
      preferences.turnover_ratio = Math.max(preferences.turnover_ratio - 1, 2); 
    }
    else if (assessment.liquidAssets === "over200k") {
      preferences.long_w = Math.min(preferences.long_w + 2, 4); 
      preferences.total_position = Math.min(preferences.total_position + 1, 4);
      preferences.turnover_ratio = Math.max(preferences.turnover_ratio - 2, 1);
    }

    // === Investment Preferences Mapping ===
    if (assessment.targetReturn >= 4 && assessment.targetReturn < 6){
      preferences.gamma = Math.min(preferences.gamma + 2, 4);
      preferences.risk_tolerance = Math.max(preferences.risk_tolerance - 2, 0); 
    } else if (assessment.targetReturn >= 10 && assessment.targetReturn < 12){
      preferences.gamma = Math.max(preferences.gamma - 1, 1);
      preferences.risk_tolerance = Math.min(preferences.risk_tolerance + 1, 3); 
    } else if (assessment.targetReturn >= 12 && assessment.targetReturn < 15){
      preferences.gamma = Math.max(preferences.gamma - 2, 0);
      preferences.risk_tolerance = Math.min(preferences.risk_tolerance + 2, 4); 
    }
    
    // Rebalance Period preference from user input (this might override the initial mapping)
    // The assessment answer ("monthly", "quarterly", etc.) further adjusts the parameters.
    if (assessment.rebalancePeriod === "monthly") {
      preferences.rebalance_period = Math.max(preferences.rebalance_period - 1, 0);
      preferences.turnover_ratio = Math.min(preferences.turnover_ratio + 1, 4);
    } else if (assessment.rebalancePeriod === "biannually") {
      preferences.rebalance_period = Math.min(preferences.rebalance_period + 1, 4);
    } else if (assessment.rebalancePeriod === "annually") {
      preferences.rebalance_period = Math.min(preferences.rebalance_period + 2, 4); 
    }

    // Convert the indexes to actual values using the predefined arrays.
    preferences.rebalance_period = rebalancePeriodArray[preferences.rebalance_period];
    preferences.gamma = gammaArray[preferences.gamma];
    preferences.short_w = shortWArray[preferences.short_w];
    preferences.long_w = longWArray[preferences.long_w];
    preferences.long_short_position = longShortPositionArray[preferences.long_short_position];
    preferences.total_position = totalPositionArray[preferences.total_position];
    preferences.risk_tolerance = riskToleranceArray[preferences.risk_tolerance];
    preferences.turnover_ratio = turnoverRatioArray[preferences.turnover_ratio];

    // Return the full preferences object.
    return preferences;
  }
  