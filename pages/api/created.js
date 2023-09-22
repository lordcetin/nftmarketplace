
import creatednfts from "@/components/creatednfts";

module.exports = async (req, res) => {
  let createdData = await creatednfts();
  res.status(200).json(createdData);
  res.json({message: "Hello, World!"})
}


