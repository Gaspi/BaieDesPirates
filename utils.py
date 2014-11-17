# -*- coding: utf-8 -*-
"""
Created on Fri Oct 31 21:32:55 2014

@author: Gaspard
"""

import urllib, smtplib, operator
from bs4 import BeautifulSoup

def urlOpen(url, data=None, headers=None):
    if data and headers:
        return urllib.urlopen(url, data, headers)
    elif data:
        return urllib.urlopen(url, data)
    else:
        return urllib.urlopen(url)

def getDOM(url, data=None, headers=None):
    return BeautifulSoup( urlOpen(url, data, headers) )

def getHTML(url, data=None, headers=None):
    return urlOpen(url, data, headers).read()


def saveSubtitle(code):
    zipResponse = urlOpen("http://www.tvsubtitles.net/download-" + str(code) + ".html")
    url = zipResponse.url
    zipFile = zipResponse.read()
    return (url, zipFile)




def join_lists(lists):
    return reduce(operator.add, lists)


def sendMail(msg, subject=''):
    fromaddr = 'baiedespirates@gmail.com'
    toaddrs  = ['gaspard.ferey@hotmail.fr']
    username = fromaddr
    password = 'linda2467'
    body = ("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s" % (fromaddr, ", ".join(toaddrs), subject, msg))
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.starttls()
    server.login(username,password)
    server.sendmail(fromaddr, toaddrs, body)
    server.quit()







