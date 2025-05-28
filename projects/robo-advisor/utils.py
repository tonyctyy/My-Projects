import os
import json
import numpy as np
import pandas as pd
import matplotlib
import seaborn as sns
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import empyrical as emp
import base64
from io import BytesIO
from optimization import compute_portfolio_weights

# Global parameters (ensure these match the dimensions of your data)
stock_back_period = 100 # Number of periods used as the training window
backtesting_start_date = "2021-11-09" # after considering 100 days and testing_start_date
sentiment_start_date = "2021-09-30"
sentiment_end_date = "2022-09-29"
testing_start_date = "2022-04-01" # Start date of rebalancing, testing will be 2022-04-04, 2022-04-05, 2022-04-06

# Define custom colors that match your website theme
PLOT_BACKGROUND = '#1E1E1E'  # Your card background color
PLOT_GRID = '#333333'        # Slightly lighter than background for grid
TEXT_COLOR = '#E0E0E0'       # Your primary text color
PRIMARY_BLUE = '#0055b3'     # Your primary blue accent color
LINE_COLORS = [
    '#4287f5',  # Medium blue
    '#42c5f5',  # Sky blue
    '#8e42f5',  # Purple
    '#c542f5',  # Magenta
    '#f542e2',  # Pink
    '#f54266',  # Red
    '#f56642',  # Orange
    '#f5a142',  # Amber
    '#f5d642',  # Yellow (softened)
    '#c8f542',  # Lime (softened)
    '#42f54e',  # Green
    '#42f5a4',  # Teal
    '#42d9f5',  # Cyan
    '#427df5',  # Royal blue
    '#6b42f5',  # Indigo
    '#bd42f5',  # Violet
    '#f542bd',  # Hot pink
    '#f54275',  # Coral
    '#f58a42',  # Light orange
    '#f5c842'   # Gold
]

def setup_plot_style():
    """Setup the plot style to match the website theme."""
    # Set the Seaborn style
    sns.set_style("darkgrid", {
        'axes.facecolor': PLOT_BACKGROUND,
        'figure.facecolor': PLOT_BACKGROUND,
        'grid.color': PLOT_GRID,
        'text.color': TEXT_COLOR,
        'axes.labelcolor': TEXT_COLOR,
        'axes.edgecolor': PLOT_GRID,
        'xtick.color': TEXT_COLOR,
        'ytick.color': TEXT_COLOR,
    })
    
    # Set additional matplotlib parameters
    plt.rcParams.update({
        'font.family': 'Segoe UI',  # Match your website font
        'font.size': 10,
        'axes.titleweight': 'medium',
        'axes.titlesize': 12,
        'axes.labelweight': 'medium',
        'axes.labelsize': 10,
        'figure.titlesize': 14,
        'figure.titleweight': 'bold',
        'lines.linewidth': 2,
    })

def generate_plots(cumulative_plots, dates):
    """
    Generate a Seaborn plot based on dynamic_plot values and return a base64-encoded PNG image.
    This plot shows the cumulative return of the dynamic portfolio.
    """
    setup_plot_style()
    
    # Create figure with appropriate size for mobile
    plt.figure(figsize=(8, 5), dpi=100)
    
    if not isinstance(cumulative_plots, dict):
        cumulative_plots = {'Portfolio': cumulative_plots}
    
    dates = pd.to_datetime(dates)

    # Plot each line with custom colors
    for i, (key, plot) in enumerate(cumulative_plots.items()):
        color = LINE_COLORS[i % len(LINE_COLORS)]
        plt.plot(dates, plot, label=key, color=color)
    
    # Format axes
    plt.xlabel("Date", fontweight='medium')
    plt.ylabel("Cumulative Return", fontweight='medium')
    plt.title("Portfolio Performance", fontweight='bold', fontsize=12)
    
    # Format date ticks to be more mobile-friendly
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    plt.gca().xaxis.set_major_locator(mdates.MonthLocator(interval=3))
    # plt.xticks(rotation=45)
    
    # Add grid but make it subtle
    plt.grid(True, linestyle='--', alpha=0.3)
    
    # Improve legend
    plt.legend(frameon=True, framealpha=0.8, facecolor=PLOT_BACKGROUND, edgecolor=PLOT_GRID)
    
    # Tight layout to use space efficiently
    plt.tight_layout()
    
    # Add subtle box around the plot
    plt.gca().spines['bottom'].set_color(PLOT_GRID)
    plt.gca().spines['top'].set_color(PLOT_GRID)
    plt.gca().spines['left'].set_color(PLOT_GRID)
    plt.gca().spines['right'].set_color(PLOT_GRID)
    
    # Save to BytesIO
    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", facecolor=PLOT_BACKGROUND)
    plt.close()
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return img_base64

def evaluate_returns(portfolio_returns, digit=4):
    # If portfolio_returns is not a dict, then assume it's the returns of a single portfolio.
    if not isinstance(portfolio_returns, dict):
        portfolio_returns = {"Portfolio": list(portfolio_returns)}
    else:
        # Ensure each portfolio's returns is a list.
        portfolio_returns = {k: list(v) for k, v in portfolio_returns.items()}
    
    # Create dictionary to hold computed metrics for each portfolio.
    metrics = {}
    for name, ret in portfolio_returns.items():
        # Compute annual return for this portfolio.
        ret = np.array(ret)
        annual_ret = emp.annual_return(ret)
        annual_vol = emp.annual_volatility(ret)
        sharpe_ratio = emp.sharpe_ratio(ret)
        cum_returns = np.prod(1 + np.array(ret)) - 1
        max_drawdown = emp.max_drawdown(ret)
        # You could also add more metrics here.
        metrics[name] = {
            "Annual Return": round(annual_ret, digit),
            "Annual Volatility": round(annual_vol, digit),
            "Sharpe Ratio": round(sharpe_ratio, digit),
            "Cumulative Return": round(cum_returns, digit),
            "Max Drawdown": round(max_drawdown, digit),
        }
    # Convert metrics dictionary to a DataFrame.
    # The rows will be the evaluation metrics, the columns the portfolio names.
    evaluation_df = pd.DataFrame(metrics)
    return evaluation_df

