# optimization.py
import numpy as np
import cvxpy as cp

def MVP(mu, Sigma, w_old, N, Gamma=1, short_w=-0.2, long_w=0.2, long_short_position=0.6, total_position=1.6, risk_tolerance=0.1, turnover_ratio=0.15,):
    # Gamma = 1.5
    risk_tolerance= 0.03
    """Compute optimal portfolio weights using a mean-variance optimization model."""
    w = cp.Variable(N)
    variance = cp.quad_form(w, Sigma)
    expected_return = w @ mu
    turnover = cp.norm(w - w_old, 1) / 2
    objective = cp.Maximize(expected_return -  Gamma**2/2 * variance)

    constraints = [
        w >= short_w,
        w <= long_w,
        cp.sum(w) >= long_short_position,
        cp.sum(cp.abs(w)) <= total_position, # Total Long/Short position
        variance <= risk_tolerance**2,     # Maximum allowed variance
        turnover <= turnover_ratio,
    ] 
    problem = cp.Problem(objective=objective, constraints=constraints)
    problem.solve(solver=cp.SCS, max_iters=10000) 
    if problem.status == cp.OPTIMAL:
        return w.value
    else:
        return np.ones(N) / N

def compute_portfolio_weights(params, stock_logreturn, stock_back_period, total_windows, N=16):
    """
    Compute portfolio weights over multiple rebalancing windows.
    
    stock_logreturn should be a dictionary with key "Close" containing a 2D list 
    or array of values of shape (T, N) where T is time and N is the number of stocks.
    """
    rebalance_period = params['rebalance_period']
    short_w = params['short_w']
    long_w = params['long_w']
    total_position = params['total_position']
    long_short_position = params['long_short_position']
    turnover_ratio = params['turnover_ratio']
    gamma = params['gamma']
    risk_tolerance = params['risk_tolerance']


    stock_logreturn = np.array(stock_logreturn)
    # Start with an equal-weight portfolio.
    w_old = np.ones(N) / N
    weights = np.zeros((total_windows, N))
    rebalance_index_lst = []
    for i in range(total_windows):
        trt_start = i * rebalance_period
        rebalance_index_lst.append(trt_start)
        trt_end = trt_start + stock_back_period
        train_data = stock_logreturn[trt_start:trt_end]
        
        mu = np.mean(train_data, axis=0)
        Sigma = np.cov(train_data, rowvar=False)
        # Get new portfolio weights
        w_old = MVP(mu, Sigma, w_old, N, gamma, short_w, long_w, long_short_position, total_position, risk_tolerance, turnover_ratio)
        weights[i] = w_old
    return weights.tolist(), rebalance_index_lst
