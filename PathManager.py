# -*- coding: utf-8 -*-
"""
Created on Mon Nov 17 23:38:42 2014

@author: Gaspard
"""

import re

dataPath = 'data/'

filePath = dataPath + 'files/'
pathsPath = dataPath + 'paths/'


def readFileMIMEs():
    mimes = dict()
    with open(dataPath + "files.txt") as allFiles:
        for line in allFiles.read().split('\n'):
            p = re.findall( "([^ ]+)( +)([^ ]+)",line)
            if p:
                mimes[ p[0][0] ] = p[0][2]
    return mimes



def getSubtitlesPath():
    res = ""
    with open(pathsPath + "subtitles.txt", 'rb') as f:
        res = f.read()
    if res[-1] != "\\":
        res += "\\"
    return res

def setSubtitlesPath(path):
    with open(pathsPath + "subtitles.txt", 'wb') as f:
        f.write( path.replace('/','\\') )




