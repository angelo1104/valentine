import crypto from "crypto";

console.log(crypto.createHash("sha512").update("200").digest("hex"));
