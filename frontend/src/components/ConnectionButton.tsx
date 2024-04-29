// import { WalletIcon } from "@/assets/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "./Button";
import WalletIcon from "@/icons/WalletIcon";

const ConnectionButton = () => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === "authenticated");
                return (
                    <div
                        {...(!ready && {
                            "aria-hidden": true,
                            style: {
                                opacity: 0,
                                pointerEvents: "none",
                                userSelect: "none",
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button
                                        className="w-[152px] text-white !h-[36px] !px-4 bg-[#6938EF] gap-x-2 !border border-[#7F56D9] !rounded-[24px] shdow-[0px,1px, 1px,rgba(16,24,40,0.05)]"
                                        onClick={openConnectModal}
                                    // type="button"
                                    >
                                        <WalletIcon />
                                        Connect Wallet
                                    </Button>
                                );
                            }
                            if (chain.unsupported) {
                                return (
                                    <Button
                                        className="w-[152px] !h-[36px] !px-4 bg-[#6938EF] gap-x-2 !border border-[#7F56D9] !rounded-[24px] shdow-[0px,1px, 1px,rgba(16,24,40,0.05)]"
                                        onClick={openChainModal}
                                    // type="button"
                                    >
                                        Wrong network
                                    </Button>
                                );
                            }
                            return (
                                <div style={{ display: "flex", gap: 12 }}>
                                    <Button
                                        onClick={openAccountModal}
                                        // type="button"
                                        className="w-[152px] !h-[36px] !px-4 bg-[#6938EF] gap-x-2 !border border-[#7F56D9] !rounded-[24px] shdow-[0px,1px, 1px,rgba(16,24,40,0.05)]"
                                    >
                                        <div className="text-white text-nowrap text-sm leading-[21px] bg-[#6938EF] rounded-[40px] mr-1">
                                            {account.displayBalance ? account.displayBalance : ""}
                                        </div>

                                        <span className="text-white hidden md:block mr-[10px]">{account.displayName}</span>
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: 999,
                                                    overflow: "hidden",
                                                    marginRight: 8,
                                                }}
                                            >
                                                <WalletIcon />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};

export { ConnectionButton as default };