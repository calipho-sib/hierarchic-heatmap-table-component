# -*- coding: utf-8 -*-
# @Author: linjinjin123
# @Date:   2016-05-01 01:02:22
# @Last Modified by:   linjinjin123
# @Last Modified time: 2016-05-01 18:51:38

import os
import random
import Queue
import cPickle as pickle
import json

def createTerm(termName, is_a, relationship):
    term = {}
    term['name'] = termName
    term['is_a'] = is_a
    term['relationship'] = relationship
    return term

def createJsonTerm(term):
    termJson = {}
    termJson['rowLabel'] = term['name']
    termJson['values'] = createValuesJson()
    termJson['children'] = []
    return termJson

def createValuesJson():
    valuesList = []
    microarrayJson = {}
    microarrayJson['columnLabel'] = 'Microarray'
    microarrayJson['value'] = generateValue()
    IHCJson = {}
    IHCJson['columnLabel'] = 'IHC'
    IHCJson['value'] = generateValue()
    valuesList.append(microarrayJson)
    valuesList.append(IHCJson)
    return valuesList


def generateValue():
    values = ['High', 'Moderate', 'Low', 'Negative']
    return values[random.randint(0, 3)]

data = {}
data['data'] = []
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
    # f = open("caloha.obo")
    # # f = open("test.txt")

    # #ignore the head context
    # while (f.readline().strip('\n') != '[Term]'): continue

    # termQue = Queue.Queue(maxsize = 3000)

    # line = None
    # line = f.readline().strip('\n')

    # while line != '[Typedef]':
    #     lineList = []
    #     lineList.append(line)
    #     termName = None
    #     is_a = None
    #     relationship = None
    #     line = f.readline().strip('\n')
    #     while line != '[Typedef]' and line != '[Term]':
    #         lineList.append(line)
    #         line = f.readline().strip('\n')
        
    #     for info in lineList:
    #         if info.find('name:') != -1: termName = info[info.find('name:')+6:]
    #         elif info.find('is_a:') != -1: is_a = info[info.find('!')+2:]
    #         elif info.find('relationship') != -1: relationship = info[info.find('!')+2:]

    #     if is_a == None and relationship == None:
    #         data['data'].append(createJsonTerm(createTerm(termName, is_a, relationship)))
    #     else:
    #         termQue.put(createTerm(termName, is_a, relationship))

    # count = 0
    # while not termQue.empty():
    #     # is_add = False
    #     term = termQue.get()
    #     # print 'Now the term is', term
    #     addTermToData(term, data['data'])
    #     if term['is_a'] != None or term['relationship'] != None :
    #         termQue.put(term)
    #     else:
    #         count += 1
    #         print 'add successfully'
    #         print 'Num:', count

    # picklestring = pickle.dump(data, open('./data.pkl', 'w'))

    data = pickle.load(open('./data.pkl'))
    # print data['data'][0]['rowLabel']

    f = open('caloha.json', 'w')
    f.write(json.dumps(data,indent=4, sort_keys=True)) 
    f.close() 