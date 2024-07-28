from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from xxx import ai_control

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify allowed domains if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    queryText: str

@app.post("/photoControl")
async def hello(query: Query):
    query_text = query.queryText #this will be link
    print("text "+ query_text) # print for control
    sonuc = xxx(query_text)
    print("text "+ sonuc)
    return JSONResponse(content={"message": sonuc})

@app.post("/textControl")
async def hello(query: Query):
    query_text = query.queryText
    print("text "+ query_text)
    sonuc = xxx(query_text)
    print("text "+ sonuc)
    return JSONResponse(content={"message": sonuc})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
