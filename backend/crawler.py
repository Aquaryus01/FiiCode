#!/usr/bin/python3
from bs4 import BeautifulSoup as bs
import requests

r = requests.get('https://www.webmd.com/allergies/guide/allergy-symptoms-types')
soup = bs(r.content, 'lxml')

allergies = soup.find_all('a', class_='link-title')

for allergy in allergies:
    r = requests.get(allergy['href'] + '#1')
    soup = bs(r.content, 'lxml')
    container = soup.find('h2', id='1-2').parent

    for child in container.children:
        if child.name == 'ul':
            for c in child.children:
                if c.name == 'li':
                    print(c.text)
