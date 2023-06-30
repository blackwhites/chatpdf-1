# -*- coding:utf-8 -*-

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
import schemas
from database import engine
from routers import user, upload, chat, search

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(search.router, prefix="/search", tags=["search"])



@app.get("/")
async def get_root():
    return schemas.Response()

