import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map(); // Map<code, { players: WebSocket[], creator: WebSocket }>

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'create') {
      let code;
      do {
        code = generateCode();
      } while (rooms.has(code));
      rooms.set(code, { players: [ws], creator: ws });
      ws.send(JSON.stringify({ type: 'code', code }));
      ws.send(JSON.stringify({ type: 'player', value: 'white' }));
    }

    if (data.type === 'join') {
      const { code } = data;
      const room = rooms.get(code);
      if (!room) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid room code' }));
        ws.close();
        return;
      }
      if (room.players.length >= 2) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
        ws.close();
        return;
      }
      room.players.push(ws);
      ws.send(JSON.stringify({ type: 'player', value: 'black' }));
      room.creator.send(JSON.stringify({ type: 'opponentJoined' }));
    }

    if (data.type === 'move') {
      const room = Array.from(rooms.values()).find((r) => r.players.includes(ws));
      if (room) {
        room.players.forEach((player) => {
          if (player !== ws && player.readyState === player.OPEN) {
            player.send(JSON.stringify({ type: 'move', move: data.move }));
          }
        });
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    const roomEntry = Array.from(rooms.entries()).find(([_, r]) => r.players.includes(ws));
    if (roomEntry) {
      const [code, room] = roomEntry;
      room.players = room.players.filter((p) => p !== ws);
      if (room.players.length === 0) {
        rooms.delete(code);
      } else {
        room.players.forEach((player) => {
          if (player.readyState === player.OPEN) {
            player.send(JSON.stringify({ type: 'opponentDisconnected' }));
          }
        });
      }
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');