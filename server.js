/**
 * EduDash Signaling Server — zero external dependencies
 * Uses Node.js built-in http + net + crypto for WebSocket handshake
 */
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const PORT = 3000;

// ── HTTP server ───────────────────────────────────────────
const server = http.createServer((req, res) => {
  let filePath = req.url === '/'        ? '/teacher.html'
    :            req.url === '/student' ? '/student.html'
    :            req.url;
  const fullPath = path.join(__dirname, 'public', filePath);
  const ext  = path.extname(fullPath);
  const mime = { '.html':'text/html','.css':'text/css','.js':'application/javascript' }[ext] || 'text/plain';
  fs.readFile(fullPath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

// ── In-memory state ───────────────────────────────────────
const sockets = new Set();
const peers   = new Map(); // socket -> { id, role, name, roomId }
const rooms   = new Map(); // roomId -> { teacher, students: Map<id,socket> }

// ── WebSocket codec ───────────────────────────────────────
function wsHandshake(socket, req) {
  const key    = req.headers['sec-websocket-key'];
  const accept = crypto.createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );
}

function decodeFrame(buf) {
  if (buf.length < 2) return null;
  const masked = (buf[1] & 0x80) !== 0;
  let len = buf[1] & 0x7f, off = 2;
  if (len === 126) { len = buf.readUInt16BE(2); off = 4; }
  else if (len === 127) { len = Number(buf.readBigUInt64BE(2)); off = 10; }
  if (buf.length < off + (masked ? 4 : 0) + len) return null;
  let payload;
  if (masked) {
    const mask = buf.slice(off, off + 4); off += 4;
    payload = Buffer.alloc(len);
    for (let i = 0; i < len; i++) payload[i] = buf[off + i] ^ mask[i % 4];
  } else { payload = buf.slice(off, off + len); }
  return { opcode: buf[0] & 0x0f, payload, total: off + len };
}

function encodeFrame(data) {
  const p = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  const n = p.length;
  const h = n < 126 ? Buffer.from([0x81, n])
    : n < 65536    ? (() => { const b=Buffer.alloc(4); b[0]=0x81;b[1]=126;b.writeUInt16BE(n,2);return b; })()
    :                (() => { const b=Buffer.alloc(10);b[0]=0x81;b[1]=127;b.writeBigUInt64BE(BigInt(n),2);return b; })();
  return Buffer.concat([h, p]);
}

function send(socket, obj) {
  try { socket.write(encodeFrame(JSON.stringify(obj))); } catch(e) {}
}

function broadcast(roomId, obj, exclude = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  [room.teacher, ...room.students.values()].filter(Boolean)
    .forEach(s => { if (s !== exclude) send(s, obj); });
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

// ── Message handler ───────────────────────────────────────
function onMessage(socket, raw) {
  let msg; try { msg = JSON.parse(raw); } catch { return; }
  const peer = peers.get(socket);

  switch (msg.type) {
    case 'join': {
      const { role, name, roomId } = msg;
      const id = uid();
      peers.set(socket, { id, role, name, roomId });
      if (!rooms.has(roomId)) rooms.set(roomId, { teacher: null, students: new Map() });
      const room = rooms.get(roomId);
      if (role === 'teacher') { room.teacher = socket; }
      else {
        room.students.set(id, socket);
        if (room.teacher) send(room.teacher, { type:'student-joined', id, name });
      }
      send(socket, { type:'joined', id, role });
      // Send participants list
      const list = [];
      if (room.teacher && room.teacher !== socket) {
        const tp = peers.get(room.teacher);
        if (tp) list.push({ id:tp.id, role:'teacher', name:tp.name });
      }
      room.students.forEach((sw) => {
        if (sw !== socket) { const sp=peers.get(sw); if(sp) list.push({id:sp.id,role:'student',name:sp.name}); }
      });
      send(socket, { type:'participants', list });
      break;
    }
    case 'offer': case 'answer': case 'ice-candidate': {
      const room = rooms.get(peer?.roomId);
      if (!room) break;
      const all = [room.teacher, ...room.students.values()].filter(Boolean);
      const target = all.find(s => peers.get(s)?.id === msg.targetId);
      if (target) send(target, { ...msg, fromId: peer.id });
      break;
    }
    case 'call-invite': {
      const room = rooms.get(peer?.roomId);
      if (!room) break;
      room.students.forEach(sw => {
        const sp = peers.get(sw);
        if (msg.targetId === 'all' || sp?.id === msg.targetId)
          send(sw, { type:'call-invite', fromId:peer.id, fromName:peer.name });
      });
      break;
    }
    case 'call-accepted': case 'call-declined': {
      const room = rooms.get(peer?.roomId);
      if (room?.teacher) send(room.teacher, { ...msg, fromId:peer.id, fromName:peer.name });
      break;
    }
    case 'chat':
      broadcast(peer?.roomId, { type:'chat', fromId:peer.id, fromName:peer.name, role:peer.role, text:msg.text, timestamp:Date.now() });
      break;
    case 'end-call':
      broadcast(peer?.roomId, { type:'call-ended', fromId:peer.id });
      break;
    case 'notification': {
      const room = rooms.get(peer?.roomId);
      if (!room) break;
      room.students.forEach(sw => send(sw, { type:'notification', text:msg.text, fromName:peer.name }));
      break;
    }
  }
}

function onClose(socket) {
  const peer = peers.get(socket);
  if (peer) {
    const room = rooms.get(peer.roomId);
    if (room) {
      if (peer.role === 'teacher') room.teacher = null;
      else room.students.delete(peer.id);
      broadcast(peer.roomId, { type:'peer-left', id:peer.id, name:peer.name, role:peer.role });
    }
  }
  peers.delete(socket);
  sockets.delete(socket);
}

// ── Upgrade handler ───────────────────────────────────────
server.on('upgrade', (req, socket) => {
  if (req.headers.upgrade?.toLowerCase() !== 'websocket') { socket.destroy(); return; }
  wsHandshake(socket, req);
  sockets.add(socket);
  let buffer = Buffer.alloc(0);
  socket.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const frame = decodeFrame(buffer);
      if (!frame) break;
      buffer = buffer.slice(frame.total);
      if (frame.opcode === 0x8) { socket.destroy(); break; }
      if (frame.opcode === 0x9) socket.write(Buffer.from([0x8a, 0])); // pong
      if (frame.opcode === 0x1 || frame.opcode === 0x2)
        onMessage(socket, frame.payload.toString('utf8'));
    }
  });
  socket.on('close', () => onClose(socket));
  socket.on('error', () => onClose(socket));
});

server.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════╗`);
  console.log(`║  EduDash — Real-Time Classroom        ║`);
  console.log(`╠═══════════════════════════════════════════╣`);
  console.log(`║  Teacher  →  http://localhost:${PORT}/         ║`);
  console.log(`║  Student  →  http://localhost:${PORT}/student  ║`);
  console.log(`╚═══════════════════════════════════════════╝\n`);
});
