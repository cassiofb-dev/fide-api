import requests
import src.scraper.functions as scraper

def get_top_players(limit: int = 100, history: bool = False) -> list[dict]:
  fide_top_players_page = requests.get("https://ratings.fide.com/a_top.php?list=open")

  html_doc = fide_top_players_page.text

  top_players = scraper.get_top_players(html_doc)

  top_players = top_players[0:limit]

  if history == False: return top_players

  for player_dict in top_players:
    fide_profile_page = f"https://ratings.fide.com/profile/{player_dict['fide_id']}"

    response = requests.get(fide_profile_page)

    html_doc = response.text

    player_history = scraper.get_player_history(html_doc)

    player_dict["history"] = player_history

  return top_players

def get_player_history(fide_id: str) -> list[dict]:
  fide_profile_page = f"https://ratings.fide.com/profile/{fide_id}"

  response = requests.get(fide_profile_page)

  html_doc = response.text

  player_history = scraper.get_player_history(html_doc)

  return player_history

def get_player_info(fide_id: str, history: bool = False):
  fide_profile_page = f"https://ratings.fide.com/profile/{fide_id}"

  response = requests.get(fide_profile_page)

  html_doc = response.text

  player_info = scraper.get_player_info(html_doc)

  if history == False: return player_info

  player_history = scraper.get_player_history(html_doc)

  player_info["history"] = player_history

  return player_info
