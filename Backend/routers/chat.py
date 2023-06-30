
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
from utils import get_static_file_path, ip2int

router = APIRouter()


@router.get("/init/{file_sign}", summary="构建文件索引")
async def init_chat(file_sign: str, db: Session = Depends(deps.get_db)):
    # 判断文件是否上传过
    db_file = crud.get_pdf_file_by_sign(db, file_sign)
    if not db_file:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="文件不存在")

    # 文件信息
    file_sign = db_file.sign
    file_path = get_static_file_path("pdf", f"{file_sign}.pdf")

    # 查询是否已经构建过索引
    db_index = crud.get_index_data_by_sign(db, file_sign)
    if db_index and db_index.status == 1:
        return schemas.Response(data={}, code=200, msg="索引已经构建过")

    # 更新索引状态
    # 如果已经有数据，只是没有构建完成，则更新状态为0，表示正在构建
    if db_index:
        crud.update_index_data_status_by_sign(db, file_sign, 0)
    # 如果没有数据，则创建数据
    else:
        crud.create_index_data(db, file_sign)

    # 构建文档
    loop = asyncio.get_event_loop()
    document = await loop.run_in_executor(None, langtool.pdf_reader, file_path)

    # 构建索引
    index = await loop.run_in_executor(None, langtool.build_index, document)

    # 保存索引
    index_path = get_static_file_path("index", file_sign)
    await loop.run_in_executor(None, langtool.save_index_to_storage, index, index_path)

    # 更新索引状态
    crud.update_index_data_status_by_sign(db, file_sign, 1)
    return schemas.Response(data={}, code=200, msg="索引构建完成")



@router.post("/", summary="提问")
async def chat(req: schemas.Chat, check: object = Depends(deps.validate_user_question)):
    print(req, check)
    loop = asyncio.get_event_loop()
    index = await loop.run_in_executor(None, langtool.load_index_from_memory, req.sign)
    if not index:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="索引不存在")
    data = langtool.ask_query(index, req.content)
    source, gen = data
    def get_sources():
        yield source

    return StreamingResponse(chain(get_sources(), gen), media_type="text/event-stream")
