import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VerifierContractAddress = "0xF87bE6fF851e686F67f30C730C998818C94c64aE";

const EscrowModule = buildModule("EscrowModule", (m) => {
  const _verifierContractAddress = m.getParameter("_verifierContractAddress", VerifierContractAddress);
  
  const escrow = m.contract("Escrow", [_verifierContractAddress]);

  return { escrow };
});

export default EscrowModule;


/*
MyToken1Module#MyToken - 0xF05A3B35b13D7A65E34893Cc9d2b402dacb5cec5
MyToken2Module#MyToken - 0xB08e6BA92C745863Dd253653d2a21Aff922e3fB3
UltraVerifierModule#UltraVerifier - 0xF87bE6fF851e686F67f30C730C998818C94c64aE
EscrowModule#Escrow - 0xd94DF61114A6Bee794A5F34aDEF660D70825A443

https://sepolia.scrollscan.com/address/0xF05A3B35b13D7A65E34893Cc9d2b402dacb5cec5#code
https://sepolia.scrollscan.com/address/0xB08e6BA92C745863Dd253653d2a21Aff922e3fB3#code
https://sepolia.scrollscan.com/address/0xF87bE6fF851e686F67f30C730C998818C94c64aE#code
https://sepolia.scrollscan.com/address/0xd94DF61114A6Bee794A5F34aDEF660D70825A443#code
*/