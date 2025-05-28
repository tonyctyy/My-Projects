# routes.py
from flask import request, Blueprint, jsonify, render_template
from utils import get_portfolios

main_routes = Blueprint("main_routes", __name__)

@main_routes.route("/")
def index():
    return render_template("index.html")

@main_routes.route("/assessment")
def assessment():
    return render_template("assessment.html")

@main_routes.route("/compute_portfolios", methods=["GET"])
def compute_portfolios():
    try:
        # Extract parameters from the URL and cast to the required data types
        rebalance_period = int(request.args.get("rebalance_period"))
        short_w = float(request.args.get("short_w"))
        long_w = float(request.args.get("long_w"))
        total_position = float(request.args.get("total_position"))
        long_short_position = float(request.args.get("long_short_position"))
        turnover_ratio = float(request.args.get("turnover_ratio"))
        gamma = float(request.args.get("gamma"))
        risk_tolerance = float(request.args.get("risk_tolerance"))
    except (TypeError, ValueError) as e:
        # If any parameter is missing or has an invalid format, return an error
        return jsonify({"error": f"Invalid or missing parameter: {str(e)}"}), 400

    # Build a dictionary of parameters
    params = {
        "rebalance_period": rebalance_period,
        "short_w": short_w,
        "long_w": long_w,
        "total_position": total_position,
        "long_short_position": long_short_position,
        "turnover_ratio": turnover_ratio,
        "gamma": gamma,
        "risk_tolerance": risk_tolerance,
    }
    result, status = get_portfolios(params)
    return jsonify(result), status
