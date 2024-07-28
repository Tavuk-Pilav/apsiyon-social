from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase initialization
cred = credentials.Certificate("C:\\Users\\elifn\\OneDrive\\Belgeler\\GitHub\\Apsiyon_Social\\ApsiyonSocial\\BackendSource\\Controller\\Models\\FireBaseUtil\\serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://apsiyonsocial-default-rtdb.firebaseio.com/'
})
ref = db.reference()

# Pydantic models
class Query(BaseModel):
    queryText: str

class UserGroup(BaseModel):
    user_id: str
    group_id: str

class NewGroup(BaseModel):
    name: str

class NewPost(BaseModel):
    group: str
    image: str
    text: str
    user_id: str

class NewLike(BaseModel):
    post_id: str
    user_id: str

class NewComment(BaseModel):
    item_id: str
    text: str
    user_id: str

class Follow(BaseModel):
    follower_id: str
    followed_id: str

class Block(BaseModel):
    blocked_id: str
    blocker_id: str

# Firebase functions
def get_user_name(user_id):
    return ref.child("users").child(user_id).child("name").get()

def get_user_groups(user_id):
    return ref.child("users").child(user_id).child("groups").get()

def add_user_to_group(user_id, group_id):
    user_ref = ref.child("users").child(user_id)
    groups = user_ref.child("groups").get() or []
    if group_id not in groups:
        groups.append(group_id)
        user_ref.update({"groups": groups})

def get_group_name(group_id):
    return ref.child("groups").child(group_id).child("name").get()

def add_new_group(name):
    new_group_ref = ref.child("groups").push()
    new_group_ref.set({"name": name})
    return new_group_ref.key

def get_post_image(post_id):
    return ref.child("posts").child(post_id).child("image").get()

def get_post_user_id(post_id):
    return ref.child("posts").child(post_id).child("user_id").get()

def get_post_text(post_id):
    return ref.child("posts").child(post_id).child("text").get()

def get_posts_by_group(group_id):
    return ref.child("posts").order_by_child("group").equal_to(group_id).get()

def get_posts_by_user(user_id):
    return ref.child("posts").order_by_child("user_id").equal_to(user_id).get()

def get_posts_from_user_groups(user_id):
    user_groups = get_user_groups(user_id)
    all_posts = []
    for group_id in user_groups:
        group_posts = get_posts_by_group(group_id)
        all_posts.extend(group_posts.values() if group_posts else [])
    return all_posts

def create_new_post(post_data):
    new_post_ref = ref.child("posts").push()
    new_post_ref.set(post_data)
    return new_post_ref.key

def get_post_like_count(post_id):
    likes = ref.child("likes").order_by_child("postId").equal_to(post_id).get()
    return len(likes) if likes else 0

def get_first_like_user(post_id):
    likes = ref.child("likes").order_by_child("postId").equal_to(post_id).limit_to_first(1).get()
    if likes:
        first_like = next(iter(likes.values()))
        return get_user_name(first_like["userId"])
    return None

def add_like(post_id, user_id):
    new_like_ref = ref.child("likes").push()
    new_like_ref.set({"postId": post_id, "userId": user_id})
    return new_like_ref.key

def get_post_comment_ids(post_id):
    comments = ref.child("comments").order_by_child("item_id").equal_to(post_id).get()
    return list(comments.keys()) if comments else []

def get_comment_user_id(comment_id):
    return ref.child("comments").child(comment_id).child("user_id").get()

def get_comment_text(comment_id):
    return ref.child("comments").child(comment_id).child("text").get()

def add_new_comment(comment_data):
    new_comment_ref = ref.child("comments").push()
    new_comment_ref.set(comment_data)
    return new_comment_ref.key

def check_follow(follower_id, followed_id):
    follow = ref.child("Follow").order_by_child("follower").equal_to(follower_id).get()
    if follow:
        for f in follow.values():
            if f["followed"] == followed_id:
                return True
    return False

def add_follow(follower_id, followed_id):
    new_follow_ref = ref.child("Follow").push()
    new_follow_ref.set({"follower": follower_id, "followed": followed_id})
    return new_follow_ref.key

