
import os
import time
import aiofiles
import asyncio
from sqlalchemy.orm import Session
from fastapi import status, HTTPException, Depends, APIRouter, Request
from fastapi.responses import StreamingResponse
from itertools import chain

import crud
import deps
import schemas
import langtool
from utils import get_static_file_path

router = APIRouter()

@router.post("/{sign}")
async def index_search(sign: str, text: schemas.String):
   loop = asyncio.get_event_loop()
   response = await loop.run_in_executor(None, langtool.index_search, sign, text.value)
   data = [i.to_dict() for i in response]
   return schemas.Response(msg="ok", code=200, data=data)

