import requests

from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware

from src.scraper import fide_scraper

app = FastAPI(default_response_class=ORJSONResponse)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
def home():
  return {
    "Hello World!": "For help go to /docs endpoint."
}

@app.get("/top_players/")
async def top_players(limit: int = 100, history: bool = False):
  response = fide_scraper.get_top_players(limit=limit, history=history)
  return response

@app.get("/player_history/")
async def player_history(fide_id: str):
  response = fide_scraper.get_player_history(fide_id=fide_id)
  return response

@app.get("/player_info/")
async def player_info(fide_id: str, history: bool = False):
  response = fide_scraper.get_player_info(fide_id=fide_id, history=history)
  return response