def check_block(blocked_id, blocker_id):
    block = ref.child("Blocks").order_by_child("blocker_id").equal_to(blocker_id).get()
    if block:
        for b in block.values():
            if b["blocked_id"] == blocked_id:
                return True
    return False

def add_block(blocked_id, blocker_id):
    new_block_ref = ref.child("Blocks").push()
    new_block_ref.set({"blocked_id": blocked_id, "blocker_id": blocker_id})
    return new_block_ref.key

# FastAPI routes
@app.post("/photoControl")
async def photo_control(query: Query):
    query_text = query.queryText  # this will be link
    print("text " + query_text)  # print for control
    # Implement your photo control logic here
    sonuc = "Photo control result"  # Replace with actual logic
    print("text " + sonuc)
    return JSONResponse(content={"message": sonuc})

@app.post("/textControl")
async def text_control(query: Query):
    query_text = query.queryText
    print("text " + query_text)
    # Implement your text control logic here
    sonuc = "Text control result"  # Replace with actual logic
    print("text " + sonuc)
    return JSONResponse(content={"message": sonuc})

@app.get("/user/{user_id}")
async def get_user(user_id: str):
    name = get_user_name(user_id)
    groups = get_user_groups(user_id)
    return JSONResponse(content={"name": name, "groups": groups})

@app.post("/user/group")
async def add_user_to_group_route(user_group: UserGroup):
    add_user_to_group(user_group.user_id, user_group.group_id)
    return JSONResponse(content={"message": "User added to group successfully"})

@app.get("/group/{group_id}")
async def get_group(group_id: str):
    name = get_group_name(group_id)
    return JSONResponse(content={"name": name})

@app.post("/group")
async def create_group(new_group: NewGroup):
    group_id = add_new_group(new_group.name)
    return JSONResponse(content={"group_id": group_id})

@app.get("/post/{post_id}")
async def get_post(post_id: str):
    image = get_post_image(post_id)
    user_id = get_post_user_id(post_id)
    text = get_post_text(post_id)
    return JSONResponse(content={"image": image, "user_id": user_id, "text": text})

@app.post("/post")
async def create_post(new_post: NewPost):
    post_id = create_new_post(new_post.dict())
    return JSONResponse(content={"post_id": post_id})

@app.get("/posts/group/{group_id}")
async def get_group_posts(group_id: str):
    posts = get_posts_by_group(group_id)
    return JSONResponse(content={"posts": posts})

@app.get("/posts/user/{user_id}")
async def get_user_posts(user_id: str):
    posts = get_posts_by_user(user_id)
    return JSONResponse(content={"posts": posts})

@app.get("/posts/user/{user_id}/groups")
async def get_user_group_posts(user_id: str):
    posts = get_posts_from_user_groups(user_id)
    return JSONResponse(content={"posts": posts})

@app.get("/likes/{post_id}")
async def get_likes(post_id: str):
    count = get_post_like_count(post_id)
    first_user = get_first_like_user(post_id)
    return JSONResponse(content={"count": count, "first_user": first_user})

@app.post("/like")
async def add_like_route(new_like: NewLike):
    like_id = add_like(new_like.post_id, new_like.user_id)
    return JSONResponse(content={"like_id": like_id})

@app.get("/comments/{post_id}")
async def get_comments(post_id: str):
    comment_ids = get_post_comment_ids(post_id)
    return JSONResponse(content={"comment_ids": comment_ids})

@app.post("/comment")
async def add_comment(new_comment: NewComment):
    comment_id = add_new_comment(new_comment.dict())
    return JSONResponse(content={"comment_id": comment_id})

@app.post("/follow")
async def follow_user(follow: Follow):
    exists = check_follow(follow.follower_id, follow.followed_id)
    if not exists:
        follow_id = add_follow(follow.follower_id, follow.followed_id)
        return JSONResponse(content={"follow_id": follow_id})
    return JSONResponse(content={"message": "Already following"})

@app.post("/block")
async def block_user(block: Block):
    exists = check_block(block.blocked_id, block.blocker_id)
    if not exists:
        block_id = add_block(block.blocked_id, block.blocker_id)
        return JSONResponse(content={"block_id": block_id})
    return JSONResponse(content={"message": "Already blocked"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)