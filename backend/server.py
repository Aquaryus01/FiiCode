#!/usr/bin/python
import sqlite3
import jwt
import json
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from passlib.hash import sha256_crypt

app = Flask(__name__)
CORS(app, support_credentials=True)

jwt_key = 'OQU6kcW1J0Y0jG9uVnU5hznryLm1df7bMvuM30GY8Im6_RsmMv5fvW5pcft1QFYk'

con = sqlite3.connect('data.db')
c = con.cursor()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    try:
        c.execute('SELECT password FROM users WHERE email = (?)', (data['email'],))
        if not sha256_crypt.verify(data['password'], c.fetchone()[0]):
            return json.dumps({'status': False, 'message': 'Wrong password!'})
        else:
            c.execute('SELECT userId, admin FROM Users WHERE email = (?)', (data['email'],))
            user_data = c.fetchone()
            encoded_jwt = jwt.encode({'userId': user_data[0], 'admin': user_data[1]}, jwt_key)
            return json.dumps({'status': True, 'values': {'jwt': encoded_jwt}})
    except Exception as e:
        print(e)
        return json.dumps({'status': False, 'message': e})


if __name__ == '__main__':
    app.run(host='0.0.0.0')
