source /app/venv/pinkglow/bin/activate
nohup  /app/venv/pinkglow/bin/uvicorn main:app --port 2045 --reload  > server.log 2>&1 &

