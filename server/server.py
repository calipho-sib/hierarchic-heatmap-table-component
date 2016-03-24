# -*- coding: utf-8 -*-
# @Author: linjinjin
# @Date:   2016-03-23 18:57:05
# @Last Modified by:   linjinjin
# @Last Modified time: 2016-03-23 19:19:03

from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)