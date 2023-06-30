# -*- coding:utf-8 -*-

from typing import Any, Union, List, Optional
from pydantic import BaseModel, Field, ValidationError, validator
from utils import is_email
from datetime import datetime


class Response(BaseModel):
    code: int = 0
    msg: str = 'success'
    data: Any = None


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None


class UserBase(BaseModel):
    username: str
    email: Optional[str]

    @validator('username')
    def user_name_must_be_alphanumeric_and_len_between_four_and_sixteen(cls, v):
        # 用户名只能是字母或数字
        if not v.isalnum():
            raise ValueError('must be alphanumeric')
        # 长度检查
        if len(v) < 4 or len(v) > 16:
            raise ValueError('must be between 4 and 16 characters')
        return v

    @validator('email')
    def email_must_be_valid(cls, v):
        if not is_email(v):
            raise ValueError('must be a valid email address')
        return v


class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=16)

    @validator('password')
    def password_must_be_len_between_six_and_sixteen(cls, v):
        if len(v) < 6 or len(v) > 16:
            raise ValueError('must be between 6 and 16 characters')
        return v


class UserAuth(UserBase):
    password: str


class UserCreate(UserAuth):
    sub_status: int = -1
    sub_start: datetime = None
    sub_end: datetime = None


class UserData(UserCreate):
    id: int


class PdfFileCreate(BaseModel):
    name: str
    sign: str
    size: int
    user_id: int = 0
    ip: int


class Chat(BaseModel):
    sign: str
    content: str


class String(BaseModel):
    value: str


class BookCreate(BaseModel):
    uid: int
    email: str
    months: int