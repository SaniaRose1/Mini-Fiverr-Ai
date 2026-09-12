import os

from dotenv import load_dotenv
from pymongo import MongoClient

from langchain_core.documents import Document

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS




load_dotenv()

MONGO_URI = os.getenv("Mongo_Uri")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

TASK_COLLECTION = "tasks"

INDEX_SAVE_DIR = "faiss_index"

WEBSITE_FILE = "website_info.txt"




def load_website_information():

    print("Loading website information...")

    if not os.path.exists(WEBSITE_FILE):

        print(
            f"ERROR: {WEBSITE_FILE} not found."
        )

        return []


    with open(
        WEBSITE_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        text = file.read()


    document = Document(
        page_content=text,

        metadata={
            "source": "website"
        }
    )


    print("Website information loaded.")

    return [document]




def load_tasks_from_mongodb():

    print("Connecting to MongoDB...")

    client = MongoClient(MONGO_URI)

    db = client[MONGO_DB_NAME]

    collection = db[TASK_COLLECTION]

    tasks = list(collection.find())

    print(
        f"Total tasks found: {len(tasks)}"
    )


    documents = []


    for task in tasks:

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

        issueDate = task.get(
                    "issueDate",
                    ""
                )

        deadlineDate = task.get(
                    "deadlineDate",
                    ""
                )

       


        # Convert skills to text

        if isinstance(skills, list):

            skills_text = ", ".join(
                str(skill)
                for skill in skills
            )

        else:

            skills_text = str(skills)


       

        text = f"""
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
{issueDate}

Deadline Date:
{deadlineDate}
"""


        document = Document(

            page_content=text,

            metadata={

                "source": "mongodb_task",

                "task_id": str(
                    task.get("_id")
                ),

                "title": title,

                "description": description,

                "skills_text": skills_text,

                "budget": budget,

                "issueDate": issueDate,

                "deadlineDate": deadlineDate
               
            }
        )


        documents.append(document)


    client.close()


    print(
        f"Created {len(documents)} task documents."
    )


    return documents




def create_faiss_index():

    print("\n========== STARTING INGESTION ==========\n")


    # Website documents

    website_documents = (
        load_website_information()
    )


    # MongoDB task documents

    task_documents = (
        load_tasks_from_mongodb()
    )


    # Combine everything

    all_documents = (
        website_documents +
        task_documents
    )


    print(
        f"\nTotal documents for FAISS: "
        f"{len(all_documents)}"
    )


    if len(all_documents) == 0:

        print(
            "No documents available."
        )

        return


    

    print(
        "\nLoading embedding model..."
    )


    embeddings = HuggingFaceEmbeddings(

        model_name=
        "sentence-transformers/all-MiniLM-L6-v2"
    )


    

    print(
        "\nCreating FAISS index..."
    )


    vector_store = FAISS.from_documents(

        all_documents,

        embeddings
    )


    

    vector_store.save_local(
        INDEX_SAVE_DIR
    )


    print(
        "\n===================================="
    )

    print(
        "FAISS INDEX CREATED SUCCESSFULLY"
    )

    print(
        f"Saved at: {INDEX_SAVE_DIR}/"
    )

    print(
        "===================================="
    )




if __name__ == "__main__":

    create_faiss_index()