import requests
import scraper.functions as scraper

def top_players(limit: int = 100, history: bool = False) -> list[dict]:
  fide_top_players_page = requests.get("https://ratings.fide.com/top.phtml")

  html_doc = fide_top_players_page.text

  top_players_dataframe = scraper.top_players_to_dataframe(html_doc)

  top_players_dicts = top_players_dataframe.to_dict(orient="records")[0:limit]

  if history == False: return top_players_dicts

  for player_dict in top_players_dicts:
    # print(f"scraping history of {player_dict['name']}")

    fide_profile_page = f"https://ratings.fide.com/profile/{player_dict['fide_id']}"

    response = requests.get(fide_profile_page)

    html_doc = response.text

    player_history_dataframe = scraper.player_history_to_dataframe(html_doc)

    player_dict["history"] = player_history_dataframe.to_dict(orient="records")

  return top_players_dicts

def player_history(fide_id: str) -> list[dict]:
  fide_profile_page = f"https://ratings.fide.com/profile/{fide_id}"

  response = requests.get(fide_profile_page)

  html_doc = response.text

  player_history_dataframe = scraper.player_history_to_dataframe(html_doc)

  return player_history_dataframe.to_dict(orient="records")

def player_info(fide_id: str, history: bool = False):
  fide_profile_page = f"https://ratings.fide.com/profile/{fide_id}"

  response = requests.get(fide_profile_page)

  html_doc = response.text

  player_info_dataframe = scraper.player_info_to_dataframe(html_doc)

  player_info_dict = player_info_dataframe.to_dict(orient="records")[0]

  if history == False: return player_info_dict

  player_history_dataframe = scraper.player_history_to_dataframe(html_doc)

  player_info_dict["history"] = player_history_dataframe.to_dict(orient="records")

  return player_info_dict
