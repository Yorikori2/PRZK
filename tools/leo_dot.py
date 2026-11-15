PAL={'a':'#4a2614','b':'#7a4628','c':'#9a6238','d':'#c48a50','s':'#f8d6ba','t':'#e6b090','u':'#fff0e2','e':'#2a1a2e','i':'#3a64b8','j':'#7ab0f0','w':'#ffffff','m':'#c0646c','p':'#f4a0a0',
 'q':'#2a5a99','r':'#3a7bc9','x':'#78b4ee','g':'#3e4c30','h':'#5a6b45','l':'#7a8c5c','n':'#ece6da','o':'#cfc6b6','z':'#2e2622','y':'#e0b850','v':'#2c3a52','f':'#3f5270','k':'#566a8c',
 'B':'#2e1e14','C':'#5a3a26','D':'#7a5236','P':'#3e2a18','Q':'#6b4a2a','R':'#8e6c44','G':'#1e1e22','H':'#55585e'}
W=24;HT=40
def blank(h=HT):return [['.']*W for _ in range(h)]
def put(g,y,x,s):
    for i,c in enumerate(s):
        if c!=' ' and 0<=y<len(g) and 0<=x+i<W:g[y][x+i]=c
def mirror(g,y0,y1):
    for y in range(y0,y1):
        for x in range(12):g[y][23-x]=g[y][x]
# ================= FRONT (down) =================
def head_front(g):
    # crown: top plane visible (3/4 view) -> wide highlight band
    put(g,0,11,'bb');put(g,1,10,'bcb')
    rows={2:"......b.bbbb",3:".....bbbcccb",4:"....bbccdddc",5:"...bbcddddcc",6:"..bbbcccccbb",7:"..abbbbbbbab",8:"...abbbbbbab"}
    for y,s in rows.items():put(g,y,0,s)
    # bangs: last hair row for each column (left half, col 3..11). clumps: (6,7) (8,9,10) (11) ; sidelocks 3,4,5
    end={3:14,4:16,5:17,6:10,7:11,8:11,9:12,10:10,11:9}
    for c,e in end.items():
        for y in range(9,e+1):g[y][c]='a' if y==e else ('a' if c==3 else 'b')
    for y in range(9,11):g[y][5]='b'
    # separation line between clumps
    for y in range(7,10):g[y][7]='a' if y>7 else g[y][7]
    # face skin (left half), rows below bangs
    face={9:5,10:5,11:5,12:5,13:5,14:5,15:5,16:5,17:6,18:8}
    for y,x0 in face.items():
        for x in range(x0,12):
            if g[y][x]=='.':g[y][x]='s'
    # shadow of bangs on forehead
    for x in range(5,12):
        for y in range(9,14):
            if g[y][x]=='s' and g[y-1][x] in 'ab':g[y][x]='t';break
    mirror(g,0,19)
    put(g,0,11,'bb');put(g,1,10,'bcb.')  # asymmetric ahoge
    # eyes (lash flick outward, highlight top-left in both = consistent light)
    for ex,fl in((7,6),(14,17)):
        put(g,12,min(ex,fl),'eeee');put(g,13,ex,'wii');put(g,14,ex,'iei');put(g,15,ex,'jjj')
    put(g,16,6,'pp');put(g,16,16,'pp');put(g,17,11,'m')
    # right side of hair a bit darker (light from top-left)
    for y in range(3,17):
        for x in (18,19,20):
            if g[y][x]=='b' and x>=19:g[y][x]='a' if x==20 or y>9 else 'b'
            if g[y][x]=='c' and x>=17:g[y][x]='b'
    put(g,18,8,'ttsssstt')
def body_front(g,arm):  # arm: -1 left arm forward, 1 right arm forward, 0 neutral
    put(g,19,10,'tsst')
    put(g,20,6,'qrrrrrrrrrrq');put(g,21,5,'qrrrxxxxrrrrq');put(g,22,4,'lllqqqqqqqqlll')  # shoulders' top plane lighter
    for y in range(23,30):
        put(g,y,4,'lhhhPhgnnghPhhhh')
        put(g,y,20,'h')
    for y in range(23,30):g[y][19]='h';g[y][20]='g'  # right arm darker (light from left)
    for y in range(22,28):put(g,y,14,'rq')         # scarf tail
    put(g,28,14,'qq')
    put(g,30,4,'..zzzzzyyzzzzz..')
    # hands; forward-swung arm hangs 1px lower, back arm 1px shorter
    la=29+(1 if arm==-1 else 0)-(1 if arm==1 else 0);ra=29+(1 if arm==1 else 0)-(1 if arm==-1 else 0)
    for y in range(23,32):
        if y>=la:g[y][4]=g[y][5]='.'
        if y>=ra:g[y][19]=g[y][20]='.'
    put(g,la,4,'ss');put(g,ra,19,'st')
