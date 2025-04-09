import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

# Handler for validation errors (422)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error("⚠️ Validation error 422 (Pydantic) at {request.url}:")
    logger.error(f"⚠️ Errors: {exc.errors()}")
    logger.error(f"⚠️ Body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

# Optional: handler for unhandled server errors (500)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"💥 Unhandled error at {request.url}: {repr(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )