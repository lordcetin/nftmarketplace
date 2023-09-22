
import contentnfts from "@/components/contentnfts";

module.exports = async (req, res) => {
  let nftData = await contentnfts();
  res.json({message: "Hello, World!"})
  res.status(200).json(nftData);
}


