from flask import Flask, render_template, jsonify

app = Flask(__name__)


@app.route('/status', methods=['GET'])
def status():
    try:
        import database
        database.test()
        return jsonify(status='Success')
    except Exception as e:
        return jsonify(status='Failed', error=str(e))


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
