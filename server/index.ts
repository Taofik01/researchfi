import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { Indexer, ZgFile } from '@0gfoundation/0g-storage-ts-sdk'
import { ethers } from 'ethers'
import fs from 'fs'
import os from 'os'

dotenv.config()

const app = express()
app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://researchfi-ashen.vercel.app',
  ] 
}))
app.use(express.json())

const upload = multer({ dest: os.tmpdir() })

// Rate limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)
  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 3600000 })
    return true
  }
  if (record.count >= 50) return false
  record.count++
  return true
}

// AI Review
app.post('/api/review', async (req, res) => {
  const ip = req.ip || 'unknown'
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' })
  }

  const { title, abstract, category } = req.body
  if (!title || !abstract) {
    return res.status(400).json({ error: 'Title and abstract are required.' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a rigorous scientific peer reviewer. Analyse this research proposal and respond ONLY with a JSON object, no markdown, no preamble.

Title: ${title}
Category: ${category || 'General'}
Abstract: ${abstract}

Respond with exactly this structure:
{
  "summary": ["point 1", "point 2", "point 3"],
  "methodologyFlags": ["flag 1", "flag 2"],
  "score": <number 0-100>,
  "recommendation": "<approve|revise|reject>"
}`,
          },
        ],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json\n?|```\n?/g, '').trim()
    const parsed = JSON.parse(clean)
    return res.json(parsed)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'AI review failed.' })
  }
})

// 0G Storage Upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const ip = req.ip || 'unknown'
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded.' })
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file provided.' })
  }

  try {
    const evmRpc = 'https://rpc.ankr.com/0g_galileo_testnet_evm'
const indexerRpc = 'https://indexer-storage-testnet-turbo.0g.ai'

    const provider = new ethers.JsonRpcProvider(evmRpc)
    const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider)

    // Log balance and fee data for debugging
    const balance = await provider.getBalance(signer.address)
    const feeData = await provider.getFeeData()
    console.log('Wallet:', signer.address)
    console.log('Balance:', ethers.formatEther(balance), 'OG')
    console.log('Gas price:', feeData.gasPrice?.toString())
    console.log('MaxFeePerGas:', feeData.maxFeePerGas?.toString())

    const indexer = new Indexer(indexerRpc)

    const zgFile = await ZgFile.fromFilePath(req.file.path)
    const [tree, treeErr] = await zgFile.merkleTree()

    if (treeErr) throw new Error(`Merkle tree error: ${treeErr}`)

    const rootHash = tree!.rootHash()
    console.log('Root hash:', rootHash)

    const [tx, uploadErr] = await indexer.upload(zgFile, evmRpc, signer)

    await zgFile.close()
    fs.unlinkSync(req.file.path)

    if (uploadErr) throw new Error(`Upload error: ${uploadErr}`)

    return res.json({ rootHash, tx, success: true })
  } catch (err: any) {
    console.error('Storage upload error:', err.message)
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    return res.status(500).json({ error: err.message || 'Upload failed.' })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`ResearchFi server running on port ${process.env.PORT}`)
})