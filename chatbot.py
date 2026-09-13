import os
import re

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pymongo import MongoClient
from groq import Groq




load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGO_URI = os.getenv("Mongo_Uri")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")


if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing.")


if not MONGO_URI:
    raise ValueError("Mongo_Uri is missing.")


if not MONGO_DB_NAME:
    raise ValueError("MONGO_DB_NAME is missing.")




app = FastAPI(
    title="MiniFiverr AI Assistant",
    description="AI chatbot API for MiniFiverr",
    version="1.0"
)




frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        frontend_url,
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)




client = Groq(
    api_key=GROQ_API_KEY
)




WEBSITE_FILE = "website_info.txt"


def load_website_information():

    print(
        "Loading website information...",
        flush=True
    )

    if not os.path.exists(WEBSITE_FILE):

        print(
            f"ERROR: {WEBSITE_FILE} not found.",
            flush=True
        )

        return ""


    try:

        with open(
            WEBSITE_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            text = file.read()


        print(
            "Website information loaded successfully.",
            flush=True
        )


        return text


    except Exception as e:

        print(
            "Website information error:",
            repr(e),
            flush=True
        )

        return ""


# Load website information once
website_information = load_website_information()




def get_words(text):

    return set(
        re.findall(
            r"[a-zA-Z0-9]+",
            str(text).lower()
        )
    )


def search_tasks(question):

    print(
        "Searching MongoDB tasks...",
        flush=True
    )


    mongo_client = None


    try:

        mongo_client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000
        )


        # Check connection
        mongo_client.admin.command(
            "ping"
        )


        db = mongo_client[
            MONGO_DB_NAME
        ]


        collection = db[
            "tasks"
        ]


        tasks = list(
            collection.find().limit(50)
        )


        print(
            f"MongoDB tasks found: {len(tasks)}",
            flush=True
        )


        if not tasks:

            return ""


        question_words = get_words(
            question
        )


        scored_tasks = []


        for task in tasks:

            title = str(
                task.get(
                    "title",
                    ""
                )
            )


            description = str(
                task.get(
                    "description",
                    ""
                )
            )


            skills = task.get(
                "skill",
                []
            )


            budget = str(
                task.get(
                    "budget",
                    ""
                )
            )


            issue_date = str(
                task.get(
                    "issueDate",
                    ""
                )
            )


            deadline_date = str(
                task.get(
                    "deadlineDate",
                    ""
                )
            )


            # Convert skills to text

            if isinstance(
                skills,
                list
            ):

                skills_text = ", ".join(
                    str(skill)
                    for skill in skills
                )

            else:

                skills_text = str(
                    skills
                )


            task_text = f"""
            {title}
            {description}
            {skills_text}
            {budget}
            """


            task_words = get_words(
                task_text
            )


            score = len(
                question_words.intersection(
                    task_words
                )
            )


            # Extra matching for title

            question_lower = question.lower()


            if title.lower() in question_lower:

                score += 10


            # Extra matching for skills

            if isinstance(
                skills,
                list
            ):

                for skill in skills:

                    skill_text = str(
                        skill
                    ).lower()


                    if (
                        skill_text
                        and
                        skill_text in question_lower
                    ):

                        score += 5


            scored_tasks.append(
                (
                    score,
                    task
                )
            )


        # Highest score first

        scored_tasks.sort(
            key=lambda item: item[0],
            reverse=True
        )


        # Check whether user is asking about tasks

        task_words = [
            "task",
            "tasks",
            "job",
            "jobs",
            "work",
            "available",
            "budget",
            "deadline",
            "skill"
        ]


        asks_about_tasks = any(
            word in question_lower
            for word in task_words
        )


        # Select relevant tasks

        if asks_about_tasks:

            selected_tasks = [
                task
                for score, task
                in scored_tasks[:5]
            ]

        else:

            selected_tasks = [
                task
                for score, task
                in scored_tasks[:3]
                if score > 0
            ]


        if not selected_tasks:

            return ""


        context_parts = []


        for task in selected_tasks:

            title = task.get(
                "title",
                ""
            )


            description = task.get(
                "description",
                ""
            )


            skills = task.get(
                "skill",
                []
            )


            budget = task.get(
                "budget",
                ""
            )


            issue_date = task.get(
                "issueDate",
                ""
            )


            deadline_date = task.get(
                "deadlineDate",
                ""
            )


            if isinstance(
                skills,
                list
            ):

                skills_text = ", ".join(
                    str(skill)
                    for skill in skills
                )

            else:

                skills_text = str(
                    skills
                )


            task_information = f"""
TASK

Title:
{title}

Description:
{description}

Required Skills:
{skills_text}

Budget:
{budget}

Issue Date:
{issue_date}

Deadline Date:
{deadline_date}
"""


            context_parts.append(
                task_information
            )


        return "\n\n".join(
            context_parts
        )


    except Exception as e:

        print(
            "MongoDB search error:",
            repr(e),
            flush=True
        )

        return ""


    finally:

        if mongo_client:

            mongo_client.close()




