import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletBalanceProvider } from "../context/useWalletBalance"
import dynamic from 'next/dynamic'
import { StateProvider } from '../context/StateProvider'
import reducer, { initialState } from '../context/reducer'

const WalletConnectionProvider = dynamic(
  () => import("../context/WalletConnectProvider"),
  {
    ssr: false,
  },
)


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <WalletBalanceProvider>
        <StateProvider
          initialState={initialState}
          reducer={reducer} >
          <Component {...pageProps} />
        </StateProvider>
      </WalletBalanceProvider>
    </WalletConnectionProvider>
  )
}

export default MyApp
