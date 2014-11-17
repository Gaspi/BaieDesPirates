# -*- coding: utf-8 -*-
"""
Created on Sun Nov 02 09:49:07 2014

@author: Gaspard
"""
import sys, re, urllib
from utils import *

piratebayUrl   = "http://thepiratebay.se/search/{}/0/7/0"

linesPerAnswer = 5
lengthMaxTitle = 40

def formatAnswser( a ):
    return [  a["seeds"], a["size"], a["title"], a["link"], a["magnet"] ]


class PirateBaySearch:
    def __init__(self, name, episode, season):
        self.name    = name
        self.episode = episode
        self.season  = season
        request = name.lower()
        if episode != '' and season != '':
            strseason  = season  if len(season)  > 1 else "0"+season
            strepisode = episode if len(episode) > 1 else "0"+episode
            request += " s" + strseason + "e" + strepisode
        self.url = piratebayUrl.format( urllib.quote(request) )


    def getAnswer(self):
        answerCode = "2"
        nbAnswers = "0"
        result = []
        try:
            answer = self.getSearchAnswer()
            nbAnswers = str(len(answer))
            for e in answer:
                result += formatAnswser(e)
            answerCode = "0"
        except:
            print "Search error" + str(sys.exc_info()[0]) + " - " + str(sys.exc_info()[1])
    
        title = self.name if len( self.name) < lengthMaxTitle else self.name[0:lengthMaxTitle] + "..."
        title = title + " - Saison " + self.season + " - Episode " + self.episode
        return [ answerCode, title, nbAnswers] + result




    def getSearchAnswer(self):
        dom = getDOM( self.url )
        print self.url
        res = dom.find('table', { 'id': 'searchResult'})
        result = []
        if res:
            for e in res.find_all('tr')[1:6]:
                tds = e.find_all('td')
                links = tds[1].find_all('a')
                descript = tds[1].find('font', 'detDesc').contents[0]
                #            size = re.findall('(.*)([0-9]+).([0-9]+) (.+),', descript)
                size = re.findall('Size (.*),', descript)[0].replace(u'\xa0', u' ')
                title = links[0].contents[0]
                link = links[0].attrs['href']
                magnet = links[1].attrs['href']
                seeds = tds[2].contents[0]
                result.append({"title" : title,
                               "link"  : link,
                               "magnet": magnet,
                               "seeds" : seeds,
                               "size"  : size  })
        else:
            result = [ ]
        return result
















