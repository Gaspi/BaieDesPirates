# -*- coding: utf-8 -*-
"""
Created on Wed Oct 29 22:14:24 2014

@author: Gaspard
"""

import webbrowser, os
from SimpleHTTPServer import SimpleHTTPRequestHandler
import SocketServer
from threading import Thread

from requestHandler import *
from PathManager    import *

PORT = 8000

base_url  = "http://localhost:" + str(PORT) + "/"
index_url = base_url + "index.html"


fileMIMEs = readFileMIMEs()

keepRunning = True

def URLFromPath(url):
    path = [ e for e in url.split('/') if len(e) > 0]
    url = dict()
    if len(path) > 0:
        if path[-1][0] == '?':
            params = path[-1][1:].split("&")
            path = path[:-1]
            for p in params:
                if len(p) > 0:
                    aux = p.split('=')
                    if len(aux) > 1:
                        url[aux[0]] = aux[1]
                    else:
                        url[aux[0]] = None
    url['url'] = '/'.join( path )
    url['path'] = path
    url['first'] = None
    if path: url['first'] = path[0]
    return url



def isFileURL(url):
    return url in fileMIMEs.keys()
def getMIME(url):
    return fileMIMEs[url]
def getContent(url):
    with open(filePath+url, 'rb') as f:
        return f.read()
def get404():
    with open(filePath+"notfound.html", 'rb') as f:
        return f.read()
def getStop():
    with open(filePath+"stop.html", 'rb') as f:
        return f.read()



    
class MyHandler(SimpleHTTPRequestHandler):
    
    def __init__(self,req,client_addr,server):
        SimpleHTTPRequestHandler.__init__(self,req,client_addr,server)
    
    def do_GET(self):
        print self.path
        url = URLFromPath(self.path)
        print url
        response = None
        if isFileURL(url['url']):
            self.send_response(200)
            self.send_header("Content-type", getMIME(url['url']))
            response = getContent(url['url'])
        elif url['first'] in ['stop', 'close', 'quit']:
            global keepRunning
            keepRunning = False
            print "Server stopping..."
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            response = getStop()
        elif url['first'] in ['req']:
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            response = handleSearchRequest(url)
        elif url['first'] in ['sub']:
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            response = handleSubtitlesRequest(url)
        else:
            self.send_response(308)
            self.send_header("Location", index_url )
            self.end_headers()
            print "URL Not Found: ", url
        
        if response:
            self.send_header("Content-length", len(response))
            self.end_headers()
            self.wfile.write(response)
        else:
            self.end_headers()



def keep_running():
    return keepRunning


def printWelcome():
    os.system('cls')
    print "\n".join( [
            u" --------------------------------------------- ",
            u"",
            u"               Baie   Des   Pirates          ",
            u"",
            u" --------------------------------------------- ", "", "",
            u"       Bienvenue à bord Mousaillon !",
            u"  Pour commencer à écumer les mers",
            u"  Rendez-vous à l'adresse suivante:  ", "",
            u"    localhost:" + str(PORT), "",
            u"  Bon voyage !!", "", "",
            u" ------------------------------------- " ] )

def startServing(httpd):
    printWelcome()
    print("Serving at port", PORT)
    while keep_running():
        httpd.handle_request()
    httpd.server_close()
    print "Stopped serving"



try:
    httpd = SocketServer.TCPServer(("", PORT), MyHandler)
    th = Thread(target=startServing, args=(httpd,) )
    th.start()
    webbrowser.open_new_tab( index_url )
    th.join()
except Exception as exc:
    print "Socket Server erreur !!!"
    raise exc


print "Tout s'est bien passé"


