PAL={'a':'#4a2614','b':'#7a4628','c':'#9a6238','d':'#c48a50','s':'#fadcc2','t':'#eab496','e':'#26182a','i':'#3a64b8','j':'#86bcf4','w':'#ffffff','m':'#c0646c','p':'#f6a2a2',
 'q':'#24528f','r':'#3a7bc9','x':'#7cb8f0','g':'#3a482c','h':'#56683f','l':'#7a8e58','n':'#eee8dc','z':'#2e2622','y':'#e6be52','v':'#283650','f':'#3c5070',
 'B':'#2a1a10','C':'#5a3a26','D':'#80583a','P':'#3e2a18','Q':'#6b4a2a','R':'#8e6c44','G':'#1c1c20','H':'#5a5d64'}
W=24;HT=36
def blank(h=HT):return [['.']*W for _ in range(h)]
def put(g,y,x,s):
    for i,c in enumerate(s):
        if c!=' ' and 0<=y<len(g) and 0<=x+i<W:g[y][x+i]=c
def mirror(g,y0,y1):
    for y in range(y0,y1):
        for x in range(12):g[y][23-x]=g[y][x]
def overlay(dst,src,dy=0):
    for y in range(len(src)):
        for x in range(W):
            if src[y][x]!='.' and 0<=y+dy<HT:dst[y+dy][x]=src[y][x]
# ---------- FRONT ----------
def head_front(g):
    rows={1:"......b.bbbb",2:".....bbbccdd",3:"....bbbcdddd",4:"...bbbcddddc",5:"..bbbbccccbb",6:".bbbbbbbbbbb",7:".aabbbbbabbb",8:"..abbbbbabbb",9:".a.........."}
    for y,s in rows.items():put(g,y,0,s)
    end={2:13,3:16,4:17,5:10,6:11,7:10,8:12,9:11,10:9,11:10}
    for c,e in end.items():
        for y in range(9,e+1):g[y][c]='a' if (y==e or c==2) else 'b'
    for y in range(9,12):g[y][4]='b'
    face={9:4,10:4,11:4,12:4,13:4,14:4,15:4,16:4,17:5,18:6,19:8}
    for y,x0 in face.items():
        for x in range(x0,12):
            if g[y][x]=='.':g[y][x]='s'
    for x in range(4,12):
        for y in range(9,15):
            if g[y][x]=='s' and g[y-1][x] in 'ab':g[y][x]='t';break
    mirror(g,0,20)
    put(g,0,12,'bb');put(g,1,11,'.')
    for ex,fl in((6,5),(15,18)):
        put(g,12,min(ex,fl),'eeee');put(g,13,ex,'wii');put(g,14,ex,'iei');put(g,15,ex,'iei');put(g,16,ex,'jjj')
    put(g,17,5,'pp');put(g,17,17,'pp');put(g,18,11,'mm')
    for y in range(2,18):
        for x in range(17,22):
            if g[y][x]=='d':g[y][x]='c'
            elif g[y][x]=='c' and x>=18:g[y][x]='b'
            elif g[y][x]=='b' and x>=20:g[y][x]='a'
    put(g,19,8,'tttssttt')
def body_front(g,arm,back=False):
    put(g,20,6,'qrrrrrrrrrrq');put(g,21,5,'qrrrrxxrrrrrq' if not back else 'qrrrrrrrrrrrq');put(g,22,4,'llqqqqqqqqqqqqlg')
    for y in range(23,28):put(g,y,4,'lhhPhhgnnghhPhhg' if not back else 'lhhhhhhhhhhhhhhg')
    if back:
        for y,s in ((22,'RRRRRRRRRR'),(23,'QQQQQQQQQQ'),(24,'QRRRRRRRRQ'),(25,'QQQQyyQQQQ'),(26,'PPPPPPPPPP'),(27,'QQQQQQQQQQ')):put(g,y,7,s)
    else:
        for y in range(22,27):put(g,y,14,'rq')
        put(g,27,14,'qq')
    put(g,28,6,'zzzzzyyzzzzz' if not back else 'zzzzzzzzzzzz')
    la=28+(1 if arm==-1 else 0)-(1 if arm==1 else 0);ra=28+(1 if arm==1 else 0)-(1 if arm==-1 else 0)
    for y in range(23,30):
        if y>=la:g[y][4]=g[y][5]='.'
        if y>=ra:g[y][18]=g[y][19]='.'
    put(g,la,4,'ss');put(g,ra,18,'st')
def legs_front(g,f):
    for side,x0 in ((0,7),(1,13)):
        lift=1 if (f==1 and side==0) or (f==3 and side==1) else 0
        for i in range(4-lift):put(g,29+i,x0,'fffv' if side==0 else 'vfff')
        bx=x0-1 if side==0 else x0
        put(g,33-lift,bx,'CCCCC');put(g,34-lift,bx,'CDDCC' if side==0 else 'CCDDC');put(g,35-lift,bx,'BBBBB')
def front(f=0,pose='walk',back=False):
    g=blank();up=blank(31)
    if back:head_back(up)
    else:head_front(up)
    body_front(up,0 if pose!='walk' else {1:-1,3:1}.get(f,0) if not back else {1:1,3:-1}.get(f,0),back)
    if pose=='aim' and not back:
        for y in range(23,30):
            for x in (4,5,18,19):up[y][x]='.'
        put(up,23,5,'l');put(up,23,18,'g');put(up,24,5,'l');put(up,24,18,'g')
        put(up,25,8,'hssssssh'[:8]);put(up,26,10,'GGGG');put(up,27,11,'GG');put(up,28,11,'HG')
    legs_front(g,f if pose=='walk' else 0)
    overlay(g,up,-1 if (pose=='walk' and f in(1,3)) else 0)
    return g
