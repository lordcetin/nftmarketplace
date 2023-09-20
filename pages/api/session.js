
import contentnfts from "@/components/contentnfts";

export default async function handler(req, res) {
  let nftData = await contentnfts();

  res.status(200).json(nftData);
}


