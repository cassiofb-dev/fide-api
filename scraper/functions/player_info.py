import pandas as pd
from bs4 import BeautifulSoup

def player_info_to_dataframe(html_doc: str):
  soup = BeautifulSoup(html_doc, "html.parser")

  player_info = {
    "fide_id": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(1) > div:nth-child(3) > div.profile-top-info__block__row__data").get_text().strip()],
    "fide_title": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(3) > div.profile-top-info__block__row__data").get_text().strip()],
    "federation": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(1) > div:nth-child(2) > div.profile-top-info__block__row__data").get_text().strip()],
    "birth_year": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(1) > div.profile-top-info__block__row__data").get_text().strip()],
    "sex": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(2) > div.profile-top-info__block__row__data").get_text().strip()],
    "name": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-8.profile-top-title").get_text().strip()],
    "world_rank_all": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)").get_text().strip()],
    "world_rank_active": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)").get_text().strip()],
    "continental_rank_all": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2)").get_text().strip()],
    "continental_rank_active": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2)").get_text().strip()],
    "national_rank_all": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)").get_text().strip()],
    "national_rank_active": [soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)").get_text().strip()],
  }

  player_info_dataframe = pd.DataFrame(player_info)

  return player_info_dataframe
