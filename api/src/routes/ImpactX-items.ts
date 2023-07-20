/**
 * Flow-ImpactX Router
 * 
 * Router class that defines API REST endpoints used for minting and moving Flow-ImpactX.
 * Endpoints call ImpactX-items service with request data.
 *
 */
import express, {Request, Response, Router} from "express"
import {body} from "express-validator"
import {validateRequest} from "../middlewares/validate-request"
import {ImpactXItemsService} from "../services/ImpactX-items"

function initImpactXItemsRouter(ImpactXItemsService: ImpactXItemsService): Router {
  const router = express.Router()

  router.post(
    "/ImpactX-items/mint",
    [body("recipient").exists()],
    validateRequest,
    async (req: Request, res: Response) => {
      const {recipient} = req.body
      const tx = await ImpactXItemsService.mint(recipient)
      return res.send({
        transaction: tx,
      })
    }
  )

  router.post(
    "/ImpactX-items/mint-and-list",
    [body("recipient").exists()],
    validateRequest,
    async (req: Request, res: Response) => {
      const {recipient} = req.body
      const tx = await ImpactXItemsService.mintAndList(recipient)
      return res.send({
        transaction: tx,
      })
    }
  )

  router.post("/ImpactX-items/setup", async (req: Request, res: Response) => {
    const transaction = await ImpactXItemsService.setupAccount()
    return res.send({
      transaction,
    })
  })

  router.post(
    "/ImpactX-items/transfer",
    [body("recipient").exists(), body("itemID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const {recipient, itemID} = req.body
      const tx = await ImpactXItemsService.transfer(recipient, itemID)
      return res.send({
        transaction: tx,
      })
    }
  )

  router.get(
    "/ImpactX-items/collection/:account",
    async (req: Request, res: Response) => {
      const collection = await ImpactXItemsService.getCollectionIds(
        req.params.account
      )
      return res.send({
        collection,
      })
    }
  )

  router.get(
    "/ImpactX-items/item/:address/:itemID",
    async (req: Request, res: Response) => {
      const item = await ImpactXItemsService.getImpactXItem(
        req.params.itemID,
        req.params.address
      )
      return res.send({
        item,
      })
    }
  )

  router.get("/ImpactX-items/supply", async (req: Request, res: Response) => {
    const supply = await ImpactXItemsService.getSupply()
    return res.send({
      supply,
    })
  })

  return router
}

export default initImpactXItemsRouter
