
import contentnfts from "@/components/contentnfts";

module.exports = async (req, res) => {
  let nftData = await contentnfts();

  res.status(200).json(nftData);
}


