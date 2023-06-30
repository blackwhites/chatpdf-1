# -*- coding:utf-8 -*-

from sqlalchemy import Column, Integer, String, CHAR, TIMESTAMP, text, SmallInteger
from database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True)
    email = Column(String(128))
    password = Column(String(128))
    sub_status = Column(SmallInteger, comment="订阅状态 -1:未订阅，0：已过期，1：已订阅")
    sub_start = Column(TIMESTAMP, comment="订阅开始日期")
    sub_end = Column(TIMESTAMP, comment="订阅结束日期")
    create_time = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    update_time = Column(TIMESTAMP, nullable=False,
                         server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))


class PDF(Base):
    __tablename__ = "pdf"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), index=True)
    sign = Column(CHAR(32), index=True)
    size = Column(Integer)
    user_id = Column(Integer, nullable=False)
    ip = Column(Integer, index=True)
    create_time = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    update_time = Column(TIMESTAMP, nullable=False,
                         server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))


class Index(Base):
    __tablename__ = "index_data"

    id = Column(Integer, primary_key=True, index=True)
    sign = Column(CHAR(32), index=True)
    status = Column(SmallInteger, comment="-1:未处理, 0:处理中,1:已处理")
    create_time = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    update_time = Column(TIMESTAMP, nullable=False,
                         server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))


class Book(Base):
    __tablename__ = "book"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(128))
    uid = Column(Integer, index=True)
    months = Column(Integer)
    create_time = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    update_time = Column(TIMESTAMP, nullable=False,
                         server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
