from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import datetime
from flask_cors import CORS 
from datetime import timedelta
from bson import ObjectId
from datetime import datetime 

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173","http://localhost:5173/register"])


client = MongoClient('mongodb://localhost:27017')
db = client['dore']

users_collection = db['users']
questions_collection = db['questions']
topics_collection = db['topics']
answers_collection = db['answers']
votes_collection = db['votes']


app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET', 't5ID4MaiWPM5yxbPvpLFiNfmeKJuArME')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

@app.route('/api/users/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "User already exists!"}), 400

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = {
            "username": username,
            "email": email,
            "password_hash": password_hash
        }
        users_collection.insert_one(new_user)

        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as err:
        return jsonify({"error": str(err)}), 400

@app.route('/api/users/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        user = users_collection.find_one({"email": email})
        if not user:
            raise ValueError('User not found!')

        if not bcrypt.check_password_hash(user['password_hash'], password):
            raise ValueError('Invalid credentials!')

        token = create_access_token(identity=str(user['_id']), fresh=True)

        return jsonify({"token": token, "userId": str(user['_id'])})
    except Exception as err:
        return jsonify({"error": str(err)}), 400

@app.route('/api/questions', methods=['POST'])
@jwt_required()
def create_question():
    try:
        data = request.get_json()
        title = data['title']
        content = data['content']
        topic_id = data['topicId']

        user_id = get_jwt_identity()  

        new_question = {
            "title": title,
            "content": content,
            "topicId": topic_id,
            "userId": user_id,
            "createdAt": datetime.utcnow(),  
            "updatedAt": None
        }

        question_id = questions_collection.insert_one(new_question).inserted_id
        new_question["_id"] = str(question_id)

        return jsonify(new_question), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/questions', methods=['GET'])
def get_questions():
    try:
        topic_id = request.args.get('topicId')
        query = {}
        if topic_id:
            query["topicId"] = topic_id

        questions = list(questions_collection.find(query))

        for question in questions:
            question["_id"] = str(question["_id"])

            if "userId" in question:
                user = users_collection.find_one({"_id": ObjectId(question["userId"])})
                question["username"] = user["username"] if user else "Unknown"
            else:
                question["username"] = "Unknown"

        return jsonify(questions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/questions/<question_id>', methods=['GET'])
def get_question(question_id):
    try:
        question = questions_collection.find_one({"_id": ObjectId(question_id)})

        if not question:
            return jsonify({"error": "Question not found"}), 404

        question["_id"] = str(question["_id"])

        user = users_collection.find_one({"_id": ObjectId(question["userId"])})
        question["username"] = user["username"] if user else "Unknown"

        return jsonify(question)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/questions/<question_id>', methods=['PUT'])
@jwt_required()
def update_question(question_id):
    try:
        data = request.get_json()
        title = data['title']
        content = data['content']

        question = questions_collection.find_one({"_id": MongoClient.ObjectId(question_id)})

        if not question:
            return jsonify({"error": "Question not found"}), 404

        user_id = get_jwt_identity()
        if str(question["userId"]) != str(user_id):
            return jsonify({"error": "Unauthorized to update this question"}), 403

        question["title"] = title
        question["content"] = content
        question["updatedAt"] = datetime.datetime.utcnow()

        questions_collection.replace_one({"_id": MongoClient.ObjectId(question_id)}, question)

        question["_id"] = str(question["_id"])
        return jsonify(question)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/questions/<question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    try:
        question = questions_collection.find_one({"_id": MongoClient.ObjectId(question_id)})

        if not question:
            return jsonify({"error": "Question not found"}), 404

        user_id = get_jwt_identity()
        if str(question["userId"]) != str(user_id):
            return jsonify({"error": "Unauthorized to delete this question"}), 403

        questions_collection.delete_one({"_id": MongoClient.ObjectId(question_id)})

        return jsonify({"message": "Question deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/topics', methods=['POST'])
def create_topic():
    try:
        data = request.get_json()
        name = data['name']
        description = data.get('description', '')

        if topics_collection.find_one({"name": name}):
            return jsonify({"error": "Topic already exists!"}), 400

        new_topic = {
            "name": name,
            "description": description
        }
        topic_id = topics_collection.insert_one(new_topic).inserted_id

        new_topic["_id"] = str(topic_id)
        return jsonify(new_topic), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/topics', methods=['GET'])
def get_topics():
    try:
        topics = list(topics_collection.find())
        for topic in topics:
            topic["_id"] = str(topic["_id"])  

        return jsonify(topics)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route('/api/answers/<question_id>', methods=['POST'])
@jwt_required()  
def create_answer(question_id):
    try:
        user_id = get_jwt_identity()

        data = request.get_json()
        content = data['content']

        if not ObjectId.is_valid(question_id):  
            return jsonify({"error": "Invalid question ID format!"}), 400

        question = questions_collection.find_one({"_id": ObjectId(question_id)})
        if not question:
            return jsonify({"error": "Question not found!"}), 404

        new_answer = {
            "questionId": question_id,  
            "userId": user_id,
            "content": content,
            "createdAt": datetime.utcnow(),  
            "updatedAt": None
        }
        answer_id = answers_collection.insert_one(new_answer).inserted_id

        new_answer["_id"] = str(answer_id)
        return jsonify(new_answer), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/answers/<question_id>', methods=['GET'])
def get_answers(question_id):
    try:
        answers = list(answers_collection.find({"questionId": question_id}))
        
        for answer in answers:
            answer["_id"] = str(answer["_id"])
            user = users_collection.find_one({"_id": answer["userId"]})
            if user:
                answer["username"] = user.get("username")
            else:
                answer["username"] = "Unknown"

        return jsonify(answers)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/answers/<answer_id>', methods=['PUT'])
@jwt_required() 
def update_answer(answer_id):
    try:
        user_id = get_jwt_identity()

        data = request.get_json()
        content = data['content']

        answer = answers_collection.find_one({"_id": answer_id})
        if not answer:
            return jsonify({"error": "Answer not found"}), 404

        if str(answer["userId"]) != str(user_id):
            return jsonify({"error": "Unauthorized to update this answer"}), 403

        answers_collection.update_one(
            {"_id": answer_id},
            {"$set": {"content": content, "updatedAt": datetime.now()}}
        )

        answer["content"] = content
        answer["updatedAt"] = datetime.now()

        return jsonify(answer)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/answers/<answer_id>', methods=['DELETE'])
@jwt_required()  
def delete_answer(answer_id):
    try:
        user_id = get_jwt_identity()

        answer = answers_collection.find_one({"_id": answer_id})
        if not answer:
            return jsonify({"error": "Answer not found"}), 404

        if str(answer["userId"]) != str(user_id):
            return jsonify({"error": "Unauthorized to delete this answer"}), 403

        answers_collection.delete_one({"_id": answer_id})

        return jsonify({"message": "Answer deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/api/votes/<answer_id>', methods=['POST'])
def cast_vote(answer_id):
    try:
        data = request.get_json()
        vote_type = data.get('voteType')
        user_id = data.get('userId')

        if vote_type not in ['up', 'down']:
            return jsonify({"error": "Invalid vote type"}), 400

        if not ObjectId.is_valid(answer_id) or not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid ID format"}), 400

        existing_vote = votes_collection.find_one({
            "answerId": ObjectId(answer_id),
            "userId": ObjectId(user_id)
        })

        if existing_vote:
            votes_collection.update_one(
                {"_id": existing_vote["_id"]},
                {"$set": {"voteType": vote_type, "updatedAt": datetime.utcnow()}}
            )
        else:
            new_vote = {
                "answerId": ObjectId(answer_id),
                "userId": ObjectId(user_id),
                "voteType": vote_type,
                "createdAt": datetime.utcnow()
            }
            votes_collection.insert_one(new_vote)

        return jsonify({"message": "Vote cast successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/votes/<answer_id>', methods=['GET'])
def get_votes(answer_id):
    try:
        if not ObjectId.is_valid(answer_id):
            return jsonify({"error": "Invalid ID format"}), 400

        upvotes = votes_collection.count_documents({"answerId": ObjectId(answer_id), "voteType": "up"})
        downvotes = votes_collection.count_documents({"answerId": ObjectId(answer_id), "voteType": "down"})

        return jsonify({"upvotes": upvotes, "downvotes": downvotes}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5001)
