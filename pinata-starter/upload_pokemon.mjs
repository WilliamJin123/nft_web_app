import { PinataSDK } from "pinata";
import fs from "fs";
import { Blob } from "buffer";
import 'dotenv/config';
import { configDotenv } from "dotenv";



const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL
})

async function upload() {
    try {
    const blob = new Blob([fs.readFileSync("./hello-world.txt")]);
    const file = new File([blob], "hello-world.txt", { type: "text/plain"})
    const upload = await pinata.upload.public.file(file);
    console.log(upload)
  } catch (error) {
    console.log(error)
  }
}