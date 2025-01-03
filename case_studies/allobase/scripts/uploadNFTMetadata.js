// todo for nft metadata upload
import { NFTStorage, File } from "nft.storage"
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

async function storeAsset() {
   const client = new NFTStorage({ token: process.env.NFT_KEY })
   const metadata = await client.store({
       name: 'MyToken',
       description: 'This is a two-dimensional representation of a four-dimensional cube',
       image: new File(
           [await fs.promises.readFile('assets/cube.gif')],
           'cube.gif',
           { type: 'image/gif' }
       ),
   })
   console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)
}

storeAsset()
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });