import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { sepolia, } from "wagmi/chains";

export const scrollChain = {
  id: 534351,
  name: "Scroll Sepolia",
  network: "Scroll sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    http: ["https://scroll-sepolia.blockpi.network/v1/rpc/public"],
    default: "https://scroll-sepolia.blockpi.network/v1/rpc/public",
  },
  blockExplorers: {
    default: { name: "ScrollScan", url: "https://sepolia.scrollscan.com/" },
  },
  testnet: true
};

const { chains, provider } = configureChains(
  //@ts-ignore
  [scrollChain],
  [
    jsonRpcProvider({
      rpc: (chain: Chain) => ({
        http: 'https://scroll-sepolia.blockpi.network/v1/rpc/public',
        // wss: 'wss://eth-sepolia.g.alchemy.com/v2/gSjO4iw0TH4xnWrpobKxM9E-l323GFcP',
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Escrow",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          showRecentTransactions={true}
          modalSize="compact"
          chains={chains}
        >
          <Component {...pageProps} />;
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}