def head_back(g):
    rows={1:"......b.bbbb",2:".....bbbccdd",3:"....bbbcdddd",4:"...bbbcddddc",5:"..bbbbccccbb",6:".bbbbbbbbbbb",7:".aabbbbbbbbb",9:".a.........."}
    for y,s in rows.items():put(g,y,0,s)
    for y in range(8,18):put(g,y,2,'abbbbbbbbb')
    put(g,17,2,'.abbabbabb');put(g,18,3,'a..a..a..')
    for y in range(9,17):g[y][6]='a'
    for y in range(9,12):g[y][7]='c'
    for y in range(7,15):g[y][9]='a'
    for y in range(7,10):g[y][10]='c'
    put(g,18,9,'..');mirror(g,0,19);put(g,0,11,'bb');put(g,1,13,'b')
    for y in range(2,18):
        for x in range(17,22):
            if g[y][x]=='d':g[y][x]='c'
            elif g[y][x]=='b' and x>=20:g[y][x]='a'
    put(g,19,9,'tssssst')
# ---------- SIDE (right) ----------
def head_side(g):
    P=[(0,10,'bb'),(1,5,'b.bbbbbbb'),(2,4,'bbbccddddbb'),(3,3,'bbbcddddddcb'),(4,2,'bbbcddddccbbbb'),(5,1,'bbbbccccbbbbbbbb'),(6,1,'b'),(7,1,'a'),(9,1,'a'),
       (6,2,'abbbbbbbbbbbbbbbb'),(7,2,'abbbbbbbbbbbbbbbbbb'),(8,2,'abbbbbbbbbbbbbbbbbba'),(9,2,'abbbbbbbbbbbbbbbbbat'),
       (10,2,'a'+'b'*13+'a'+'b'+'a'+'ts'),(11,2,'a'+'b'*13+'s'+'a'+'sss'),(12,2,'a'+'b'*13+'s'+'eeee'+'s'),
       (13,2,'a'+'b'*8+'st'+'bbb'+'s'+'wi'+'ss'),(14,2,'a'+'b'*8+'st'+'bbb'+'s'+'ie'+'ss'),(15,2,'a'+'b'*8+'tt'+'bbb'+'s'+'ie'+'sss'),
       (16,2,'a'+'b'*8+'bb'+'bba'+'s'+'jj'+'s'),(17,3,'abbabbabba'+'ba'+'s'+'pps'),(18,4,'a.a.a.a.'),(18,13,'tsssm'),(19,13,'ttss')]
    for y,x,s in P:put(g,y,x,s)
    for y in range(8,16):g[y][6]='a'
    for y in range(8,11):g[y][7]='c'
    for y in range(7,12):g[y][10]='a'
def body_side(g,arm):
    put(g,20,8,'qrrrrrrq');put(g,21,6,'rrqrxxrrq');put(g,22,4,'RQQrllllll')
    for y in range(23,28):put(g,y,4,'QQQr' if y<26 else 'QQQQ');put(g,y,8,'ghhhhhhn')
    put(g,24,4,'RQQ');put(g,28,4,'PPPP');put(g,28,8,'zzzzzzzy')
    if arm is not None:
        x=11+arm
        for y in range(23,28):put(g,y,x,'lh')
        put(g,28,x,'ss')
def legs_side(g,f):
    if f in(1,3):
        sv=1 if f==1 else -1
        for i in range(4):put(g,29+i,10-(i+1)//2*sv,'vvv')
        put(g,33,10-2*sv-(1 if sv>0 else 0),'CCCC');put(g,34,10-2*sv-(1 if sv>0 else 0),'BBBB')
        for i in range(4):put(g,29+i,11+(i+1)//2*sv,'fff')
        put(g,33,11+2*sv,'CCCCC');put(g,34,11+2*sv,'BBBBB')
    else:
        a,b=('vvv','fff') if f==0 else ('fff','vvv')
        for i in range(3):put(g,29+i,9,a)
        put(g,32,8,'CCCC');put(g,33,8,'BBBB')
        for i in range(4):put(g,29+i,11,b)
        put(g,33,11,'CCCCC');put(g,34,11,'CDDCC');put(g,35,11,'BBBBB')
def side(f=0,pose='walk'):
    g=blank();up=blank(31);head_side(up)
    if pose=='aim':
        body_side(up,None);put(up,23,11,'lhhhh');put(up,24,11,'ghhhh');put(up,23,15,'ss');put(up,24,15,'st')
        put(up,22,16,'GGGGGG');put(up,22,17,'HHHH');put(up,23,16,'GG');put(up,24,16,'G');put(up,25,16,'G')
    else:body_side(up,{0:0,1:-1,2:0,3:1}[f] if pose=='walk' else 0)
    if pose=='walk':legs_side(g,f);bob={0:-1,1:0,2:-1,3:0}[f]
    else:
        for i in range(4):put(g,29+i,10,'vfff')
        put(g,33,10,'CCCCC');put(g,34,10,'CCDDC');put(g,35,10,'BBBBB');bob=0
    if pose=='walk' and f in(1,3):
        for y in range(33,36):
            pass
    overlay(g,up,bob+ (1 if pose=='walk' and f in (1,3) else 0))
    return g
def frame(v,f,pose='walk'):
    if v=='u':return front(f,pose,True)
    return {'d':front,'r':side}[v](f,pose)
