import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NAME = "Escrow Token 2";
const SYMBOL = "ESTK2";

const MyToken2Module = buildModule("MyToken2Module", (m) => {
  const _name = m.getParameter("_name", NAME);
  const _symbol = m.getParameter("_symbol", SYMBOL);

  const myToken2 = m.contract("MyToken", [_name, _symbol]);

  return { myToken2 };
});

export default MyToken2Module;