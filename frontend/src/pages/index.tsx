import { CompiledCircuit } from "@noir-lang/noir_js";
import { useState } from "react";
import SuccessToastIcon from "@/icons/SuccessToastIcon";
import { toast } from "react-toastify";
import WarningIcon from "@/icons/WarningIcon";
import Button from "@/components/Button";

import { ScaleLoader } from "react-spinners";
import Link from "next/link";
import MobileLogo from "@/icons/MobileLogo";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import Escrow_abi from "./escrow_abi.json"
import circuit from "./circuits.json"
import ConnectionButton from "@/components/ConnectionButton";
import { Noir } from "@/utils/noir";

const ESCROW_CONTRACT_ADDRESS = "0xd94DF61114A6Bee794A5F34aDEF660D70825A443";

export default function Home() {
  const { address } = useAccount();
  const [noir, setNoir] = useState(new Noir(circuit as CompiledCircuit));
  const [proof, setProof] = useState(Uint8Array.from([]));
  const [tokenInfo, setTokenInfo] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState("merchant")

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setTokenInfo({
      ...tokenInfo,
      [name]: value,
    });
  };

  const input: any = {
    buyer: tokenInfo?.buyer,
    seller: address,
    arbiter: "0xb894Dfde1ca272C080E60261273BfFBe0C8355e9",
    amount: tokenInfo?.amount,
  };

  // Calculates proof
  const calculateProof = async () => {
    const calc = new Promise(async (resolve, reject) => {
      const witness = await noir.generateWitness(input);
      const proof = await noir.generateProof(witness);
      setProof(proof as any);
      resolve(proof);
    });
    toast.promise(calc, {
      pending: 'Calculating proof...',
      success: 'Proof calculated!',
      error: 'Error calculating proof',
    });
  };

  const handleMerchant = async () => {
    setIsLoading(true);

    calculateProof();

    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_SCROLL_SEPOLIA_RPC);
      const escrow_instance = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, Escrow_abi, provider);

      const createEscrow = await escrow_instance.createEscrow(tokenInfo.buyer, tokenInfo.amount, tokenInfo.token);

      await createEscrow.wait();

      setIsLoading(false);
      setTokenInfo(null);
      toast.success(
        <div className="h-[58px] rounded-[8px] flex justify-center items-center gap-x-[17px]">
          <SuccessToastIcon />
          <div>
            <p className="text-[#101828] text-[14px] leading-[20px] font-inter font-medium">
              {`Minted ${tokenInfo?.name}`}
            </p>
            <p className="text-[#667085] text-[14px] leading-[20px] font-inter">
              Token deposited successfully
            </p>
          </div>
        </div>,

        {
          icon: false,
        }
      );
    } catch (error: any) {
      console.log(error);

      setIsLoading(false);

      toast.error(
        <div className="h-[58px] rounded-[8px] flex justify-center items-center gap-x-[17px]">
          <WarningIcon />
          <div>
            <p className="text-[#101828] text-[14px] leading-[20px] font-inter font-medium">
              Error occurred
            </p>
            <p className="text-[#667085] text-[14px] leading-[20px] font-inter">
              {error.message}
            </p>
          </div>
        </div>,

        {
          icon: false,
        }
      );
    }
  };

  const handleBuyer = async () => {
    const publicInput = [address, tokenInfo.merchant, "0xb894Dfde1ca272C080E60261273BfFBe0C8355e9", tokenInfo?.amount]

    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_NAHMII_URL);
      const escrow_instance = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, Escrow_abi, provider);

      const releaseEscrow = await escrow_instance.releaseEscrow(tokenInfo.txnId, tokenInfo.proof, publicInput);

      await releaseEscrow.wait();

      setIsLoading(false);
      setTokenInfo(null);
      toast.success(
        <div className="h-[58px] rounded-[8px] flex justify-center items-center gap-x-[17px]">
          <SuccessToastIcon />
          <div>
            <p className="text-[#101828] text-[14px] leading-[20px] font-inter font-medium">
              {`Minted ${tokenInfo?.name}`}
            </p>
            <p className="text-[#667085] text-[14px] leading-[20px] font-inter">
              Token released successfully
            </p>
          </div>
        </div>,

        {
          icon: false,
        }
      );
    } catch (error: any) {
      console.log(error);

      setIsLoading(false);

      toast.error(
        <div className="h-[58px] rounded-[8px] flex justify-center items-center gap-x-[17px]">
          <WarningIcon />
          <div>
            <p className="text-[#101828] text-[14px] leading-[20px] font-inter font-medium">
              Error occurred
            </p>
            <p className="text-[#667085] text-[14px] leading-[20px] font-inter">
              {error.message}
            </p>
          </div>
        </div>,

        {
          icon: false,
        }
      );
    }
  }

  return (
    <main className={``}>
      <div className="bg-white border-b border-border flex items-center justify-between gap-x-2 py-5 px-5">
        <Link href="/" passHref>
          <div className="w-36 self-center mr-4">
            <MobileLogo />
          </div>
        </Link>

        <div className="text-[#6938EF] text-lg font-medium flex gap-x-2">
          <div onClick={() => setActive("merchant")}>
            Merchant
          </div>
          <div onClick={() => setActive("buyer")}>
            Buyer
          </div>
        </div>

        <ConnectionButton />
      </div>

      <div className="mt-4 flex justify-center font-inter px-3.5">

        {
          active === "merchant" ? (
            <div className="md:w-[560px] w-[375px] bg-white  border border-[#F4F4F5] rounded-[16px] relative overflow-hidden  lg:p-[40px] p-[20px]">
              <p className="text-[24px] leading-[29px] md:text-[30px] md:leading-[38px] mb-[30px]">
                Merchant
              </p>

              <div className="flex flex-col gap-y-6 ">
                <div className="flex flex-col gap-y-2 relative">
                  <label className="text-[16px] leading-[19px] text-[#4D4D4D]">
                    Token Address
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    required
                    name="token"
                    className="border border-transparent placeholder:text-[#70707B] bg-[#FAFAFA] focus:border-[#9B8AFB] focus:bg-white h-[48px] w-full rounded-[24px] px-3.5"
                    placeholder="0x..."
                  />
                  {/* <KeyboardArrowDown className="absolute top-10 right-2 placeholder:text-[#70707B]" /> */}
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="text-[16px] leading-[19px] text-[#4D4D4D]">
                    Buyer Address
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="buyer"
                    required
                    placeholder="0x"
                    className="border border-transparent placeholder:text-[#70707B] bg-[#FAFAFA] focus:border-[#9B8AFB] focus:bg-white h-[48px] w-full rounded-[24px] px-3.5"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="text-[16px] leading-[19px] text-[#4D4D4D]">
                    Amount
                  </label>
                  <input
                    onChange={handleChange}
                    type="number"
                    required
                    name="amount"
                    className="border border-transparent placeholder:text-[#70707B] bg-[#FAFAFA] focus:border-[#9B8AFB] focus:bg-white h-[48px] w-full rounded-[24px] px-3.5"
                    placeholder="1000"
                  />
                </div>

                <div className="">
                  {proof ? proof : null}
                </div>

                <div>
                  {!address ? (
                    <>
                      <ConnectionButton />
                    </>
                  ) : (
                    <Button
                      onClick={handleMerchant}
                      className="w-full text-white rounded-[32px] bg-[#7A5AF8] h-[60px]"
                    >
                      {isLoading ? <ScaleLoader color="#fff" /> : "Purchase"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="md:w-[560px] w-[375px] bg-white  border border-[#F4F4F5] rounded-[16px] relative overflow-hidden  lg:p-[40px] p-[20px]">
              <p className="text-[24px] leading-[29px] md:text-[30px] md:leading-[38px] mb-[30px]">
                Buyer
              </p>

              <div className="flex flex-col gap-y-6 ">
                <div className="flex flex-col gap-y-2 relative">
                  <label className="text-[16px] leading-[19px] text-[#4D4D4D]">
                    Transaction Id
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    required
                    name="txnId"
                    className="border border-transparent placeholder:text-[#70707B] bg-[#FAFAFA] focus:border-[#9B8AFB] focus:bg-white h-[48px] w-full rounded-[24px] px-3.5"
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col gap-y-2 relative">
                  <label className="text-[16px] leading-[19px] text-[#4D4D4D]">
                    Proof
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    required
                    name="proof"
                    className="border border-transparent placeholder:text-[#70707B] bg-[#FAFAFA] focus:border-[#9B8AFB] focus:bg-white h-[48px] w-full rounded-[24px] px-3.5"
                    placeholder="[]"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="text-[16px] leading-[19px] text-[#4D4D4D]">
                    Merchant Address
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="merchant"
                    required
                    placeholder="0x"
                    className="border border-transparent placeholder:text-[#70707B] bg-[#FAFAFA] focus:border-[#9B8AFB] focus:bg-white h-[48px] w-full rounded-[24px] px-3.5"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="text-[16px] leading-[19px] text-[#4D4D4D]">
                    Amount
                  </label>
                  <input
                    onChange={handleChange}
                    type="number"
                    required
                    name="amount"
                    className="border border-transparent placeholder:text-[#70707B] bg-[#FAFAFA] focus:border-[#9B8AFB] focus:bg-white h-[48px] w-full rounded-[24px] px-3.5"
                    placeholder="1000"
                  />
                </div>

                <div>
                  {!address ? (
                    <>
                      <ConnectionButton />
                    </>
                  ) : (
                    <Button
                      onClick={handleBuyer}
                      className="w-full text-white rounded-[32px] bg-[#7A5AF8] h-[60px]"
                    >
                      {isLoading ? <ScaleLoader color="#fff" /> : "Purchase"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        }
      </div>
    </main>
  );
}
