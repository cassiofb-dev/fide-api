import requests
import src.scraper.functions as scraper
import src.scraper.cache as cache # Redis client
from src.scraper.cache import get_from_cache, save_to_cache

def get_top_players(limit: int = 100, history: bool = False) -> list[dict]:
    # Create a cache key based on function parameters (used for cache lookups)
    cache_key = f"top_players:{limit}:{history}"
    
    # Try to get from cache first
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data
    
    # If not in cache, proceed with fetch
    fide_top_players_page = requests.get("https://ratings.fide.com/a_top.php?list=open")
    html_doc = fide_top_players_page.text
    top_players = scraper.get_top_players(html_doc)
    top_players = top_players[0:limit]

    if history == False:
        # Cache the result before returning
        save_to_cache(cache_key, top_players)
        return top_players

    for player_dict in top_players:
        fide_profile_page = f"https://ratings.fide.com/profile/{player_dict['fide_id']}"
        
        # Check if we have player history in cache
        history_cache_key = f"player_history:{player_dict['fide_id']}"
        player_history = get_from_cache(history_cache_key)
        
        if not player_history:
            # If not in cache, fetch it
            response = requests.get(fide_profile_page)
            html_doc = response.text
            player_history = scraper.get_player_history(html_doc)
            # Cache player history
            save_to_cache(history_cache_key, player_history)
        
        player_dict["history"] = player_history

    # Cache the final result with histories
    save_to_cache(cache_key, top_players)
    return top_players

def get_player_history(fide_id: str) -> list[dict]:
    # Create a cache key
    cache_key = f"player_history:{fide_id}"
    
    # Try to get from cache first
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data
    
    # If not in cache, proceed with fetch
    fide_profile_page = f"https://ratings.fide.com/profile/{fide_id}"
    response = requests.get(fide_profile_page)
    html_doc = response.text
    player_history = scraper.get_player_history(html_doc)
    
    # Cache the result before returning
    save_to_cache(cache_key, player_history)
    return player_history

def get_player_info(fide_id: str, history: bool = False):
    # Create a cache key based on function parameters
    cache_key = f"player_info:{fide_id}:{history}"
    
    # Try to get from cache first
    cached_data = get_from_cache(cache_key)
    if cached_data:
        return cached_data
    
    # If not in cache, proceed with fetch
    fide_profile_page = f"https://ratings.fide.com/profile/{fide_id}"
    response = requests.get(fide_profile_page)
    html_doc = response.text
    player_info = scraper.get_player_info(html_doc)

    if history == False:
        # Cache the result before returning
        save_to_cache(cache_key, player_info)
        return player_info

    # Check if we have player history in cache
    history_cache_key = f"player_history:{fide_id}"
    player_history = get_from_cache(history_cache_key)
    
    if not player_history:
        # If not in cache, we already have the HTML doc, so just extract history
        player_history = scraper.get_player_history(html_doc)
        # Cache player history
        save_to_cache(history_cache_key, player_history)
    
    player_info["history"] = player_history
    
    # Cache the final result with history
    save_to_cache(cache_key, player_info)
    return player_info