def legs_front(g,f,y0=31):
    # 5-row legs (shortened 1px to sell the top-down angle) + 3-row boots
    for side,x0 in ((0,7),(1,13)):
        lift=1 if (f==1 and side==0) or (f==3 and side==1) else 0
        for i in range(5-lift):put(g,y0+i,x0,'fffv' if side==0 else 'vfff')
        bx=x0-1 if side==0 else x0
        put(g,y0+5-lift,bx,'CCCCC');put(g,y0+6-lift,bx,'CDDCC' if side==0 else 'CCDDC');put(g,y0+7-lift,bx,'BBBBB')
def front(f=0,pose='walk'):
    g=blank();bob=-1 if f in(1,3) else 0
    up=blank();head_front(up);body_front(up,{1:-1,3:1}.get(f,0) if pose!='aim' else 0)
    if pose=='aim':
        for y in range(23,32):
            for x in (4,5,19,20):up[y][x]='.'
        for y in range(23,27):up[y][5]='l';up[y][18]='g'
        put(up,27,8,'hsssssh');put(up,28,10,'GGGG');put(up,29,11,'GG');put(up,30,11,'HG')
    legs_front(g,f,31)
    for y in range(31):
        for x in range(W):
            if up[y][x]!='.' and 0<=y+bob:g[y+bob][x]=up[y][x]
    return g
# ================= BACK (up) =================
def back(f=0,pose='walk'):
    g=blank();bob=-1 if f in(1,3) else 0;up=blank()
    put(up,0,11,'bb');put(up,1,10,'bcb')
    rows={2:"......b.bbbb",3:".....bbbcccb",4:"....bbccdddc",5:"...bbcddddcc",6:"..bbbcccccbb",7:"..abbbbbbbbb",8:"...abbbbbbbb",9:"...abbbbbbbb",
          10:"...abbbbbbbb",11:"...abbbbbbbb",12:"...abbbbbbbb",13:"...abbbbbbbb",14:"...abbbbbbbb",15:"....abbbbbbb",16:"....abbabbab",17:".....a..a..a"}
    for y in range(9,16):up[y][7]='a'
    for y in range(9,12):up[y][8]='c'
    for y in range(7,14):up[y][10]='a'
    for y in range(7,10):up[y][11]='c'
    for y,s in rows.items():put(up,y,0,s)
    for y in range(9,16):up[y][7]='a'
    for y in range(9,12):up[y][8]='c'
    for y in range(7,14):up[y][10]='a'
    for y in range(7,10):up[y][11]='c'
    mirror(up,0,18);put(up,0,11,'bb');put(up,1,10,'bcb.')
    for y in range(3,17):
        for x in (19,20):
            if up[y][x]=='b':up[y][x]='a'
    put(up,18,10,'tsst');put(up,19,10,'tsst')
    put(up,20,6,'qrrrrrrrrrrq');put(up,21,5,'qrrrrrrrrrrrq');put(up,22,4,'lllqqqqqqqqlll')
    arm={1:1,3:-1}.get(f,0)  # seen from behind: mirrored
    for y in range(23,30):put(up,y,4,'lhhRRRRRRRRRRhgh')
    for y,s in ((23,'QQQQQQQQQQ'),(24,'QRRRRRRRRQ'),(25,'QQQQyyQQQQ'),(26,'PPPPPPPPPP'),(27,'QQQQQQQQQQ'),(28,'QQQQQQQQQQ'),(29,'PPPPPPPPPP')):put(up,y,7,s)
    put(up,30,4,'..zzzzzzzzzzzz..')
    la=29+(1 if arm==-1 else 0)-(1 if arm==1 else 0);ra=29+(1 if arm==1 else 0)-(1 if arm==-1 else 0)
    for y in range(23,32):
        if y>=la:up[y][4]=up[y][5]='.'
        if y>=ra:up[y][18]=up[y][19]='.'
    put(up,la,4,'ss');put(up,ra,18,'st')
    legs_front(g,f,31)
    for y in range(31):
        for x in range(W):
            if up[y][x]!='.' and 0<=y+bob:g[y+bob][x]=up[y][x]
    return g
