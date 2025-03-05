from bs4 import BeautifulSoup, Tag

def get_player_info(html_doc: str):
  soup = BeautifulSoup(html_doc, "html.parser")

  player_info_raw = {
    "fide_id": soup.select_one(".profile-info-id"),
    "fide_title": soup.select_one(".profile-info-title "),
    "federation": soup.select_one(".profile-info-country"),
    "birth_year": soup.select_one(".profile-info-byear"),
    "sex": soup.select_one(".profile-info-sex "),
    "name": soup.select_one(".player-title"),
    "world_rank_all": soup.select_one(".profile-rank-block:nth-of-type(1) .profile-rank-row:nth-of-type(2) p"),
    "world_rank_active": soup.select_one(".profile-rank-block:nth-of-type(1) .profile-rank-row:nth-of-type(1) p"),
    "continental_rank_all": soup.select_one(".profile-rank-block:nth-of-type(3) .profile-rank-row:nth-of-type(2) p"),
    "continental_rank_active": soup.select_one(".profile-rank-block:nth-of-type(3) .profile-rank-row:nth-of-type(1) p"),
    "national_rank_all": soup.select_one(".profile-rank-block:nth-of-type(2) .profile-rank-row:nth-of-type(2) p"),
    "national_rank_active": soup.select_one(".profile-rank-block:nth-of-type(2) .profile-rank-row:nth-of-type(1) p"),
  }

  player_info = {
    "fide_id": safely_get_string(player_info_raw["fide_id"]),
    "fide_title": safely_get_string(player_info_raw["fide_title"]),
    "federation": safely_get_string(player_info_raw["federation"]),
    "birth_year": safely_get_int(player_info_raw["birth_year"]),
    "sex": safely_get_string(player_info_raw["sex"]),
    "name": safely_get_string(player_info_raw["name"]),
    "world_rank_all": safely_get_int(player_info_raw["world_rank_all"]),
    "world_rank_active": safely_get_int(player_info_raw["world_rank_active"]),
    "continental_rank_all": safely_get_int(player_info_raw["continental_rank_all"]),
    "continental_rank_active": safely_get_int(player_info_raw["continental_rank_active"]),
    "national_rank_all": safely_get_int(player_info_raw["national_rank_all"]),
    "national_rank_active": safely_get_int(player_info_raw["national_rank_active"]),
  }

  return player_info

def safely_get_string(tag: Tag):
  if tag is None:
    return None

  return tag.get_text().strip()

def safely_get_int(tag: Tag):
  if tag is None:
    return None
  
  if not tag.get_text().strip().isdigit():
    return None

  return int(tag.get_text().strip())
