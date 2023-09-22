// Next.js API route support: https://nextjs.org/docshttps://testnet.cos-in.com/api/-routes/introduction

export default function handler(req, res) {
  res.json({message: "Hello, World!"})
  res.status(200).json({ name: 'John Doe' })
}