def get_context(question):

    print(
        "Getting MiniFiverr information...",
        flush=True
    )


    context = ""


   

    if website_information:

        context += f"""

MINIFIVERR WEBSITE KNOWLEDGE

{website_information}

"""


   

    task_context = search_tasks(
        question
    )


    if task_context:

        context += f"""

MONGODB TASK INFORMATION

{task_context}

"""


   

    if not context:

        context = """
No MiniFiverr information was found.
"""


    print(
        "Context prepared successfully.",
        flush=True
    )


    return context



def generate_answer(
    question,
    context,
    user_information=""
):


    system_prompt = """
You are the official MiniFiverr AI Assistant.

You help users understand and use the MiniFiverr
freelancing website.

The MiniFiverr website knowledge is provided
in the user message.

IMPORTANT RULES:

1. Always use the provided MiniFiverr website
   knowledge when answering website questions.

2. Do NOT give generic answers if the website
   knowledge contains the answer.

3. Do NOT invent features that are not present
   in the provided information.

4. Do NOT invent task information.

5. If the user asks about freelancers, use the
   FREELANCER section.

6. If the user asks about posters, use the
   POSTER section.

7. If the user asks how to create a task, use
   the CREATING A TASK section.

8. If the user asks how to apply for a task,
   use the APPLYING FOR A TASK section.

9. If the user asks about profiles, use the
   PROFILE section.

10. If the user asks about ratings, use the
    RATINGS section.

11. If the user asks about task statuses, use
    the TASK STATUS section.

12. If the user asks about available tasks,
    use the MongoDB task information when available.

13. If the user asks about themselves, use the
    logged-in user information.

14. Never reveal passwords.

15. Never reveal JWT tokens.

16. Never reveal API keys.

17. Never reveal secrets.

18. Never expose another user's private information.

19. Answer naturally and professionally.

20. Keep normal answers concise.

21. If the user asks for steps, provide numbered steps.

22. If the user asks for a list, use bullet points.

23. If information is unavailable, clearly say
    that the information is not available.

24. Do not say "according to the context".

25. Respond as the MiniFiverr assistant directly.
"""



    if user_information:

        system_prompt += f"""

CURRENTLY LOGGED-IN USER INFORMATION:

{user_information}

This information belongs to the currently
logged-in user.

Use it only when the user asks about their
own information.

For example:

"Tell me about myself."

"What is my name?"

"What is my email?"

"What is my role?"

"What are my skills?"
"""


  

    user_prompt = f"""
MINIFIVERR WEBSITE AND TASK INFORMATION:

{context}


USER QUESTION:

{question}


Now answer the user's question using the
MiniFiverr information provided above.
"""


    print(
        "Sending question to Groq...",
        flush=True
    )


    try:

        response = client.chat.completions.create(

            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },

                {
                    "role": "user",
                    "content": user_prompt
                }
            ],

            temperature=0.2,

            max_tokens=400
        )


        answer = response.choices[
            0
        ].message.content


        print(
            "Groq answer received.",
            flush=True
        )


        return answer


    except Exception as e:

        print(
            "Groq error:",
            repr(e),
            flush=True
        )


        return (
            "Sorry, I could not generate an answer "
            "right now."
        )




def ask_chatbot(
    question,
    user_information=""
):


    context = get_context(
        question
    )


    answer = generate_answer(
        question,
        context,
        user_information
    )


    return answer




class ChatRequest(BaseModel):

    question: str

    user_information: str = ""




@app.get("/")
def home():

    return {
        "message":
        "MiniFiverr AI Assistant is running"
    }




@app.post("/chat")
def chat(
    request: ChatRequest
):

    try:

        question = request.question.strip()


        if not question:

            return {
                "answer":
                "Please enter a question."
            }


        print(
            "======================================",
            flush=True
        )


        print(
            "NEW CHAT QUESTION:",
            question,
            flush=True
        )


        answer = ask_chatbot(
            question,
            request.user_information
        )


        print(
            "CHAT COMPLETED",
            flush=True
        )


        return {
            "answer": answer
        }


    except Exception as e:

        print(
            "🔥 CHATBOT ERROR:",
            repr(e),
            flush=True
        )


        return {
            "answer":
            "AI server error",

            "error":
            str(e)
        }




if __name__ == "__main__":

    import uvicorn


    uvicorn.run(

        "chatbot:app",

        host="0.0.0.0",

        port=int(
            os.environ.get(
                "PORT",
                8000
            )
        ),

        reload=False
    )