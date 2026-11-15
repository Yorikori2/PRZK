PAL={'a':'#4a2614','b':'#7a4628','c':'#9a6238','d':'#c48a50','s':'#f8d6ba','t':'#e6b090','u':'#fff0e2','e':'#2a1a2e','i':'#3a64b8','j':'#7ab0f0','w':'#ffffff','m':'#c0646c','p':'#f4a0a0',
 'q':'#2a5a99','r':'#3a7bc9','x':'#78b4ee','g':'#3e4c30','h':'#5a6b45','l':'#7a8c5c','n':'#ece6da','z':'#2e2622','y':'#e0b850','v':'#2c3a52','f':'#3f5270','k':'#566a8c',
 'B':'#2e1e14','C':'#5a3a26','D':'#7a5236','P':'#3e2a18','Q':'#6b4a2a','R':'#8e6c44'}
W=24
def M(h):
    assert len(h)==12,h
    return h+h[::-1]
def grid(rows):
    g=[list(r) for r in rows]
    for r in g: assert len(r)==W,(len(r),''.join(r))
    return g
def put(g,y,x,s):
    for i,c in enumerate(s):
        if c!=' ':g[y][x+i]=c
# ---------------- FRONT ----------------
FU=[ # upper body rows 0..30
"...........bb...........",
"..........bb............",
M("......b.bbbb"),M(".....bbbbccb"),M("....bbccddcb"),M("....bcddccbb"),M("..bbbbccbbbb"),
M("...abbbbbbbb"),M("..aabbbbbbbb"),M("...abbbbabba"),M("...abbabsbas"),M("...abbsasass"),
M("...abbssssss"),
M("...abbssssss"),M("...abbssssss"),M("...abbssssss"),
M("....abssssss"),M(".....assssss"),M("........tsss"),
M("..........ts"),
M("......qrrrrr"),M(".....qrrxxrr"),
M("....lhqqqqqq"),
M("....lhhhPhgn"),M("....lhhhPhgn"),M("....lhhhPhgn"),M("....lhhhPhgn"),M("....lhhhPhgn"),M("....lhhhPhgn"),
M("....sshhPhgn"),M("....tszzzzzy")]
def front():
    g=grid(FU)
    for ex,fl in((7,6),(14,17)):
        put(g,12,min(ex,fl),'eeee');put(g,13,ex,'wii');put(g,14,ex,'iei');put(g,15,ex,'jjj')
    put(g,16,6,'pp');put(g,16,16,'pp');put(g,17,11,'m')
    for y in range(4,16):
        if g[y][19]=='b':g[y][19]='a'
    put(g,3,7,'c');put(g,5,6,'d')
    # scarf tail (right side)
    for y in range(22,28):put(g,y,14,'rq')
    put(g,27,14,'qq')
    return g
FL={ # legs rows 31..39 for frames
 'idle':[M(".......fffv."),M(".......fffv."),M(".......fffv."),M(".......fffv."),M(".......fffv."),M(".......fffv."),M("......CCCCC."),M("......CDDCC."),M("......BBBBB.")],
}
# ---------------- BACK ----------------
BU=[FU[0],FU[1]]+[M("........bbbb"),M("......bbbccb"),M(".....bbcddcb"),M("....bbcddcbb"),M("...bbbccbbbb"),
M("...abbbbbbbb"),M("...abbbbcbbb"),M("...abbbbbbbb"),M("...abbbcbbbb"),M("...abbbbbbbb"),M("...abbbbbbbb"),M("...abbbbbbbb"),
M("...abbbbbbbb"),M("....abbbbabb"),M("....aababbab"),M(".....a.a.a.a"),M("..........ts"),
M("..........ts"),M("......qrrrrr"),M(".....qrrrrrr"),
M("....lhhRRRRR"),M("....lhhQQQQQ"),M("....lhhQRRRR"),M("....lhhQQQQy"),M("....lhhPPPPP"),M("....lhhQQQQQ"),M("....lhhQQQQQ"),
M("....sshQQQQQ"),M("....tsPPPPPP")]
def back():return grid(BU)

