from bs4 import BeautifulSoup, Tag

def get_player_info(html_doc: str):
  soup = BeautifulSoup(html_doc, "html.parser")

  player_info_raw = {
    "fide_id": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(1) > div:nth-child(3) > div.profile-top-info__block__row__data"),
    "fide_title": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(3) > div.profile-top-info__block__row__data"),
    "federation": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(1) > div:nth-child(2) > div.profile-top-info__block__row__data"),
    "birth_year": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(1) > div.profile-top-info__block__row__data"),
    "sex": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(2) > div.profile-top-info__block__row__data"),
    "name": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-8.profile-top-title"),
    "world_rank_all": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)"),
    "world_rank_active": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)"),
    "continental_rank_all": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2)"),
    "continental_rank_active": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2)"),
    "national_rank_all": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)"),
    "national_rank_active": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)"),
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
