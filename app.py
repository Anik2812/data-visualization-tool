from flask import Flask, render_template, jsonify, send_from_directory
import random

app = Flask(__name__)

ice_cream_data = {
    'Vanilla': random.randint(100, 500),
    'Chocolate': random.randint(100, 500),
    'Strawberry': random.randint(100, 500),
    'Mint Chip': random.randint(100, 500),
    'Cookie Dough': random.randint(100, 500),
    'Bubblegum': random.randint(100, 500),
    'Rainbow Sherbet': random.randint(100, 500),
    'Cotton Candy': random.randint(100, 500),
    'Unicorn Swirl': random.randint(100, 500),
    'Dinosaur Crunch': random.randint(100, 500)
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