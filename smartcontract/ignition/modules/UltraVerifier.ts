import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UltraVerifierModule = buildModule("UltraVerifierModule", (m) => {
  const ultraVerifier = m.contract("UltraVerifier");

  return { ultraVerifier };
});

export default UltraVerifierModule;