# ================= SIDE (facing right) =================
def head_side(g):
    P=[(0,10,'bb'),(1,11,'bcb'),(2,6,'b.bbbbbb'),(3,4,'bbbbcccbbbb'),(4,3,'bbccdddcbbbb'),(5,2,'bbcddddccbbbb'),(6,1,'bbbcccccbbbbbbb'),
       (7,1,'abbbbbbbbbbbbbbbb'),(8,2,'abbbbbbbbbbbbbbbbb'),(9,2,'abbbbbbbbbbbbbbbbba'),(10,2,'abbbbbbbbbbbbbbbbat'),
       (11,2,'abbbbbbbbbbbbbbat'+'ss'),(12,2,'abbbbbbbbbbbbba'+'tseee'),(13,2,'abbbbbbbb'+'st'+'bbbb'+'sswis'),(14,2,'abbbbbbbb'+'st'+'bbbb'+'ssiess'),
       (15,2,'abbbbbbbb'+'tt'+'bbba'+'ssjjs'),(16,3,'abbabbabbb'+'bab'+'spsm'),(17,4,'a.a.abab.a'),(17,14,'ssss'),(18,13,'ttsst')]
    for y,x,s in P:put(g,y,x,s)
    for y in range(9,16):g[y][6]='a'
    for y in range(9,12):g[y][7]='c'
    for y in range(8,13):g[y][11]='a' if g[y][11]=='b' else g[y][11]
    for y in range(8,10):g[y][12]='c'
def body_side(g,arm):
    put(g,19,12,'tss')
    put(g,20,8,'qrrrrrrq');put(g,21,6,'rrqrxxrrq');put(g,22,5,'RQrlllllll')
    for y in range(23,30):put(g,y,4,'QQQ' if y%3 else 'RQQ')
    for y in range(23,27):put(g,y,7,'r')
    for y in range(27,30):put(g,y,7,'Q')
    put(g,30,4,'PPPP')
    for y in range(23,30):put(g,y,8,'ghhhhhhn')
    put(g,30,8,'zzzzzzzy')
    if arm is not None:
        x=11+arm
        for y in range(23,29):put(g,y,x,'lhg' if arm<0 else 'lh')
        put(g,29,x,'ss')
def legs_side(g,f,y0=31):
    # f: 0 passing(A), 1 contact (near leg forward), 2 passing(B), 3 contact (far leg forward)
    if f in (1,3):
        sv=1 if f==1 else -1
        far,near=('v','f')
        # far leg
        for i in range(5):sh=(i+1)//2*(-sv);put(g,y0+i,10+sh,far*3)
        bx=10-3*sv;put(g,y0+5,bx-1 if sv>0 else bx,'BCCC' if sv>0 else 'CCCCB'[:4]);put(g,y0+6,bx-1 if sv>0 else bx,'BBBB')
        for i in range(5):sh=(i+1)//2*sv;put(g,y0+i,11+sh,near*3)
        fx=11+3*sv;put(g,y0+5,fx,'CCCCC');put(g,y0+6,fx,'BBBBB')
    else:
        lift_back= f==0
        # standing leg straight
        for i in range(5):put(g,y0+i,11,'fff' if f==0 else 'vvv')
        put(g,y0+5,11,'CCCCC');put(g,y0+6,11,'CDDCC');put(g,y0+7,11,'BBBBB')
        # passing leg: knee bent, foot lifted 2px, slightly behind
        lc='vvv' if f==0 else 'fff'
        for i in range(4):put(g,y0+i,10-(i//3),lc)
        put(g,y0+4,8,'CCCC');put(g,y0+5,8,'BBBB')
def side(f=0,pose='walk'):
    g=blank();up=blank();head_side(up)
    bob={0:-1,1:0,2:-1,3:0}[f] if pose=='walk' else 0
    if pose=='aim':
        body_side(up,None);put(up,23,11,'lhhhh');put(up,24,11,'ghhhh');put(up,23,16,'ss');put(up,24,16,'st')
        put(up,22,17,'GGGGGG');put(up,22,18,'HHHH');put(up,23,17,'GG');put(up,24,17,'G');put(up,25,17,'G')
    else:body_side(up,{0:0,1:-1,2:0,3:1}[f] if pose=='walk' else 0)
    if pose=='walk':legs_side(g,f,32)
    else:
        for i in range(5):put(g,32+i,11,'vff');
        put(g,37,10,'CCCCCC');put(g,38,10,'CCDDCC');put(g,39,10,'BBBBBB')
    for y in range(31):
        for x in range(W):
            if up[y][x]!='.' and 0<=y+bob+1<HT:g[y+bob+1][x]=up[y][x]
    return g
def frame(v,f,pose='walk'):
    return {'d':front,'u':back,'r':side}[v](f,pose)
