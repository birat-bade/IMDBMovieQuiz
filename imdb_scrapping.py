from bs4 import BeautifulSoup
import requests
from bs4.dammit import EncodingDetector

headers = {
    'Connection': 'close',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
}


def get_url_soup(url):
    url_request = requests.get(url, headers=headers, allow_redirects=True)
    http_encoding = url_request.encoding if 'charset' in url_request.headers.get('content-type',
                                                                                 '').lower() else None
    html_encoding = EncodingDetector.find_declared_encoding(url_request.content, is_html=True)
    encoding = html_encoding or http_encoding
    return BeautifulSoup(url_request.content, 'lxml', from_encoding=encoding)


def get_txt_soup(text):
    text = str(text)
    return BeautifulSoup(text, 'lxml')


urls = ['https://www.imdb.com/chart/moviemeter', 'https://www.imdb.com/chart/top',
        'https://www.imdb.com/chart/top-english-movies']

for u in urls:
    print(u)
    movie_soup = soup = get_url_soup(u)
    movies = movie_soup.find_all('td', {'class': 'titleColumn'})

    for movie in movies:
        movie_info = get_txt_soup(movie).find('a', href=True)
        movie_title = movie_info.text.strip()
        movie_director = movie_info['title'].split('(dir.),')[0].strip()

        request = requests.post('http://127.0.0.1:5000/add_movie', headers=headers,
                                data={'movie_name': movie_title, 'movie_director': movie_director})

        print(request.text)
