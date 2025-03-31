import logging

# Logger setup
logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

# CORS settings
# origins = ["http://localhost:5173", "localhost:5173"]
origins = ["*"]