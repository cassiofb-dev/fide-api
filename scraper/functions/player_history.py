import pandas as pd
from bs4 import BeautifulSoup

from scraper.functions.utils import fide_data_to_numeric_string

def player_history_to_dataframe(html_doc: str):
  soup = BeautifulSoup(html_doc, "html.parser")

  table_selector = "body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div:nth-child(3) > div > div.col-lg-12.profile-tableCont > table > tbody"

  table = soup.select_one(table_selector)

  rows: list = table.find_all("tr")

  raw_table = []

  for row in rows:
    raw_row = []

    for column in row.find_all("td"):
      raw_data = column.get_text().replace(u'\xa0', '').strip()

      raw_row.append(raw_data)

    raw_table.append(raw_row)

  player_history_dataframe = pd.DataFrame(
    raw_table,
    columns=[
      "period",
      "classical_rating",
      "classical_games",
      "rapid_rating",
      "rapid_games",
      "blitz_rating",
      "blitz_games",
    ],
  )

  player_history_dataframe["date"] = player_history_dataframe["period"].apply(fide_data_to_numeric_string)

  return player_history_dataframe
