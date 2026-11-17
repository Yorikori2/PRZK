/* Previous (smaller) house layouts, kept only for the before/after comparison sample. */
function houseA_old(A,hx,hy,v){const p=HP[v%4],X=x=>hx+x,Y=y=>hy+y;
 A.fl(X(40),Y(40),120,90,'wood');A.fl(X(160),Y(40),60,90,'small');A.fl(X(220),Y(40),140,90,'carpet');A.fl(X(40),Y(130),200,110,'wood');A.fl(X(240),Y(130),120,110,'tileK');
 A.dec(X(140),Y(240),30,90,(ox,oy)=>{R('#a8a49a',ox+X(122),oy+Y(244),26,84)});
 const n=(x0,x1,y,h)=>{const o=A.ox;R(['#c9b48f','#a9b8c4','#d1c3a3','#b7c4ad'][v%4],o+X(40),y,320,h);for(let x=o+X(46);x<o+X(360);x+=10)R('#ffffff20',x,y+2,1,h-12);R('#00000030',o+X(40),y+h-3,320,3);[X(70),X(250),X(310)].forEach(x=>winD(o+x,26,y,h))};
 A.hw(X(36),X(364),Y(40),30,n);A.vw(X(40),Y(40),Y(240),30);A.vw(X(360),Y(40),Y(240),30);A.hw(X(36),X(120),Y(240),8,p[0]);A.hw(X(150),X(364),Y(240),8,p[0]);
 hseg(A,X(40),X(360),Y(130),[[X(100),X(128)],[X(186),X(214)],[X(280),X(308)]]);A.vw(X(160),Y(40),Y(130));A.vw(X(220),Y(40),Y(130));vseg(A,X(240),Y(130),Y(240),[[Y(160),Y(196)]]);
 const c=['#6f9cc4','#c46f8a','#7fae6f','#c4a46f'][v%4];
 A.o('bed',X(50),Y(46),30,54,{c});A.o('wardrobe',X(120),Y(46),30,14);A.o('rug',X(60),Y(104),60,18,{v:v%3});
 A.o('tub',X(166),Y(44),50,24);A.o('toilet',X(166),Y(100),16,16);A.o('sink',X(202),Y(76),14,10);
 A.o('bed',X(230),Y(46),30,54,{c:'#a8b48a'});A.o('desk',X(296),Y(46),54,18);A.o('bookshelf',X(334),Y(80),20,44);
 A.o('tv',X(44),Y(134),48,10);A.o('rug',X(56),Y(160),120,48,{v:(v+1)%3});A.o('ctable',X(70),Y(180),48,12);A.o('sofa',X(46),Y(214),68,18,{c:['#5a6e8a','#8a5a5a','#6a7a4a','#7a6a5a'][v%4]});A.o('bookshelf',X(212),Y(202),22,32);A.o('plant',X(220),Y(136),14,10);
 A.o('fridge',X(248),Y(134),20,14);A.o('kitchen',X(316),Y(134),40,14);A.o('kitchen',X(342),Y(148),14,56,{stove:false});A.o('tableset',X(262),Y(176),56,40);
 A.o('bush',X(20),Y(250),24,14);A.o('bush',X(330),Y(250),24,14);A.o('tree',X(380),Y(40),26,14);
 A.roof(X(40),Y(40),320,200,p[2]);A.ent(X(135),Y(254),0,-1)}
function houseB_old(A,hx,hy,v){const p=HP[(v+2)%4],X=x=>hx+x,Y=y=>hy+y;
 A.fl(X(60),Y(60),200,150,'wood');A.fl(X(260),Y(60),80,70,'small');A.fl(X(260),Y(130),80,80,'concrete');
 A.dec(X(200),Y(210),30,110,(ox,oy)=>{R('#a8a49a',ox+X(206),oy+Y(214),26,104)});
 const n=(x0,x1,y,h)=>{const o=A.ox;R(['#d1c3a3','#b7c4ad','#c9b48f','#a9b8c4'][v%4],o+X(60),y,280,h);R('#00000030',o+X(60),y+h-3,280,3);[X(90),X(170)].forEach(x=>winD(o+x,30,y,h))};
 A.hw(X(56),X(344),Y(60),30,n);A.vw(X(60),Y(60),Y(210),30);A.vw(X(340),Y(60),Y(210),30);A.hw(X(56),X(204),Y(210),8,p[0]);A.hw(X(234),X(344),Y(210),8,p[0]);
 vseg(A,X(260),Y(60),Y(210),[[Y(150),Y(180)]]);hseg(A,X(260),X(340),Y(130),[[X(266),X(292)]]);
 A.o('bed',X(70),Y(66),54,30,{c:['#c46f8a','#6f9cc4','#7fae6f','#c4a46f'][v%4]});A.o('wardrobe',X(140),Y(66),30,14);A.o('kitchen',X(180),Y(64),74,14);A.o('fridge',X(232),Y(90),20,14);
 A.o('sofa',X(80),Y(124),84,18);A.o('rug',X(76),Y(148),96,42,{v:v%3});A.o('tv',X(96),Y(198),40,8);A.o('tableset',X(174),Y(112),56,40);A.o('plant',X(244),Y(190),14,10);
 A.o('toilet',X(268),Y(66),16,16);A.o('sink',X(300),Y(66),30,12);A.o('tool',X(306),Y(136),30,14);A.o('crate',X(310),Y(180),22,18);A.o('car',X(276),Y(240),56,28,{c:['#c9a42a','#3a6ea8','#8a8f95','#6b4a6b'][v%4],rust:1});
 A.o('tree',X(20),Y(80),26,14);A.o('bush',X(360),Y(170),24,14);
 A.roof(X(60),Y(60),280,150,p[2]);A.ent(X(219),Y(224),0,-1)}
