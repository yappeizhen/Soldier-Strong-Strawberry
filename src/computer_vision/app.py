from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys


app = Flask(__name__)

@app.route('/',methods=['GET'])
def get_articles():
    return jsonify({"Hello":"World"})


@app.route("/video", methods=['GET', 'POST'])
def video():
    if(request.method == "POST"):
        bytesOfVideo = request.get_data()
        with open('video.mp4', 'wb') as out:
            out.write(bytesOfVideo)
        return "Video read"



if __name__ == "__main__":
    app.run(debug=True)