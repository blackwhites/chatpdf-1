# -*- coding:utf-8 -*-

from datetime import datetime
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from utils import (
    ALGORITHM,
    JWT_SECRET_KEY
)

from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session
from database import SessionLocal, SessionRedis
import crud
import schemas

reuse_oauth = OAuth2PasswordBearer(
    tokenUrl="/user/login",
    scheme_name="JWT",
    auto_error=False
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




async def get_current_user(token: str = Depends(reuse_oauth), db: Session = Depends(get_db)) -> object:
    try:
        payload = jwt.decode(
            token, JWT_SECRET_KEY, algorithms=[ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
        # 检查过期时间
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except(jwt.JWTError, ValidationError):
        # 如果token不合法
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_user_by_username(db, token_data.sub)

    if user is None:
        return None

    return schemas.UserData(
        id = user.id,
        username = user.username,
        email = user.email,
        password = user.password,
        sub_status = user.sub_status,
        sub_start = user.sub_start,
        sub_end = user.sub_end
    )


def check_user_count(ip, pdf: bool = False, question: bool = False, vip: bool = False):
    """
    1. 检查当日上传PDF数量，游客最多一个, VIP最多 10 个
    2. 检查question 数量, 游客不可超过9个, VIP 256 个
    """
    name = "pdf" if pdf else "question"
    key = f"{ip}:{name}"

    """简化版的逻辑
    if pdf and vip:
        max_count = 10
    elif question and vip:
        max_count = 256
    elif pdf and not vip:
        max_count = 1
    elif question and not vip:
        max_count = 15"""
    max_count = 10 if pdf and vip else 256 if question and vip else 50 if pdf and not vip else 15
    print("@", vip, pdf, question, max_count)

    count = SessionRedis.get(key)
    if count is None:
        SessionRedis.set(key, 1, ex=60*60*20)
    else:
        if int(count) >= max_count:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail = "Too many questions asked" if question else "Too many PDFs uploaded",
                headers={"WWW-Authenticate": "Bearer"},
            )
        else:
            SessionRedis.incr(key)

def check_jwt(token):
    try:
        payload = jwt.decode(
            token, JWT_SECRET_KEY, algorithms=[ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
        print(payload)
    except Exception as e:
        print(e)
        raise e
    return token_data


async def validate_user_pdf(req: Request, token: str = Depends(reuse_oauth), db: Session = Depends(get_db)) -> object:
    ip = req.client.host
    try:
        token_data = check_jwt(token)
        user = crud.get_user_by_username(db, token_data.sub)
        if (user is None) or user.sub_status == -1 or user.sub_end < datetime.now() or user.sub_status == 0:
            print("判断为未开通会员的用户", ip)
            check_user_count(ip, pdf=True)
        else:
            print("判断为会员用户", ip)
            check_user_count(ip, pdf=True, vip=True)

    except Exception as e:
        check_user_count(ip, pdf=True)
        print(e)
    return None


async def validate_user_question(req: Request, token: str = Depends(reuse_oauth), db: Session = Depends(get_db)) -> object:
    ip = req.client.host
    try:
        token_data = check_jwt(token)
        user = crud.get_user_by_username(db, token_data.sub)
        if (user is None) or user.sub_status == -1 or user.sub_end < datetime.now() or user.sub_status == 0:
            print("判断为未开通会员的用户", ip)
            check_user_count(ip, question=True)
        else:
            print("判断为会员用户", ip)
            check_user_count(ip, question=True, vip=True)

    except Exception as e:
        check_user_count(ip, question=True)
        print(e)

    return None
