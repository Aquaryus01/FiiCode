#!/usr/bin/python3
import sqlite3
import jwt
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from passlib.hash import sha256_crypt
import requests
import datetime

app = Flask(__name__)
CORS(app, support_credentials=True)

jwt_key = 'OQU6kcW1J0Y0jG9uVnU5hznryLm1df7bMvuM30GY8Im6_RsmMv5fvW5pcft1QFYk'
api_key = '8381130a53e784ba31a2d4fbc8e16ede'

con = sqlite3.connect('data.db')
c = con.cursor()

def check_jwt(j):
    try:
        decoded = jwt.decode(j, jwt_key)
        return decoded
    except:
        return False

def get_date():
    day = datetime.datetime.now().day
    months = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie',
              'Noiembrie', 'Decembrie']
    month = months[datetime.datetime.now().month - 1]
    year = datetime.datetime.now().year
    return '{} {} {}'.format(day, month, year)

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

    c.execute('SELECT allergy_id, name, description, image from allergies')
    lines = c.fetchall()

    c.execute('SELECT allergy_id FROM user_allergies WHERE user_id=?', (decoded['user_id'],))
    allergies = []
    a = c.fetchall()
    for al in a:
        allergies.append(al[0])

    to_send = []
    for line in lines:
        if line[0] in allergies:
            to_send.append({'id': line[0], 'title': line[1], 'description': line[2], 'check': True, 'image': line[3]})
        else:
            to_send.append({'id': line[0], 'title': line[1], 'description': line[2], 'check': False, 'image': line[3]})
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

@app.route('/get_weather', methods=['GET'])
def get_weather():
    r = requests.get('http://api.openweathermap.org/data/2.5/weather?q=brasov&appid=' + api_key)
    values = r.json()
    return json.dumps({'temperature': round(values['main']['temp'] - 273, 2),
                       'humidity': str(values['main']['humidity']) + '%',
                       'wind': 'Speed: ' + str(values['wind']['speed']) + ' km/h'})

@app.route('/add_post', methods=['POST'])
def add_post():
    data = request.get_json(force=True)
    try:
        decoded = jwt.decode(data['jwt'], jwt_key)

        is_image = True
        try:
            x = data['image']
        except:
            is_image = False

        if is_image:
            c.execute('INSERT INTO posts (user_id, title, description, image, date) VALUES (?, ?, ?, ?, ?)',
                      (decoded['user_id'], data['title'], data['description'], data['image'], get_date()))
        else:
            c.execute('INSERT INTO posts (user_id, title, description, date) VALUES (?, ?, ?, ?)',
                      (decoded['user_id'], data['title'], data['description'], get_date()))
        con.commit()

        c.execute('SELECT post_id FROM posts')
        post_id = c.fetchall()[-1][0]
        print(post_id)

        # for tag in data['tags']:
        #     c.execute('INSERT INTO post_allergy (post_id, allergy_id) VALUES (?, ?)', (post_id, tag))
        #     con.commit()

        return jsonify({'status': True})
    except:
        return jsonify({'status': False})

@app.route('/get_posts', methods=['POST'])
def get_posts():
    data = request.get_json(force=True)
    try:
        jwt.decode(data['jwt'], jwt_key)

        tags_bool = True
        try:
            x = data['tags']
        except:
            tags_bool = False

        to_send = []

        if tags_bool:
            for tag in data['tags']:
                c.execute('SELECT post_id FROM post_allergy where allergy_id=?', (tag,))
                lines = c.fetchall()
                for line in lines:
                    post_id = line[0]
                    c.execute('SELECT * FROM posts WHERE post_id=?', (post_id,))
                    l = c.fetchone()
                    to_send.append({'id': l[0], 'title': l[1], 'description': l[2],
                                    'image': l[3], 'date': l[4], 'comments': l[5]})
        else:
            c.execute('SELECT post_id, title, description, image, date, comments_nr, last_name, first_name \
            FROM posts INNER JOIN users ON posts.user_id = users.user_id')
            lines = c.fetchall()
            for line in lines:
                to_send.append({'id': line[0], 'title': line[1], 'description': line[2],
                                'image': line[3], 'date': line[4], 'comments': line[5],
                                'name': '{} {}'.format(line[6], line[7])})
        return jsonify(to_send)
    except:
        return jsonify({'status': False})

