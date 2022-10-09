from bs4 import BeautifulSoup

def get_player_info(html_doc: str):
  soup = BeautifulSoup(html_doc, "html.parser")

  player_info = {
    "fide_id": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(1) > div:nth-child(3) > div.profile-top-info__block__row__data").get_text().strip(),
    "fide_title": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(3) > div.profile-top-info__block__row__data").get_text().strip(),
    "federation": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(1) > div:nth-child(2) > div.profile-top-info__block__row__data").get_text().strip(),
    "birth_year": int(soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(1) > div.profile-top-info__block__row__data").get_text().strip() or 0),
    "sex": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-12.profile-top-info > div:nth-child(2) > div:nth-child(2) > div.profile-top-info__block__row__data").get_text().strip(),
    "name": soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-top.col-lg-12 > div > div.col-lg-9.profile-top__right > div > div.col-lg-8.profile-top-title").get_text().strip(),
    "world_rank_all": int(soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)").get_text().strip() or 0),
    "world_rank_active": int(soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)").get_text().strip() or 0),
    "continental_rank_all": int(soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2)").get_text().strip() or 0),
    "continental_rank_active": int(soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2)").get_text().strip() or 0),
    "national_rank_all": int(soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)").get_text().strip() or 0),
    "national_rank_active": int(soup.select_one("body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div.profile-tab-container.profile-tab-container_active > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)").get_text().strip() or 0),
  }

  return player_info
