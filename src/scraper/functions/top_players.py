from bs4 import BeautifulSoup

def get_top_players(html_doc):
  soup = BeautifulSoup(html_doc, "html.parser")

  table_selector = "#main-col > table:nth-child(2) > tr:nth-child(2) > td > table"

  table = soup.select_one(table_selector)

  rows: list = table.find_all("tr")

  rows.pop(0)

  top_players = []

  for row in rows:
    raw_row = []

    for column in row.find_all("td"):
      raw_data = column.get_text().replace(u'\xa0', '')

      raw_row.append(raw_data)

      player_url = column.find("a")

      if player_url: raw_row.append(player_url["href"].split("=")[1])

    top_players.append({
      "rank": raw_row[0],
      "name": raw_row[1],
      "fide_id": raw_row[2],
      "title": raw_row[3],
      "country": raw_row[4],
      "rating": raw_row[5],
      "games": raw_row[6],
      "birth_year": raw_row[7],
    })

  return top_players
