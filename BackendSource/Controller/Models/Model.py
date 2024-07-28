from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union, Dict
import uvicorn
from firebase_admin import credentials, db, initialize_app

app = FastAPI()

# Firebase configuration
cred = credentials.Certificate("C:\\Users\\elifn\\OneDrive\\Belgeler\\GitHub\\Apsiyon_Social\\ApsiyonSocial\\BackendSource\\Controller\\Models\\FireBaseUtil\\serviceAccountKey.json")
initialize_app(cred, {
    'databaseURL': 'https://apsiyonsocial-default-rtdb.firebaseio.com/'
})

# Data models
class User(BaseModel):
    id: str
    name: str
    groups: Union[List[str], Dict[str, str]]

class Group(BaseModel):
    id: str
    name: str

class Post(BaseModel):
    id: str
    image: str
    user_id: str
    text: str
    group: str

class Comment(BaseModel):
    id: str
    user_id: str
    text: str
    item_id: str

class Like(BaseModel):
    userId: str
    postId: str

# Helper functions
def get_ref(path):
    return db.reference(path)

# Endpoints
@app.get("/users", response_model=List[User])
async def get_users():
    users_ref = get_ref('users')
    users = users_ref.get()
    result = []
    if isinstance(users, list):
        for i, user in enumerate(users):
            if user:
                user_dict = dict(user)
                user_dict['id'] = user_dict.get('id', str(i))
                result.append(User(**user_dict))
    else:
        for k, v in users.items():
            if v:
                user_dict = dict(v)
                user_dict['id'] = k
                result.append(User(**user_dict))
    return result

@app.get("/groups", response_model=List[Group])
async def get_groups():
    groups_ref = get_ref('groups')
    groups = groups_ref.get()
    if isinstance(groups, list):
        return [Group(**group) for group in groups]
    else:
        return [Group(id=k, **v) for k, v in groups.items()]

@app.get("/posts", response_model=List[Post])
async def get_posts():
    posts_ref = get_ref('posts')
    posts = posts_ref.get()
    if isinstance(posts, list):
        return [Post(**post) for post in posts]
    else:
        return [Post(id=k, **v) for k, v in posts.items()]

@app.get("/comments", response_model=List[Comment])
async def get_comments():
    comments_ref = get_ref('comments')
    comments = comments_ref.get()
    if isinstance(comments, list):
        return [Comment(**comment) for comment in comments]
    else:
        return [Comment(id=k, **v) for k, v in comments.items()]

@app.get("/likes", response_model=List[Like])
async def get_likes():
    likes_ref = get_ref('likes')
    likes = likes_ref.get()
    if likes:
        return [Like(**v) for v in likes.values()]
    return []

@app.post("/likes")
async def add_like(like: Like):
    likes_ref = get_ref('likes')
    new_like_ref = likes_ref.push()
    new_like_ref.set(like.dict())
    return {"message": "Like added successfully"}

@app.delete("/likes/{post_id}/{user_id}")
async def remove_like(post_id: str, user_id: str):
    likes_ref = get_ref('likes')
    likes = likes_ref.get()
    if likes:
        for key, value in likes.items():
            if value['postId'] == post_id and value['userId'] == user_id:
                likes_ref.child(key).delete()
                return {"message": "Like removed successfully"}
    raise HTTPException(status_code=404, detail="Like not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)