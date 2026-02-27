# Bobs Corn API (FastAPI)

## Run (dev)
```bash
cd server
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
uvicorn bobscorn.main:app --reload
````

## URLs

* Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* Health:  [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

## Notes

* CORS is enabled for: [http://localhost:5173](http://localhost:5173)
* Rate limiting is enabled (per-client). If you hit 429, wait and retry.