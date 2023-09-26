from bs4 import BeautifulSoup

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
    "fide_id": player_info_raw["fide_id"].get_text().strip() if player_info_raw["fide_id"] else None,
    "fide_title": player_info_raw["fide_title"].get_text().strip() if player_info_raw["fide_title"] else None,
    "federation": player_info_raw["federation"].get_text().strip() if player_info_raw["federation"] else None,
    "birth_year": int(player_info_raw["birth_year"].get_text().strip() if player_info_raw["birth_year"] else None or 0),
    "sex": player_info_raw["sex"].get_text().strip() if player_info_raw["sex"] else None,
    "name": player_info_raw["name"].get_text().strip() if player_info_raw["name"] else None,
    "world_rank_all": int(player_info_raw["world_rank_all"].get_text().strip() if player_info_raw["world_rank_all"] else None or 0),
    "world_rank_active": int(player_info_raw["world_rank_active"].get_text().strip() if player_info_raw["world_rank_active"] else None or 0),
    "continental_rank_all": int(player_info_raw["continental_rank_all"].get_text().strip() if player_info_raw["continental_rank_all"] else None or 0),
    "continental_rank_active": int(player_info_raw["continental_rank_active"].get_text().strip() if player_info_raw["continental_rank_active"] else None or 0),
    "national_rank_all": int(player_info_raw["national_rank_all"].get_text().strip() if player_info_raw["national_rank_all"] else None or 0),
    "national_rank_active": int(player_info_raw["national_rank_active"].get_text().strip() if player_info_raw["national_rank_active"] else None or 0),
  }

  return player_info
