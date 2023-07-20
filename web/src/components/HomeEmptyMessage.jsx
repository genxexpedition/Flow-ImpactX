import {paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"
import Button, {ButtonLink} from "./Button"

export default function HomeEmptyMessage() {
  const {switchToAdminView} = useAppContext()
  return (
    <div
      className="flex justify-center my-12 text-center"
      data-cy="home-common"
    >
      <div className="bg-white border border-gray-200 p-6 w-[32rem] rounded-md inline-flex flex-col justify-center">
        <img
          src="/images/logo.png"
          alt="Flow-ImpactX"
          width="100"
          className="mx-auto mt-6 mb-4"
        />
        <h1 className="text-3xl font-semibold">Welcome to Flow-ImpactX</h1>
        <h3 className="text-xl font-semibold mb-6">
          Coding Solutions that Give Back
        </h3>

        <div className="bg-white border border-gray-200 p-6 rounded-md inline-flex flex-col justify-center">
          <b>Your marketplace is currently empty.</b>
          <p className="text-gray-light mb-5 mt-1">
            Get started by Minting and Donating. 
          </p>

          <Button onClick={switchToAdminView}>
            MINT YOUR FIRST MATERIAL DONATION
          </Button>

          <hr className="mt-8 mb-6" />

          <b>Check your NFT's Validity.</b>
          <p className="text-gray-light mb-5 mt-1 max-w-xs mx-auto">
            Click here to search the NFT on Blockchain and check if it is valid.
          </p>

          <ButtonLink href="https://f.dnz.dev/" target="_blank" color="outline">
            VIEW NFT's &amp; WALLET
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
