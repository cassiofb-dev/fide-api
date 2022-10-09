from bs4 import BeautifulSoup

from src.scraper.functions.utils import fide_date_to_numeric_string

def get_player_history(html_doc: str):
  soup = BeautifulSoup(html_doc, "html.parser")

  table_selector = "body > section.container.section-profile > div.row.no-gutters > div.profile-bottom.col-lg-12 > div.profile-tab-containers > div:nth-child(3) > div > div.col-lg-12.profile-tableCont > table > tbody"

  table = soup.select_one(table_selector)

  rows: list = table.find_all("tr")

  player_history = []

  for row in rows:
    raw_row = []

    for column in row.find_all("td"):
      raw_data = column.get_text().replace(u'\xa0', '').strip()

      raw_row.append(raw_data)

    player_history.append({
      "period": raw_row[0],
      "classical_rating": int(raw_row[1] or 0),
      "classical_games": int(raw_row[2] or 0),
      "rapid_rating": int(raw_row[3] or 0),
      "rapid_games": int(raw_row[4] or 0),
      "blitz_rating": int(raw_row[5] or 0),
      "blitz_games": int(raw_row[6] or 0),
      "date": fide_date_to_numeric_string(raw_row[0]),
    })

  return player_history
