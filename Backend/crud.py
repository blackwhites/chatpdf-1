# -*- coding:utf-8 -*-
import math

from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from database import engine
from pymysql.converters import escape_string
import schemas
import models


def get_user_by_username(db: Session, username: str):
    """[Atomic] 通过用户名获取用户信息 """
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate):
    """[Atomic] 创建一个用户"""
    user_data = models.User(**user.dict())
    db.add(user_data)
    db.commit()
    return


def add_pdf_file(db: Session, file: schemas.PdfFileCreate):
    """[Atomic] 添加pdf文件信息 """
    db_file = models.PDF(
        name=file.name,
        sign=file.sign,
        size=file.size,
        user_id=file.user_id,
        ip=file.ip
    )
    db.add(db_file)
    db.commit()
    return db_file


def get_pdf_file_by_sign(db: Session, sign: str):
    """[Atomic] 通过md5获取pdf文件信息 """
    return db.query(models.PDF).filter(models.PDF.sign == sign).first()


def create_index_data(db: Session, sign: str):
    """[Atomic] 创建索引数据 """
    db_index = models.Index(
        sign=sign,
        status=0
    )
    db.add(db_index)
    db.commit()
    return db_index

def get_index_data_by_sign(db: Session, sign: str):
    """[Atomic] 通过标识获取索引数据 """
    return db.query(models.Index).filter(models.Index.sign == sign).first()


def update_index_data_status_by_sign(db: Session, sign: str, status: int):
    """[Atomic] 通过标识更新索引数据状态"""
    db.query(models.Index).filter(models.Index.sign == sign).update({"status": status})
    db.commit()
    return True


def create_book(db: Session, book: schemas.BookCreate):
    """[Atomic] 创建一个订单"""
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    return db_book


def get_book_by_uid(db: Session, uid: int):
    """[Atomic] 通过uid获取订单信息 """
    return db.query(models.Book).filter(models.Book.uid == uid).first()