@app.route('/post_comment', methods=['POST'])
def post_comment():
    data = request.get_json(force=True)
    try:
        decoded = jwt.decode(data['jwt'], jwt_key)

        print(data, decoded)

        c.execute('INSERT INTO comments (post_id, user_id, comment, date) VALUES (?, ?, ?, ?)',
                  (data['id'], decoded['user_id'], data['comment'], get_date()))
        con.commit()

        c.execute('SELECT comments_nr FROM posts WHERE post_id=?', (data['id'],))
        comm_nr = c.fetchone()[0] + 1

        c.execute('UPDATE posts SET comments_nr = ? WHERE post_id = ?', (comm_nr, data['id']))
        con.commit()

        c.execute('SELECT comments.user_id, last_name, first_name, comment, comments.date, comment_id FROM posts\
                INNER JOIN comments ON posts.post_id=comments.post_id\
                 INNER JOIN users ON posts.user_id=users.user_id WHERE posts.post_id=?', (data['id'],))
        line = c.fetchall()[-1]

        print(line)

        return jsonify({'name': '{} {}'.format(line[1], line[2]), 'comment': line[3],
                            'mine': True, 'date': line[4], 'id': line[5]})
    except:
        return jsonify({'status': False})

@app.route('/get_comments', methods=['POST'])
def get_comments():
    data = request.get_json(force=True)
    try:
        decoded = jwt.decode(data['jwt'], jwt_key)
    except:
        return jsonify({'status': False})

    c.execute('SELECT comments_nr FROM posts WHERE post_id=?', (data['id'],))

    nr = c.fetchone()[0]
    if int(nr) == 0:
        return jsonify({'status': False, 'message': 'No comments'})
    else:
        to_send = []

        c.execute('SELECT comment_id, user_id, comment, date FROM comments WHERE post_id=?', (data['id'],))

        lines = c.fetchall()

        # c.execute('SELECT comments.user_id, last_name, first_name, comment, comments.date, comment_id FROM posts\
        # INNER JOIN comments ON posts.post_id=comments.post_id\
        #  INNER JOIN users ON posts.user_id=users.user_id WHERE posts.post_id=?', (data['id'],))
        # lines = c.fetchall()

        for line in lines:

            c.execute('SELECT last_name, first_name FROM users WHERE user_id=?', (line[1],))

            try:
                l = c.fetchall()[0]
            except:
                continue

            if decoded['user_id'] == line[1]:
                mine = True
            else:
                mine = False
            to_send.append({'name': '{} {}'.format(l[0], l[1]), 'comment': line[2],
                            'mine': mine, 'date': line[3], 'id': line[0]})
            print(to_send)

        return jsonify(to_send)

@app.route('/delete_comment', methods=['POST'])
def delete_comment():
    print('sad')
    data = request.get_json(force=True)

    try:
        decoded = jwt.decode(data['jwt'], jwt_key)
    except:
        return jsonify({'status': False})

    c.execute('DELETE FROM comments WHERE comment_id=?', (data['id'],))
    # c.execute('UPDATE')
    con.commit()

    return jsonify({'status': True})

def robot_help():
    return jsonify({'text': '/info [allergy]\n/pills [allergy]\n/drugstores\n/ask'})

@app.route('/robot', methods=['POST'])
def robot():
    data = request.get_json(force=True)

    if check_jwt(data['jwt']) == False:
        return jsonify('Invalid token!')

    if data['command'].lower().split(' ')[0] == '/info':
        return robot_generic(data['command'].split(' ')[1:], 'info')

    elif data['command'].lower() == '/help':
        return robot_help()

    elif data['command'].lower().split(' ')[0] == '/pills':
        return robot_generic(data['command'].split(' ')[1:], 'pills')


def robot_generic(allergy, action):
    try:
        allergy.remove('allergy')
    except:
        pass
    for w in allergy:
        w = w.lower()

    c.execute('SELECT description, name, image, pills FROM allergies')

    allergies = c.fetchall()

    for a in allergies:
        # if a[1].lower() == allergy.lower():
        #     return jsonify({'text': a[0]})
        a_words = a[1].lower().split(' ')
        try:
            a_words.remove('allergy')
        except:
            pass
        for a_word in a_words:
            for aller in allergy:
                if a_word == aller:
                    if action == 'info':
                        return jsonify({'text': a[0], 'url': a[2]})
                    elif action == 'pills':
                        return jsonify({'text': a[3], 'url': a[2]})

    return jsonify({'check': 'add_allergy'})

@app.route('/add_allergy', methods=['POST'])
def add_allergy():
    data = request.get_json(force=True)

    c.execute('INSERT INTO allergies (name, description, image, pills) VALUES (?, ?, ?, ?)',
              (data['name'], data['description'], data['url'], data['pills']))
    con.commit()

    return jsonify({'status': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0')
