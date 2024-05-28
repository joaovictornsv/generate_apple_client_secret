const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

class Client {
    constructor(id, team_id, private_key, kid) {
        this.id = id;
        this.team_id = team_id;
        this.private_key = private_key;
        this.kid = kid;
    }

    generateSecret() {
        const header = {
            alg: "ES256",
            kid: this.kid
        };
        const payload = {
            iss: this.team_id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 1 day later
            aud: "https://appleid.apple.com",
            sub: this.id
        };
        return jwt.sign(payload, this.private_key, { algorithm: "ES256", header: header });
    }
}

const clientId = process.env.CLIENT_ID; // com.example.app
const teamId = process.env.TEAM_ID; // ABC123DEF
const kid = process.env.KID; // GHI456JKL
const privateKey = fs.readFileSync(
  process.env.AUTH_KEY_PATH, // ./AuthKey_<KID>.p8
  'utf8'
);

const client = new Client(
  clientId,
  teamId,
  privateKey,
  kid
);

const client_id = client.id;
const client_secret = client.generateSecret();

console.log('Client ID:', client_id);
console.log('Client Secret:', client_secret);

