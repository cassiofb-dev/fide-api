## LISTS ENDPOINTS

GET https://ratings.fide.com/a_top.php?list=open
GET https://ratings.fide.com/a_top.php?list=women
GET https://ratings.fide.com/a_top.php?list=juniors
GET https://ratings.fide.com/a_top.php?list=girls
GET https://ratings.fide.com/a_top.php?list=men_rapid
GET https://ratings.fide.com/a_top.php?list=women_rapid
GET https://ratings.fide.com/a_top.php?list=juniors_rapid
GET https://ratings.fide.com/a_top.php?list=girls_rapid
GET https://ratings.fide.com/a_top.php?list=men_blitz
GET https://ratings.fide.com/a_top.php?list=women_blitz
GET https://ratings.fide.com/a_top.php?list=juniors_blitz
GET https://ratings.fide.com/a_top.php?list=girls_blitz

All the lists endpoints returns an HTML like: docs/a_top.html

## PROFILES ENDPOINTS

REQUEST: GET https://ratings.fide.com/profile/1503014
RESPONSE: docs/profile.html

REQUEST:
```sh
curl 'https://ratings.fide.com/a_chart_data.phtml?event=1503014&period=0' \
  -X POST \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0' \
  -H 'Accept: */*' \
  -H 'Accept-Language: pt-BR,en-US;q=0.9,en;q=0.8' \
  -H 'Accept-Encoding: gzip, deflate, br, zstd' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Origin: https://ratings.fide.com' \
  -H 'Connection: keep-alive' \
  -H 'Referer: https://ratings.fide.com/profile/1503014/calculations' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Priority: u=0' \
  -H 'Content-Length: 0'
```
RESPONSE: docs/a_chart_data.json

REQUEST:
```sh
curl 'https://ratings.fide.com/a_data_stats.php?id1=1503014&id2=0' \
  -X POST \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0' \
  -H 'Accept: */*' \
  -H 'Accept-Language: pt-BR,en-US;q=0.9,en;q=0.8' \
  -H 'Accept-Encoding: gzip, deflate, br, zstd' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Origin: https://ratings.fide.com' \
  -H 'Connection: keep-alive' \
  -H 'Referer: https://ratings.fide.com/profile/1503014/top' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Priority: u=0' \
  -H 'Content-Length: 0'
```
RESPONSE: docs/a_data_stats.json
