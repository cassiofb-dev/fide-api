import ssl
import logging

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from fastapi import HTTPException

import src.scraper.functions as scraper

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Custom SSL adapter to work around FIDE's flaky TLS behaviour
# (SSLEOFError: UNEXPECTED_EOF_WHILE_READING)
# ---------------------------------------------------------------------------

class _FideSSLAdapter(HTTPAdapter):
  """HTTPAdapter that uses a permissive SSL context so the FIDE server's
  premature TLS closes don't immediately blow up."""

  def init_poolmanager(self, *args, **kwargs):
    ctx = ssl.create_default_context()
    # Allow legacy renegotiation / server-connect behaviour that some
    # older or misconfigured servers (like ratings.fide.com) rely on.
    ctx.options |= getattr(ssl, "OP_LEGACY_SERVER_CONNECT", 0x4)
    ctx.check_hostname = True
    ctx.verify_mode = ssl.CERT_REQUIRED
    kwargs["ssl_context"] = ctx
    return super().init_poolmanager(*args, **kwargs)


def _build_session() -> requests.Session:
  """Return a Session pre-configured with retries and the custom SSL adapter."""
  session = requests.Session()

  retries = Retry(
    total=3,
    backoff_factor=1,            # waits 1s, 2s, 4s between retries
    status_forcelist=[502, 503, 504],
    allowed_methods=["GET"],
    raise_on_status=False,
  )

  adapter = _FideSSLAdapter(max_retries=retries)
  session.mount("https://", adapter)
  session.mount("http://", adapter)

  return session


_session = _build_session()


def _get(url: str) -> requests.Response:
  """Perform a GET request through the shared session, converting network
  errors into FastAPI 502 responses."""
  try:
    response = _session.get(url, timeout=15)
    response.raise_for_status()
    return response
  except requests.exceptions.RequestException as exc:
    logger.error("Request to %s failed: %s", url, exc)
    raise HTTPException(
      status_code=502,
      detail=f"Failed to fetch data from FIDE: {exc}",
    ) from exc


def get_top_players(limit: int = 100, history: bool = False) -> list[dict]:
  fide_top_players_page = _get("https://ratings.fide.com/a_top.php?list=open")

  html_doc = fide_top_players_page.text

  top_players = scraper.get_top_players(html_doc)

  top_players = top_players[0:limit]

  if history == False: return top_players

  for player_dict in top_players:
    fide_profile_page = f"https://ratings.fide.com/profile/{player_dict['fide_id']}"

    response = _get(fide_profile_page)

    html_doc = response.text

    player_history = scraper.get_player_history(html_doc)

    player_dict["history"] = player_history

  return top_players

def get_player_history(fide_id: str) -> list[dict]:
  fide_profile_page = f"https://ratings.fide.com/profile/{fide_id}"

  response = _get(fide_profile_page)

  html_doc = response.text

  player_history = scraper.get_player_history(html_doc)

  return player_history

def get_player_info(fide_id: str, history: bool = False):
  fide_profile_page = f"https://ratings.fide.com/profile/{fide_id}"

  response = _get(fide_profile_page)

  html_doc = response.text

  player_info = scraper.get_player_info(html_doc)

  if history == False: return player_info

  player_history = scraper.get_player_history(html_doc)

  player_info["history"] = player_history

  return player_info