def blank(h=31):return [['.']*W for _ in range(h)]
def side():
    g=blank()
    P=[(0,11,'bb'),(1,12,'bb'),(2,7,'b.bbbbb'),(3,5,'bbbbccbbbbb'),(4,4,'bbccddcbbbbbb'),(5,3,'bbcddcbbbbbbbbb'),(6,1,'bbbbccbbbbbbbbbbbb'),
     (7,2,'abbbbbbbbbbbbbbbbb'),(8,1,'aabbbbbbbbbbbbbbbbbb'),(9,2,'abbbbbbbbbbbbbbbbbba'),(10,2,'abbbbbbbbbbbbbbbass'),
     (11,2,'a'+'b'*14+'a'+'ssss'),(12,2,'a'+'b'*12+'b'+'ss'+'eee'+'s'),(13,2,'a'+'b'*8+'st'+'bb'+'b'+'ss'+'s'+'wi'+'s'),
     (14,2,'a'+'b'*8+'st'+'bb'+'b'+'ss'+'s'+'ie'+'s'),(15,2,'a'+'b'*8+'tt'+'bb'+'a'+'sss'+'jj'),(16,3,'abbabbabbab'+'a'+'sssps'),
     (17,4,'a.a.a.a.a.'),(17,14,'ssssm'),(18,12,'ttssst'),(19,11,'tss'),
     (20,8,'qrrrrrq'),(21,7,'rqrxxrrq'),(22,5,'RQr'),(22,8,'qqqqqqq')]
    for y,x,t in P:put(g,y,x,t)
    for y in range(23,30):put(g,y,4,'QQQ' if y%3 else 'RQQ')
    for y in range(23,27):put(g,y,7,'r')
    for y in range(27,30):put(g,y,7,'Q')
    put(g,30,4,'PPPP')
    for y in range(23,29):put(g,y,8,'ghhhhhn')
    for y in range(6,16):
        if g[y][3]=='b':g[y][3]='c' if y in(6,7) else 'b'
    put(g,3,6,'c');put(g,4,6,'cd');put(g,5,5,'dd')
    put(g,29,8,'ghhhhhn');put(g,30,8,'zzzzzzy')
    return g
def side_arm(g,sw):  # front arm, sw=-1 back,0,1 forward
    x=10+sw
    for y in range(23,29):put(g,y,x,'lh')
    put(g,29,x,'ss')
def legs_front(f):
    L=[list(M(".......fffv.")) for _ in range(6)]+[list(M("......CCCCC.")),list(M("......CDDCC.")),list(M("......BBBBB."))]
    g=[['.']*W for _ in range(9)]
    def leg(x0,lift,inner):
        for i in range(6-lift):put(g,i,x0,'fffv' if inner>0 else 'vfff')
        put(g,6-lift,x0-(1 if inner>0 else 0),'CCCCC');put(g,7-lift,x0-(1 if inner>0 else 0),'CDDCC');put(g,8-lift,x0-(1 if inner>0 else 0),'BBBBB')
    leg(7,1 if f==1 else 0,1);leg(13,1 if f==3 else 0,-1)
    return g
def legs_side(sv):
    g=[['.']*W for _ in range(9)]
    for i in range(6):
        sh=(i//2)*sv
        put(g,i,10-sh if sv else 10,'vvv')
    bx=10-2*sv if sv else 10
    put(g,6,bx-1,'CCCC');put(g,7,bx-1,'CDCC');put(g,8,bx-1,'BBBB')
    for i in range(6):
        sh=(i//2)*sv
        put(g,i,11+sh if sv else 11,'fff')
    fx=11+2*sv if sv else 11
    put(g,6,fx,'CCCCC');put(g,7,fx,'CDDCC');put(g,8,fx,'BBBBB')
    return g
def compose(upper,legs,bob=0):
    g=[['.']*W for _ in range(40)]
    for y,r in enumerate(legs):
        for x,c in enumerate(r):
            if c!='.':g[31+y][x]=c
    for y,r in enumerate(upper):
        for x,c in enumerate(r):
            if c!='.' and 0<=y+bob<40:g[y+bob][x]=c
    return g
def frame(view,f):
    if view=='d':return compose(front(),legs_front(f),0)
    if view=='u':return compose(back(),legs_front(f),0)
    up=side();side_arm(up,[0,-1,0,1][f]);return compose(up,legs_side([0,1,0,-1][f]),1 if f%2 else 0)
PAL.update({'G':'#1e1e22','H':'#55585e'})
def aim(view):
    if view=='r':
        up=side();put(up,23,11,'lhhhh');put(up,24,11,'ghhhh');put(up,23,16,'ss');put(up,24,16,'st')
        put(up,22,17,'GGGGGG');put(up,22,18,'HHHH');put(up,23,17,'GG');put(up,24,17,'G');put(up,25,17,'G')
        return compose(up,legs_side(0),0)
    if view=='d':
        up=front();put(up,27,9,'hssssh');put(up,28,10,'GGGG');put(up,29,11,'GG');put(up,30,11,'GG')
        for y in (27,28):put(up,y,4,'..');put(up,y,18,'..')
        put(up,26,6,'h');put(up,26,17,'h')
        return compose(up,legs_front(0),0)
    return frame('u',0)
