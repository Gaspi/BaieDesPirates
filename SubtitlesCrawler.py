# -*- coding: utf-8 -*-
"""
Created on Sun Nov 02 09:49:07 2014

@author: Gaspard
"""
import sys, re, socket, urllib, urllib2
from utils import *

TVSubtitlesUrl = "http://www.tvsubtitles.net/"
TVSubtitlesUrlSearch   = "http://www.tvsubtitles.net/search.php"

lengthMaxTitle = 40

socket.setdefaulttimeout(10)


# TODO Integrate this function
def downloadSubtitle(code, path):
    headers = { 'User-Agent' : 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)' }
    url = TVSubtitlesUrl + "download-" + code + ".html"
    req = urllib2.Request(url, None, headers)
    res = urllib2.urlopen(req)
    with open(path, "wb") as f:
        f.write( res )





def formatAnswser( a ):
    return [ a["title"], a["link"] ]


class SubtitlesSeasonCrawler:
    def __init__(self, name, episode, season):
        self.name    = name.lower()
        self.episode = episode
        self.season  = season
    
    
    def getAnswer(self):
        title = self.name if len( self.name) < lengthMaxTitle else self.name[0:lengthMaxTitle] + "..."
        title = title + " - Saison " + self.season + " - Episode " + self.episode
        try:
            result = []
            answer = self.getSearchAnswer()
            answer = sorted(answer, key=lambda k:distanceLevenshtein(k["title"], title) )
            nbAnswers = len(answer)
            for e in answer:
                result += formatAnswser(e)
            return [ 0, title, nbAnswers] + result
        except:
            print "Search error" + str(sys.exc_info()[0]) + " - " + str(sys.exc_info()[1])
            return [2, title, 0]
        
        




    def getSearchAnswer(self):
        dom = getDOM( TVSubtitlesUrlSearch, data="q=" + urllib.quote(self.name) )
        res = dom.find('div','left_articles').find('ul').find_all('li')
        result = []
        if res:
            for e in res:
                a = e.find('a')
                link = re.findall('/tvshow-([0-9]+).html', a.attrs['href'])[0]
                title = a.contents[0]
                result.append({"title" : title,
                               "link"  : link })
        else:
            result = [ ]
        return result


def distanceLevenshtein(s1, s2):
    if len(s1) < len(s2): return distanceLevenshtein(s2, s1)
    if len(s2) == 0:      return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1 # j+1 instead of j since previous_row and current_row are one character longer
            deletions = current_row[j] + 1       # than s2
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]



def formatSTAnswser( a ):
    return [ a['downloads'] * a['good'] / (a['good'] + a['bad']),
             a['size'],
             a['title'],
             a['link']    ]

class SubtitlesSearch:
    def __init__(self, name, episode, season, code):
        self.name    = name
        self.episode = episode
        self.longepisode = episode if len(episode) > 1 else "0"+episode
        self.season  = season
        self.code    = code
        self.lang = "en"
    
    
    def getAnswer(self):
        title = self.name if len( self.name) < lengthMaxTitle else self.name[0:lengthMaxTitle] + "..."
        title = title + " - Saison " + self.season + " - Episode " + self.episode
        try:
            answer = self.getSearchAnswer()
            result = sorted( [formatSTAnswser(e) for e in answer], key=lambda k:-k[0] )
            return [ 0, title, len(answer) ] + join_lists( result )
        except:
            print "Search error" + str(sys.exc_info()[0]) + " - " + str(sys.exc_info()[1])
            return [2,title,0]
    
    
    def getSearchAnswer(self):
        dom = getDOM( TVSubtitlesUrl + "tvshow-" + str(self.code) + "-" + str(self.season) + ".html" )
        table = dom.find('div','left_articles').find('table', {'id':'table5'})
        links = None
        link = None

        if not table:
            print "No table found"
            global err1
            err1 = dom
            return []
        for t in table.find_all('tr')[1:-2]:
            td = t.find('td')
            if td and td.contents[0] == str(self.season) + "x" + str(self.longepisode):
                links = t.find_all('td')[-1].find_all('a')

        if not links:
            print "No links found"
            global err2
            err2 = dom
            return []
        for l in links:
            src = l.find('img').attrs['src']
            if src.endswith( self.lang + ".gif"):
                link = l.attrs['href']

        if not link:
            print "Not Link found"
            global err3
            err3 = dom
            return []
        if link.startswith("subtitle"):
            st = getSubtitle(link)
            if st: return [ st ]
        elif link.startswith("episode"):
            dom2 = getDOM( TVSubtitlesUrl + link)
            links = dom2.find('div', 'left_articles').find_all('a')
            res = []
            for l in links:
                href = l.attrs['href']
                if re.findall('\/subtitle-([0-9]*)\.html', href):
                    st = getSubtitle(href)
                    if st: res.append( st )
            return res
        return []

def getSubtitle(link):
    dom = getDOM( TVSubtitlesUrl + link)
    table = dom.find('div', 'left_articles').find('table')
    res = { 'title':'','size':'','downloads':0,'bad':0,'good':1 }
    for tr in table.find_all('tr')[1:-2]:
        src = tr.find('td').find('img').attrs['src']
        con = tr.find_all('td')[-1].contents[0]
        if src == "images/file.png":
            res['title'] = con
        if src == "images/save.png":
            res['size'] = con
        if src == "images/downloads.png":
            res['downloads'] = int( con )
    res['bad']  = int( table.find_all('b', {'id':'hate'})[-1].contents[0] )
    res['good'] = int( table.find_all('b', {'id':'love'})[-1].contents[0] )
    link = table.find_all('a')[-1].attrs['href']
    link = re.findall('download-([0-9]*)\.html', link)
    if link:
        res['link'] = link[0]
        return res
    else:
        return None


#images/episode.png
#images/number.png
#images/rip.gif
#images/user.png
#images/comment.gif
#images/file.png
#images/save.png
#images/time.png
#images/downloads.png
#images/remove.png






