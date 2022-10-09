import calendar

month_abbr_to_number = {month: index for index, month in enumerate(calendar.month_abbr) if month}

def fide_date_to_numeric_string(fide_date: str) -> str:
  year, month = fide_date.split("-")

  date_string = f"{year}-{month_abbr_to_number[month]:02}"

  return date_string
