from openpyxl import load_workbook
import requests
import time
from bs4 import BeautifulSoup
import json
#import re

wb = load_workbook(filename = '/Users/PJ/CODES/feinstaub-map-v2-EU-Stations/doc/netherlands_stations.xlsx')
sheet_id1 = wb['Sheet1']
#sheet_id2 = wb['liens']

row = 0

for n1 in range(2,98):
    cell_code= "A" + str(n1)
    cell_comp= "C" + str(n1)
    cell_coo= "D" + str(n1)
    
    code = sheet_id1[cell_code].value
    url_ok = "https://api.luchtmeetnet.nl/open_api/stations/"+ code
    print(url_ok)
    print(n1)
    response= requests.get(url_ok)      
    time.sleep(3)
    jsonparsed = (json.loads(response.text))
    
    print(jsonparsed)
    
    components = jsonparsed["data"]["components"]
    text_comp= ','.join(components)
    print(text_comp)
    
    coordinates = jsonparsed["data"]["geometry"]["coordinates"]
    text_coo= ','.join(map(str, coordinates))
    print(text_coo)
    
    sheet_id1[cell_comp] = text_comp
    sheet_id1[cell_coo] = text_coo
    
wb.save('/Users/PJ/CODES/feinstaub-map-v2-EU-Stations/doc/netherlands_stations.xlsx')
    