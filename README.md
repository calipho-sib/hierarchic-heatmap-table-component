# Generic-protein-expression-view
Generic protein expression view for Human Body

## Ready For GSoC 2016

How to run the demo:

1. install python and flask(A python back-end framework)
2. Enter the `server` folder
3. Run `python server.py`

Todo:

1. Use the API in this page(https://search.nextprot.org/help/learn-programmatic-access), and got the json data from it.
2. Analyze the json with [nextprot-js library](https://github.com/calipho-sib/nextprot-js) and got 2 field "cvTermName" and "expressionLevel"
3. Find what the all possible values about them
4. Fill a table according the value
5. According the field-value table, create a heat map(like [this](http://peppsy.genouest.org/bodymap?id=NX_P68133&nextprot_release=release_2015-10-07&hgnc=ACTA1&description=Actin%2C%20alpha%20skeletal%20muscle#)) with javascript(D3.js), get a very similar [result](http://www.nextprot.org/db/entry/NX_P01308/expression), but with the new viewer