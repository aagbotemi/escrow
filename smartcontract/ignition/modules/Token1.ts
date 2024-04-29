import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NAME = "Escrow Token 1";
const SYMBOL = "ESTK1";

const MyToken1Module = buildModule("MyToken1Module", (m) => {
  const _name = m.getParameter("_name", NAME);
  const _symbol = m.getParameter("_symbol", SYMBOL);

  const myToken1 = m.contract("MyToken", [_name, _symbol]);

  return { myToken1 };
});

export default MyToken1Module;


