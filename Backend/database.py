# -*- coding:utf-8 -*-

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import redis

MYSQL_PASSWORD = os.getenv("mysql_password")
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://root:{MYSQL_PASSWORD}@127.0.0.1/pinkglow"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
pool = redis.ConnectionPool(host='localhost', port=6379, db=0, decode_responses=True)
SessionRedis = redis.Redis(connection_pool=pool)


