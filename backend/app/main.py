import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router
from app.config import origins
from app.database.connection import db

from app.exception_handlers import validation_exception_handler, generic_exception_handler
from fastapi.exceptions import RequestValidationError

# FastAPI app
app = FastAPI()

# Register global exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# CORS settings
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
	await db.initialize()

@app.on_event("shutdown")
async def shutdown():
	await db._pool.close()

# Include API routes
app.include_router(router)

if __name__ == "__main__":
	uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
