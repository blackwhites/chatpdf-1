# -*- coding:utf-8 -*-

import time
from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session

import crud
import schemas

from utils import (
    get_hashed_password,
    create_access_token,
    create_refresh_token,
    verify_password
)

from deps import get_current_user, get_db

router = APIRouter()


@router.post('/signup', summary="Create new user")
async def create_user(data: schemas.UserRegister, db: Session = Depends(get_db)):
    # check username if it existed
    user = crud.get_user_by_username(db, data.username)
    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this name already exist"
        )

    hashed_password = get_hashed_password(data.password)
    new_user = data.dict()
    new_user['password'] = hashed_password

    try:
        # create user
        user_create = schemas.UserCreate(**new_user)
        print(create_user)
        crud.create_user(db, user_create)
        print("ok1")
        # return
        return schemas.Response(msg="user created successfully", data={
            "access_token": create_access_token(data.username),
            "refresh_token": create_refresh_token(data.username),
        })

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post('/login', summary="Create access and refresh tokens for user")
async def login(user: schemas.UserAuth, db: Session = Depends(get_db)):
    data = crud.get_user_by_username(db, user.username)
    if data is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    if not verify_password(user.password, data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    return schemas.Response(data={
        "access_token": create_access_token(user.username),
        "refresh_token": create_refresh_token(user.username),
    })


@router.get('/me', summary='Get details of currently logged in user')
async def get_me(user: schemas.UserData = Depends(get_current_user)):
    data = user.dict()
    del data['password']
    return schemas.Response(data=data)


@router.get("/existed/{username}", summary="Check if user exists")
async def check_user_exists(username: str, db: Session = Depends(get_db)):
    # 检查是否保留用户名
    for i in ['admin', 'root', 'administrator', 'superuser', 'super', 'user', 'test', 'demo']:
        if i == username:
            return schemas.Response(data=True)

    user = crud.get_user_by_username(db, username)
    return schemas.Response(data=user is not None)


@router.get('/book/{count}', summary="Add book to user's bookshelf")
async def add_book(count: int, user: schemas.UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    recording = crud.get_book_by_uid(db, user.id)
    if recording is None:
        crud.create_book(db, schemas.BookCreate(uid=user.id, months=count, email=user.email))
        return schemas.Response(msg="ok")
    return schemas.Response(msg="ok", code=1)

