from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔑 Put your Groq API key here
client = Groq(
   api_key=os.getenv("GROQ_API_KEY")
)

@app.route("/")
def home():
    return "Backend Running Successfully"

@app.route("/chat", methods=["POST"])
def chat():

    try:
        # Get user message from frontend
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Call Groq LLM
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        reply = response.choices[0].message.content

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({
            "error": str(e)
        }), 500


# if __name__ == "__main__":
#     app.run(debug=True)