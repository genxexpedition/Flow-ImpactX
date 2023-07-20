import Link from "next/link"
import {useRouter} from "next/router"
import HeaderDropdown from "src/components/HeaderDropdown"
import HeaderFLOWBalance from "src/components/HeaderFLOWBalance"
import HeaderLink from "src/components/HeaderLink"
import {paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"
import useLogin from "src/hooks/useLogin"
import HeaderMessage from "./HeaderMessage"
import TransactionsIndicator from "./Transactions"

export default function Header() {
  const {currentUser} = useAppContext()
  const router = useRouter()
  const logIn = useLogin()
  const isAdminPath = router.pathname === paths.adminMint

  return (
    <header className="bg-white border-b border-gray-200">
      <HeaderMessage />
      <div className="flex justify-between py-4 main-container max-w-2">
        <Link href={paths.root} passHref>
          <a
            className="flex items-center hover:opacity-80"
            data-cy="header-left"
          >
            <div className="flex w-12 sm:w-auto">
              <img
                src="/images/logo.png"
                alt="Flow-ImpactX"
                width="60"
                height="60"
              />
            </div>
            <div className="ml-2 d-flex flex-column">
              <div className="text-sm font-bold sm:text-2xl lg:text-3xl sm:ml-3 text-gray-darkest">
                Flow-ImpactX
              </div>
              <div className="text-sm sm:ml-3 text-gray-darkest">
              Coding Solutions that Give Back
              </div>
            </div>
          </a>
        </Link>
        <div className="flex items-center" data-cy="header-right">
          {!isAdminPath && (
            <>
              <div className="mr-2 md:mr-4">
                <HeaderLink href={paths.root}>Donate with NFT</HeaderLink>
                <HeaderLink href={paths.adminMint}>Mint Donation NFT</HeaderLink>
                <HeaderLink href={paths.registration}>Register Company</HeaderLink>
              </div>
              {!!currentUser && (
                <div className="hidden mr-2 md:flex">
                  <HeaderFLOWBalance />
                </div>
              )}
              {currentUser ? (
                <HeaderDropdown />
              ) : (
                <button
                  onClick={logIn}
                  className="mr-2 text-sm text-gray-700 sm:text-lg md:text-xl"
                  data-cy="btn-log-in"
                >
                  Log In
                </button>
              )}
            </>
          )}
          <TransactionsIndicator />
        </div>
      </div>
    </header>
  )
}
