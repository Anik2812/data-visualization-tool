from flask import Flask, render_template, jsonify, send_from_directory
import random

app = Flask(__name__)

# Mock data for ice cream flavors and sales
ice_cream_data = {
    'Vanilla': random.randint(100, 500),
    'Chocolate': random.randint(100, 500),
    'Strawberry': random.randint(100, 500),
    'Mint Chocolate Chip': random.randint(100, 500),
    'Cookie Dough': random.randint(100, 500),
    'Butter Pecan': random.randint(100, 500),
    'Rocky Road': random.randint(100, 500),
    'Pistachio': random.randint(100, 500),
    'Neapolitan': random.randint(100, 500),
    'Coffee': random.randint(100, 500)
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/api/data')
def get_data():
    return jsonify({
        'flavor_popularity': ice_cream_data,
        'top_5_flavors': dict(sorted(ice_cream_data.items(), key=lambda x: x[1], reverse=True)[:5])
    })

if __name__ == '__main__':
    app.run(debug=True)