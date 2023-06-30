# -*- coding=utf-8

import re
import os
import socket
import struct
import sys
import base64
import hashlib
from jose import jwt
from typing import Union, Any
from passlib.context import CryptContext
from datetime import datetime, timedelta


ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 14  # 14 days
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 14  # 14 days
ALGORITHM = "HS256"
JWT_SECRET_KEY = os.getenv("jwt_key")
JWT_REFRESH_SECRET_KEY = os.getenv("jwt_refresh_key")

# 请提前创建这些目录
STATIC_FILES = "/app/data/pinkglow/static"

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)

    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def is_email(email: str) -> bool:
    """
    判断是否为邮箱
    :param email:
    :return:
    """
    if re.match(r"^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,"
                r"3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$", email) is not None:
        return True
    return False


def is_username(username: str) -> bool:
    """
    判断是否为用户名
    :param username:
    :return:
    """
    if re.match("^[a-zA-Z0-9_-]{4,16}$", username) is not None:
        return True
    return False


def str2md5(string: str) -> str:
    """
    将字符串转换为md5
    :param string:
    :return:
    """
    return hashlib.md5(string.encode("utf-8")).hexdigest()


def calc_buf_md5(buf) -> str:
    """
    计算文件的md5
    :param buf:
    :return:
    """
    return hashlib.md5(buf).hexdigest()




def get_static_file_path(file_type: str, file_name: str) -> str:
    """
    获取静态文件的绝对路径
    :param file_type:
    :param file_name:
    :return:
    """
    return os.path.join(STATIC_FILES, file_type, file_name)


def ip2int(ip: str) -> int:
    return struct.unpack("!I", socket.inet_aton(ip))[0]