import {Request, Router} from 'express'

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPath: string
    workDir: string
  }
}
import {TOKEN_SUPPLY_PATH} from './../constants'
import { handleCreate, handleCancel, handlePublished, handleIconUrlRequest, handleGetPackages, handleGetFilteredPackages } from '../lib'

const CWD = process.cwd()
const TOKEN_PATH = `${CWD}/${TOKEN_SUPPLY_PATH}`
const WORK_DIR = process.env.WORK_DIR || `${CWD}/contracts`

export function createPackagesRouter(): Router {
  const router = Router()
  router.use((req: Request, res, next) => {
    req.tokenPath = TOKEN_PATH
    req.workDir = WORK_DIR
    next()
  })
  router.post('/create', async (req, res, next) => {
    try {
      await handleCreate(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.post('/cancel', async (req, res, next) => {
    try {
      await handleCancel(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.post('/published', async (req, res, next) => {
    try {
      await handlePublished(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.post('/generateIconURL', async (req, res, next) => {
    try {
      await handleIconUrlRequest(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.get('/:address', async (req, res, next) => {
    try {
      await handleGetPackages(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.get('/:address/:param', async (req, res, next) => {
    try {
      await handleGetFilteredPackages(req, res)
    } catch (error) {
      next(error)
    }
  })

  return router
}
