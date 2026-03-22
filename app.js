import express from 'express';
import dotenv from 'dotenv';
import sessionRoutes from './routes/sessionRoutes.js';
import missionRoutes from './routes/missionRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import cors from 'cors';

dotenv.config();

import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/foyu.duckdns.org/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/foyu.duckdns.org/fullchain.pem'),
};
const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://fo-yu.netlify.app'];
// CORS 옵션 설정
const corsOptions = {
  origin: function (origin, callback) {
    // origin이 undefined면(예: Postman, 서버-서버 통신)도 허용
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 필요시, 쿠키 인증 등을 사용할 경우
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', sessionRoutes);
app.use('/', missionRoutes);
app.use('/', summaryRoutes);

// const PORT = 8080;
// app.listen(PORT, () => {
//   console.log(`Server running on :${PORT}`);
// });
// https 의존성으로 certificate와 private key로 새로운 서버를 시작
https.createServer(options, app).listen(443, () => {
  console.log(`HTTPS server started on port 443`);
});
