#!/usr/bin/python3
import sqlite3
import jwt
import json
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from passlib.hash import sha256_crypt
import pickle

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
            c.execute('SELECT user_id FROM users WHERE email = (?)', (data['email'],))
            user_data = c.fetchone()
            encoded_jwt = jwt.encode({'user_id': user_data[0]}, jwt_key)
            return json.dumps({'status': True, 'values': {'jwt': encoded_jwt.decode()}})
    except Exception as e:
        return json.dumps({'status': False})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json(force=True)
    to_add = (data['first_name'],
              data['last_name'],
              data['email'],
              sha256_crypt.encrypt(data['password']))
    try:
        c.execute('INSERT INTO users \
            (first_name, last_name, email, password) \
            VALUES (?, ?, ?, ?)', to_add)
        con.commit()
        c.execute('SELECT user_id FROM users WHERE email = (?)', (data['email'],))
        user_data = c.fetchone()
        encoded_jwt = jwt.encode({'user_id': user_data[0]}, jwt_key)
        to_send = {'status': True, 'values': {'jwt': encoded_jwt.decode()}}
        return json.dumps(to_send)
    except Exception as e:
        return json.dumps({'status': False, 'message': 'Email already in use'})

@app.route('/check', methods=['POST'])
def check():
    data = request.get_json(force=True)
    try:
        jwt.decode(data, jwt_key)
        return json.dumps({'status': True})
    except:
        return json.dumps({'status': False})

@app.route('/get_allergies', methods=['POST'])
def get_allergies():
    data = request.get_json(force=True)

    try:
        decoded = jwt.decode(data['jwt'], jwt_key)
    except:
        return json.dumps({'status': False})

    c.execute('SELECT allergy_id, name, description from allergies')
    lines = c.fetchall()

    c.execute('SELECT allergy_id FROM user_allergies WHERE user_id=?', (decoded['user_id'],))
    allergies = []
    a = c.fetchall()
    for al in a:
        allergies.append(al[0])

    to_send = []
    for line in lines:
        if line[0] in allergies:
            to_send.append({'id': line[0], 'title': line[1], 'description': line[2], 'check': True})
        else:
            to_send.append({'id': line[0], 'title': line[1], 'description': line[2], 'check': False})
    return json.dumps(to_send)

@app.route('/check_allergy', methods=['POST'])
def check_allergy():
    data = request.get_json(force=True)
    try:
        decoded = jwt.decode(data['jwt'], jwt_key)
        if int(data['checked']) == 1:
            c.execute('INSERT INTO user_allergies (allergy_id, user_id) VALUES (?, ?)',
                      (data['id'], decoded['user_id']))
        elif int(data['checked']) == 0:
            c.execute('DELETE FROM user_allergies WHERE allergy_id=? AND user_id=?',
                      (data['id'], decoded['user_id']))
        con.commit()
        return json.dumps({'status': True})
    except:
        return json.dumps({'status': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0')
