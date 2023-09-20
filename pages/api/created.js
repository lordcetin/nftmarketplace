
import creatednfts from "@/components/creatednfts";

export default async function handler(req, res) {
  let createdData = await creatednfts();
  res.status(200).json(createdData);
}


