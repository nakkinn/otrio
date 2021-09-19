let s,n=-1,dx,dy,x,y;
let mode=0,mn,mx1,my1,mx2,my2;
let ring=[]; 
let board=new Array(5);
for(let i=0;i<5;i++)    board[i]=new Array(5);
for(let i=0;i<5;i++)    for(let j=0;j<5;j++)    board[i][j]=new Array(3);
let peer,room;

function setup(){
    createCanvas(windowWidth,windowHeight);

    peer=new Peer({
        key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
        debug:1
    });
    peer.on('open',()=>{
        room=peer.joinRoom("ring",{
            mode:'sfu'
        });
        room.on('open',()=>{

        });
        room.on('peerJoin',peerId=>{
            console.log(peerId+"参加");
        });
        room.on('peerLeave',peerId=>{
            console.log(peerId+"退出");
        });
        room.on('data',message=>{
            console.log(message.data);
            receive(message.data);
        });
    });

    s=height/5;

    reset();
}

function draw(){
    background(255);
    for(let i=0;i<ring.length;i++)  ring[i].disp();

    for(let i=0;i<5;i++)    for(let j=0;j<5;j++){
        noStroke();
        stroke(0);
        strokeWeight(1);
        rect(s*i,s*j,s,s);
    }

    if(n!=-1){
        ring[n].x=mouseX-dx;
        ring[n].y=mouseY-dy;
    }

    if(mode>0){
        ring[mn].x=map(mode,30,1,mx1,mx2);
        ring[mn].y=map(mode,30,1,my1,my2);
        mode--;
    }
}

function mousePressed(){
    if(mode==0) for(let i=0;i<36;i++){
        d=dist(mouseX,mouseY,ring[i].x,ring[i].y);
        if(d>=ring[i].ri&&d<=ring[i].ro){
            n=i;
            dx=mouseX-ring[i].x;
            dy=mouseY-ring[i].y;
            x=ring[i].x;
            y=ring[i].y;
            break;
        }
    }
}

function mouseReleased(){
    if(n>=0){
        let c=int(ring[n].x/s),r=int(ring[n].y/s),flag=true;
        if(c>=0&&c<5&&r>=0&&r<5){
            if(!board[c][r][ring[n].n]){
                ring[n].x=s*int(ring[n].x/s)+s/2;
                ring[n].y=s*int(ring[n].y/s)+s/2;
                board[int(x/s)][int(y/s)][ring[n].n]=false;
                board[int(ring[n].x/s)][int(ring[n].y/s)][ring[n].n]=true;
                flag=false;
                room.send(n+','+int(x/s)+','+int(y/s)+','+c+','+r);
            }
        }
        if(flag){
            ring[n].x=x;
            ring[n].y=y;
        }
        n=-1;
    }
}

function keyPressed(){
    if(key=='r'){
        room.send("reset");
        reset();
    }
}

class Ring{
    constructor(x,y,n,c){
        this.x=x;
        this.y=y;
        this.n=n;
        if(n==0){
            this.ri=0;
            this.ro=s*0.2;
        }
        if(n==1){
            this.ri=s*0.25;
            this.ro=s*0.35;
        }
        if(n==2){
            this.ri=s*0.4;
            this.ro=s*0.49;
        }
        this.c=c;
    }

    disp(){
        stroke(this.c);
        strokeWeight(this.ro-this.ri);
        noFill();
        circle(this.x,this.y,this.ri+this.ro);
    }
}

function receive(m){
    if(m=="reset"){
        reset();
    }else if(m=="close"){
        room.clome();
    }else{
        m=m.split(',');
        for(let i=0;i<5;i++)    m[i]=int(m[i]);
        board[m[1]][m[2]][ring[m[0]].n]=false;
        board[m[3]][m[4]][ring[m[0]].n]=true;
        mx1=ring[m[0]].x;
        my1=ring[m[0]].y;
        mx2=m[3]*s+s/2;
        my2=m[4]*s+s/2;
        mode=30;
        mn=m[0]
    }
}

function reset(){
    for(let i=0;i<3;i++)    for(let j=0;j<3;j++)    ring[i*3+j]=new Ring(s*1.5+s*i,s*0.5,j,'#F18F01');
    for(let i=0;i<3;i++)    for(let j=0;j<3;j++)    ring[9+i*3+j]=new Ring(s*1.5+s*i,s*4.5,j,'#048BA8');
    for(let i=0;i<3;i++)    for(let j=0;j<3;j++)    ring[18+i*3+j]=new Ring(s*0.5,s*1.5+s*i,j,'#2E4057');
    for(let i=0;i<3;i++)    for(let j=0;j<3;j++)    ring[27+i*3+j]=new Ring(s*4.5,s*1.5+s*i,j,'#99C24D');

    for(let i=0;i<5;i++)    for(let j=0;j<5;j++)    for(let k=0;k<3;k++){
        if(i==0||i==4||j==0||j==4)    board[i][j][k]=true;
        else    board[i][j][k]=false;
    }
    for(let i=0;i<3;i++){
        board[0][0][i]=false;
        board[0][4][i]=false;
        board[4][0][i]=false;
        board[4][4][i]=false;
    }
}






















































































































































