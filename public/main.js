const Peer=require('simple-peer');
const socket=io();
let client={};
let totalClients=0;
var name=null;
var value=prompt("Enter you Name:");
console.log(value);

socket.on('broadcast',(data)=>{
    totalClients=data.description;
    console.log( "Fin:"+totalClients);
});
navigator.mediaDevices.getUserMedia({video:true,audio:true})
.then(stream=>{

    var videouser1=document.getElementById('user1');
    var nam=document.getElementById('name');
    nam.innerHTML=value;
    socket.emit("NewClient");
    videouser1.srcObject=stream;
    videouser1.play();

    function InitPeer(type) {
        let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
        peer.on('stream', function (stream) {
            myDiv(stream);
        })
            // peer.on('close', function () {
            //     peer.destroy()
            // })
        
        return peer;
    }

    

        //for peer of type init
        function MakePeer() {
            client.gotAnswer = false
            let peer = InitPeer('init')
            peer.on('signal', function (data) {
                if (!client.gotAnswer && value && data) {
                    socket.emit('peer2', {
                        'name':value,
                        'data':data
                    });
                }
            })
            client.peer = peer;
        }

        //for peer of type not init
        function FrontAnswer(offer) {
            name=offer.name;
            let peer = InitPeer('notInit')
            peer.on('signal', (data) => {
                socket.emit('peer1', {
                        'name':value,
                        'data':data
                });
            })
            peer.signal(offer.data)
            client.peer = peer;

        }

        function SignalAnswer(answer) {
            name=answer.name;
            client.gotAnswer = true
            let peer = client.peer
            peer.signal(answer.data);
        }

        function SessionActive() {
            document.write('Session Active. Please come back later')
        }

        function RemovePeer() {
            document.getElementById("user2").remove();
            //document.getElementById("muteText").remove();
            if (client.peer) {
                client.peer.destroy()
            }
        }
       


        socket.on('Client1', FrontAnswer)
        socket.on('Answer', SignalAnswer)
        socket.on('SessionActive', SessionActive)
        socket.on('Client2', MakePeer)
        socket.on('Disconnect', RemovePeer)
        
        console.log(client);
    
        
})
.catch(err=>console.log(err));

function myDiv(stream) {
    var div = document.createElement("Div");
    // var nam=document.getElementById('name');
    // nam.innerHTML=value;
    div.innerHTML = "Peer";
    div.style.margin.top="50px";
    div.style.width="400px";
    div.setAttribute('class', 'card');
    var video = document.createElement("video");
    video.id="user2";
    video.style.width="100%";
    video.srcObject=stream;
    video.play();
    var hr = document.createElement("hr");
    hr.style.border.width="0px";
    hr.style.height="2px";
    hr.style.color="grey";
    hr.style.background.color="gray";
    div.appendChild(video);
    div.appendChild(hr);
    var div1 = document.createElement("Div");
    div1.setAttribute('class', 'card-body');
    var h= document.createElement("h4");
    var pa = document.createElement("p");
    h.setAttribute('class', 'card-title');
    pa.setAttribute('class', 'card-text');
    h.id="namePeer";
    h.innerHTML =name; 
    pa.innerHTML="    My Friend      ";
    div1.appendChild(h);
    div1.appendChild(pa);
    div.appendChild(div1);
    document.getElementById("abc").appendChild(div);
  }


    