def load_precomputed_data(json_file_path):
    """Load precomputed stock and sentiment data from a JSON file."""
    with open(json_file_path, "r") as f:
        data = json.load(f)
    return data

def get_cul_returns(test_return, w, rebalance_period, num_windows):
    """
    Compute cumulative returns:
      - 'test_return' is assumed to be a 2D list or array.
      - 'w' is a list of weights for each window.
    Returns both the raw cumulative returns and the dynamic plot values.
    """
    test_return = np.array(test_return)
    cul_return = np.array([])
    for i in range(num_windows):
        start = i * rebalance_period + stock_back_period
        end = start + rebalance_period
        rtr = test_return[start:end] @ w[i]
        cul_return = np.append(cul_return, rtr)
    # dynamic plot: starting from 1, cumulate returns
    dynamic_plot = 1 + np.cumsum(cul_return)
    return cul_return.tolist(), dynamic_plot.tolist()

def get_portfolios(params):
    rebalance_period = params['rebalance_period']
    # Path to the JSON file with precomputed data.
    json_file_path = os.path.join("data", "precomputed_stock_data.json")
    
    try:
        precomputed_data = load_precomputed_data(json_file_path)
    except Exception as e:
        return {"error": f"Failed to load precomputed data: {e}"}, 500

    # Assume the JSON is keyed by ticker (e.g., "AAPL").
    tickers = list(precomputed_data.keys())
    N = len(tickers)
    # Determine number of days (T) from a ticker.
    T = len(precomputed_data[tickers[0]])
    
    # Build a 2D list of "log_return" values.
    log_return_array = []
    close_prices_array = []
    date_array = []
    for day in range(T):
        # get the date for the current day
        date = precomputed_data[tickers[0]][day]["Date"]
        # compare with the backtesting_start_date
        if date >= backtesting_start_date:
            date_array.append(date)
            log_returns = []
            close_prices = []
            for ticker in tickers:
                try:
                    log_return = precomputed_data[ticker][day]["log_return"]
                    close_price = precomputed_data[ticker][day]["Close"]
                except Exception as e:
                    return {"error": f"Missing data for {ticker} on day {day}: {e}"}, 500
                log_returns.append(log_return)
                close_prices.append(close_price)
            log_return_array.append(log_returns)
            close_prices_array.append(close_prices)

    total_windows = int((len(date_array) - stock_back_period)/rebalance_period)
    
    # Dynamic Portfolio Optimization:
    # Compute portfolio weights using the optimization module.
    dynamic_weights, rebalance_index_lst = compute_portfolio_weights(params, log_return_array, stock_back_period, total_windows, N)
    # Compute cumulative returns and dynamic plot values.
    dynamic_return, dynamic_plot = get_cul_returns(log_return_array, dynamic_weights, rebalance_period, total_windows)

    # Equal Weight Portfolio:
    equal_weight = np.ones(N)/N
    equal_weights = np.array([equal_weight for _ in range(total_windows)])
    equal_weight_return, equal_weight_plot = get_cul_returns(log_return_array, equal_weights, rebalance_period, total_windows)

    # Static Portfolio Optimization:
    static_weight = dynamic_weights[0]
    static_weights = np.array([static_weight for _ in range(total_windows)])
    static_weight_return, static_weight_plot = get_cul_returns(log_return_array, static_weights, rebalance_period, total_windows)

    # Generate the cumulative return plot.
    cumulative_plots = {
        "Dynamic": dynamic_plot,
        "Equal Weight": equal_weight_plot,
        "Static": static_weight_plot,
    }
    
    testing_start = stock_back_period
    testing_end = testing_start + rebalance_period*total_windows
    testing_date_array =  pd.to_datetime(date_array[testing_start:testing_end])
    testing_close_prices_array = close_prices_array[testing_start:testing_end]

    # Generate the price plot (one line per ticker) using the "Close" prices.
    # price_plot_img = generate_price_plot(testing_close_prices_array, testing_date_array, tickers) 

    # Generate the dynamic portfolio cumulative return plot.
    dynamic_plot_img = generate_plots(cumulative_plots, testing_date_array)

    portfolios_returns = {
                            "Equal Weight": equal_weight_return,
                            "Static": static_weight_return,
                            "Dynamic": dynamic_return,
                        }
    evaluation_metrics = evaluate_returns(portfolios_returns)

    evaluation_json = evaluation_metrics.reset_index().rename(columns={'index': 'metric'}).to_dict(orient='records')

    rebalance_date = [date_array[i] for i in rebalance_index_lst]
    # Return all computed data.
    result = {
        "plot": dynamic_plot_img,
        "evaluation": evaluation_json,
        "weights": dynamic_weights,
        "rebalance_date": rebalance_date,
        "tickers": tickers,
    }
    return result, 200
