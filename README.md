<h1 align="center">
  FIDE API
</h1>

<h4 align="center">Python FIDE scraper and HTTP API</h4>

<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#usage">Usage</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

![example](screenshot.png)

## About

Working with FIDE oficial data is not simple, mainly because they don't have an API. That's the reason I made a simple API with FastAPI to scrape the data from their own website and provide it as JSON over HTTP requests.

## Features

Check it on:
[https://fide-api.vercel.app/](https://fide-api.vercel.app/)

- Get top players list
- Get player info
- Get player history
- Docs on ``/docs``

## Usage

You will need git and asdf installed, from your terminal:

```sh
git clone https://github.com/cassiofb-dev/fide-api

cd fide-api

asdf install python 3.10.7

asdf local python 3.10.7

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn src.api:app --reload
```

To see the docs go to ``localhost:8000/docs``

## Credits

This project uses git, python (3.10.7) and asdf.

The following python dependecies were used:
```txt
anyio==3.6.2
beautifulsoup4==4.11.1
certifi==2022.12.7
charset-normalizer==2.1.1
click==8.1.3
fastapi==0.88.0
h11==0.14.0
httptools==0.5.0
idna==3.4
orjson==3.8.4
pydantic==1.10.4
python-dotenv==0.21.0
PyYAML==6.0
requests==2.28.1
sniffio==1.3.0
soupsieve==2.3.2.post1
starlette==0.22.0
typing_extensions==4.4.0
urllib3==1.26.13
uvicorn==0.20.0
uvloop==0.17.0
watchfiles==0.18.1
websockets==10.4
```

## License

MIT

---

> [Website](https://cassiofernando.netlify.app/) &nbsp;&middot;&nbsp;
> GitHub [@cassiofb-dev](https://github.com/cassiofb-dev) &nbsp;&middot;&nbsp;
> Twitter [@cassiofb_dev](https://twitter.com/cassiofb_dev)
