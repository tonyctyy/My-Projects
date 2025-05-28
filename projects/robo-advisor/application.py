from flask import Flask
from routes import main_routes

application = Flask(__name__)
application.register_blueprint(main_routes)

if __name__ == "__main__":
    # Debug mode is enabled here for development; disable it for production.
    application.run(debug=True)
