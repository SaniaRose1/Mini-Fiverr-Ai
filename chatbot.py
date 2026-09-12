import os



os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from groq import Groq




load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing.")




INDEX_SAVE_DIR = "faiss_index"

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Keep CPU usage low on Render
os.environ["CUDA_VISIBLE_DEVICES"] = ""




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
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============================================================
# GROQ CLIENT
# ============================================================

client = Groq(
    api_key=GROQ_API_KEY
)




embeddings = None
vector_store = None




def load_rag():

    global embeddings
    global vector_store

    # Already loaded
    if embeddings is not None and vector_store is not None:
        return

    print("==============================================")
    print("Loading MiniFiverr RAG system...")
    print("==============================================")

    

    if not os.path.exists(INDEX_SAVE_DIR):

        raise FileNotFoundError(
            f"FAISS index folder '{INDEX_SAVE_DIR}' was not found."
        )

    

    print("Loading embedding model...")

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={
            "device": "cpu"
        },
        encode_kwargs={
            "normalize_embeddings": True,
            "batch_size": 1
        }
    )

    print("Embedding model loaded.")

    

    print("Loading FAISS index...")

    vector_store = FAISS.load_local(
        INDEX_SAVE_DIR,
        embeddings,
        allow_dangerous_deserialization=True
    )

    print("FAISS index loaded.")

    print("==============================================")
    print("RAG system ready.")
    print("==============================================")




def search_faiss(question):

    load_rag()

    documents = vector_store.similarity_search(
        question,
        k=3
    )

    if not documents:
        return "No relevant information was found."

    context_parts = []

    for doc in documents:

        if doc.page_content:

            context_parts.append(
                doc.page_content
            )

    if not context_parts:

        return "No relevant information was found."

    context = "\n\n".join(context_parts)

    return context




def generate_answer(
    question,
    context,
    user_information=""
):

    system_prompt = """
You are the MiniFiverr Website Assistant.

MiniFiverr is a freelancing platform where:

- Posters can create tasks.
- Freelancers can browse and apply for tasks.
- Posters can view applicants.
- Posters can select freelancers.
- Users can manage their profiles.
- Users can track their work and applications.

Your job is to answer questions about the MiniFiverr website.

IMPORTANT RULES:

1. Use the provided context to answer the question.
2. Do not invent information.
3. If the information is not available, clearly say that you don't have that information.
4. Give simple and helpful answers.
5. Keep answers concise unless the user asks for details.
6. Never reveal passwords, API keys, JWT tokens, or other secrets.
7. If user information is provided, use it only to answer questions about that user.
8. Do not expose private information belonging to another user.
"""

    

    if user_information:

        system_prompt += f"""

Information about the currently logged-in user:

{user_information}

Use this information only when the user's question
requires information about themselves.
"""


   

    user_prompt = f"""
Website knowledge and retrieved information:

{context}

User question:

{question}

Answer the user based only on the available information.
"""


    

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


    answer = response.choices[0].message.content

    return answer




def ask_chatbot(
    question,
    user_information=""
):

    # Retrieve relevant documents
    context = search_faiss(question)

    # Generate answer using Groq
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
        "message": "MiniFiverr AI Assistant is running"
    }




@app.post("/chat")
def chat(request: ChatRequest):

    try:

        question = request.question.strip()

        if not question:

            return {
                "answer": "Please enter a question."
            }

        answer = ask_chatbot(
            question,
            request.user_information
        )

        return {
            "answer": answer
        }

    except Exception as error:

        print("Chatbot error:", error)

        return {
            "answer": "Sorry, something went wrong while generating the answer."
        }




if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "chatbot:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=False
    )
