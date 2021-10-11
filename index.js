import { createServer } from "http";
import { Server } from "socket.io";
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.emit("hi", "hello")
    socket.on('peerID', (roomID, id) => {
        console.log("peer client id ", id, roomID);
    })

    socket.on("makecall", (roomID) => {
        const clientsIDs = io.sockets.adapter.rooms.get(roomID);
        //get first client socket id
        if (clientsIDs) {
            let firstClient = Object.keys(clientsIDs)[0];
            io.to(firstClient).emit("callButton", {});
        }
    })

    socket.on('roomJoin', (data) => {
        let friend;
        //join in that room
        socket.join(data.roomID);
        console.log(`socket ID Room ${data.roomID}`);
        //get all the sockets (or) clients present in the particular room
        const clientsIDs = io.sockets.adapter.rooms.get(data.roomID);
        clientsIDs[socket.id] = data;
        //const peerIDs=io.sockets.adapter.rooms.get(peerId);
        const noOfClients = io.sockets.adapter.rooms.get(data.roomID).size;
        console.log(`No.of clients present in that room ${noOfClients}`);
        console.log(`clients IDs `, clientsIDs)
        //if 2 clients or sockets present. then send the socketID of other person
        if (noOfClients >= 2) {
            let ids = [];
            console.log("clients in that room ", clientsIDs)
            /* VJGyuKPL47qkFRCCAAAD: { roomID: '54378', myId: '6d21f990-d32e-4031-b939-f6dc4353c8b6' },
                'D-5rI0sIk2NdSgT-AAAF': { roomID: '54378', myId: '5d7ee582-a37a-4f97-bf3a-20fc339d3654' } */

            for (const key in clientsIDs) {
                console.log("individual id", key)
                // ids.push(key)

                io.to(key).emit('peersData', clientsIDs)
            }
            // console.log("ids ",ids)
        }/* 
    
    clientsIDs.forEach((value, index) => {
        console.log(value)
        if (socket.id !== value) {
            friend = value;
        let friendPeerId=peerId;
            //send another socketID to another peer
            socket.to(friend).emit('friends', { friendPeerId })
        
    }}); */

    });



});//connection close

httpServer.listen(5000, () => {
    console.log("conection estbalish")
});