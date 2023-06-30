
import os
import time
import aiofiles
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, UploadFile, File, Request

import crud
import deps
import schemas
from utils import calc_buf_md5, get_static_file_path, ip2int

router = APIRouter()


@router.post("/pdf", summary="上传PDF文件")
async def upload_pdf(
        request: Request,
        file: UploadFile = File(...),
        db: Session = Depends(deps.get_db),
        check: bool = Depends(deps.validate_user_pdf)):
    ip = request.client.host
    # 读取文件内容
    contents = await file.read()

    # 计算文件哈希值
    file_size = len(contents)
    # 50 表示 50Mb
    div = 1000000
    if (file_size > div) and (file_size / div) > 15:
        return schemas.Response(code=-1, data=[], msg="too large")

    md5 = calc_buf_md5(contents)
    # 判断文件是否已经存在
    db_file = crud.get_pdf_file_by_sign(db, md5)
    if db_file:
        return schemas.Response(data=db_file)

    # 如果不存在，则保存上传文件信息
    data = schemas.PdfFileCreate(
        name=file.filename,
        sign=md5,
        size=file_size,
        ip=ip2int(ip)
    )

    # 保存文件
    file_path = get_static_file_path("pdf", f"{md5}.pdf")

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(contents)

    crud.add_pdf_file(db, data)
    

    return schemas.Response(data=data)



