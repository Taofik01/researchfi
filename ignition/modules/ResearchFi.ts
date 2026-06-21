import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ResearchFiModule = buildModule("ResearchFiModule", (m) => {
  const researchFi = m.contract("ResearchFi");
  return { researchFi };
});

export default ResearchFiModule;