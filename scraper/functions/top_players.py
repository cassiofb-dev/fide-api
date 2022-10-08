import pandas as pd
from bs4 import BeautifulSoup

def top_players_to_dataframe(html_doc: str):
  soup = BeautifulSoup(html_doc, "html.parser")

  table_selector = "#main-col > table:nth-child(2) > tr:nth-child(2) > td > table"

  table = soup.select_one(table_selector)

  rows: list = table.find_all("tr")

  rows.pop(0)

  raw_table = []

  for row in rows:
    raw_row = []

    for column in row.find_all("td"):
      raw_data = column.get_text().replace(u'\xa0', '')

      raw_row.append(raw_data)

      player_url = column.find("a")

      if player_url: raw_row.append(player_url["href"].split("=")[1])

    raw_table.append(raw_row)

  top_players_dataframe = pd.DataFrame(
    raw_table,
    columns=[
      "rank",
      "name",
      "fide_id",
      "title",
      "country",
      "rating",
      "games",
      "birth_year",
    ],
  )

  return top_players_dataframe
