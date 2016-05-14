# -*- coding: utf-8 -*-
# @Author: linjinjin123
# @Date:   2016-05-01 01:02:22
# @Last Modified by:   linjinjin123
# @Last Modified time: 2016-05-06 19:11:46

import os
import random
import Queue
import cPickle as pickle
import json

def createTerm(termID, termName, is_a, relationship):
    term = {}
    term['termID'] = termID
    term['name'] = termName
    term['is_a'] = is_a
    term['relationship'] = relationship
    return term

def createJsonTerm(term):
    termJson = {}
    termJson['linkLabel'] = '[' + term['termID'] + ']'
    termJson['linkURL'] = 'http://www.nextprot.org/db/term/' + term['termID']
    termJson['rowLabel'] = term['name']
    termJson['values'] = createValuesJson()
    termJson['children'] = []
    return termJson

def createValuesJson():
    valuesList = []

    microarrayJson = {}
    microarrayJson['columnLabel'] = 'Microarray'
    microarrayJson['value'] = generateValue()
    valuesList.append(microarrayJson)
    
    IHCJson = {}
    IHCJson['columnLabel'] = 'IHC'
    IHCJson['value'] = generateValue()
    valuesList.append(IHCJson)
    
    ESTJson = {}
    ESTJson['columnLabel'] = 'EST'
    ESTJson['value'] = generateValue()
    valuesList.append(ESTJson)
    return valuesList


def generateValue():
    values = ['High', 'Moderate', 'Low', 'Negative']
    return values[random.randint(0, 3)]

data = {}
data['children'] = []
is_add = False

def addTermToData(term, dataList):
    global is_add
    for i in range(len(dataList)):
        if term['relationship'] != None and term['relationship'].lower() == dataList[i]['rowLabel'].lower():
            dataList[i]['children'].append(createJsonTerm(term))
            term['relationship'] = None
        if term['is_a'] != None and term['is_a'].lower() == dataList[i]['rowLabel'].lower():
            dataList[i]['children'].append(createJsonTerm(term))
            term['is_a'] = None
        addTermToData(term, dataList[i]['children'])

if __name__ == '__main__':
    f = open("caloha.obo")

    #ignore the head context
    while (f.readline().strip('\n') != '[Term]'): continue

    termQue = Queue.Queue(maxsize = 3000)

    line = None
    line = f.readline().strip('\n')

    while line != '[Typedef]':
        lineList = []
        lineList.append(line)
        termName = None
        is_a = None
        relationship = None
        line = f.readline().strip('\n')
        is_obsolete = False

        while line != '[Typedef]' and line != '[Term]':
            lineList.append(line)
            line = f.readline().strip('\n')
        
        for info in lineList:
            if info.find('id:') != -1: termID = info[info.find('id:')+4:]
            elif info.find('name:') != -1: termName = info[info.find('name:')+6:]
            elif info.find('is_a:') != -1: is_a = info[info.find('!')+2:]
            elif info.find('relationship') != -1: relationship = info[info.find('!')+2:]
            elif info.find('is_obsolete') != -1: is_obsolete = True

        if is_obsolete == True:
            continue

        if is_a == None and relationship == None:
            data['children'].append(createJsonTerm(createTerm(termID, termName, is_a, relationship)))
        else:
            termQue.put(createTerm(termID, termName, is_a, relationship))

    count = 0
    while not termQue.empty():
        term = termQue.get()
        addTermToData(term, data['children'])
        if term['is_a'] != None or term['relationship'] != None :
            termQue.put(term)
        else:
            count += 1
            print 'add successfully'
            print 'Num:', count

    f = open('data.json', 'w')
    f.write(json.dumps(data,indent=4, sort_keys=True)) 
    f.close() 