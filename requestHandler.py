# -*- coding: utf-8 -*-
"""
Created on Thu Oct 30 22:00:40 2014

@author: Gaspard


erreurs :
1 -> Aucune requête envoyée
2 -> Réponse erronée du site
"""

import sys, urllib
from utils import *
from PirateBayCrawler import PirateBaySearch
from SubtitlesCrawler import SubtitlesSeasonCrawler, SubtitlesSearch


debug = True


# May cause encoding issues...
def formatAnswer(answer):
    return "\n".join( [str(e) for e in answer] )



def defaultErrorAnswer(code):
    return formatAnswer([code, "3", "6"] + ["1", "", "0"] + ["1", "", "0"])

def handleSearchRequest(url):
    try:
        name    = urllib.unquote(url['name'])
        episode = urllib.unquote(url['episode'])
        season  = urllib.unquote(url['season'])
        
        
        
        requestCode = "0"
        if not season.isdigit():    return defaultErrorAnswer("1")
        elif not episode.isdigit(): return defaultErrorAnswer("2")
        
        pbSearch = PirateBaySearch(name, episode, season)
        pbAnswer = pbSearch.getAnswer()
        
        stSearch = SubtitlesSeasonCrawler(name, episode, season)
        stAnswer = stSearch.getAnswer()
        
        pbOffset = "3"
        stOffset = str(3 + len(pbAnswer) )
        
        return formatAnswer([requestCode, pbOffset, stOffset] +
                             pbAnswer + stAnswer)
    except:
        print "Erreur inconnue... " + str(sys.exc_info()[0]) + " - " + str(sys.exc_info()[1])
        return defaultErrorAnswer("3")




def defaultSTErrorAnswer(code):
    return formatAnswer([code, "2"] + ["1", "", "0"])

def handleSubtitlesRequest(url):
    try:
        name    = urllib.unquote(url['name'])
        episode = urllib.unquote(url['episode'])
        season  = urllib.unquote(url['season'])
        code    = urllib.unquote(url['code'])
        requestCode = "0"
        if   not season.isdigit():  return defaultSTErrorAnswer("2")
        elif not episode.isdigit(): return defaultSTErrorAnswer("3")
        elif not episode.isdigit(): return defaultSTErrorAnswer("4")
        elif not code.isdigit():    return defaultSTErrorAnswer("5")
        stSearch = SubtitlesSearch(name, episode, season, code)
        return formatAnswer( [requestCode, "2"] + stSearch.getAnswer() )
    except Exception as inst:
        if debug:
            raise inst
        else:
            print "Erreur inconnue... " + str(sys.exc_info()[0]) + " - " + str(sys.exc_info()[1])
            return defaultSTErrorAnswer("1")






