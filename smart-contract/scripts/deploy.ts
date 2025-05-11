import { ethers } from "hardhat";

async function main() {
  // Получаем аккаунты для деплоя
  const [deployer] = await ethers.getSigners();
  
  console.log(
    "Деплой контракта с аккаунта:",
    await deployer.getAddress()
  );

  // Получаем фабрику контракта
  const NFT = await ethers.getContractFactory("AdvancedNFT");
  
  // Деплоим контракт
  const marketplace = await NFT.deploy(100, 100);
  
  // Ждем подтверждения деплоя
  await marketplace.waitForDeployment();

  console.log("Greeting deployed to:", await marketplace.getAddress());
  
  // Возвращаем адрес для использования во фронтенде
  return await marketplace.getAddress();
}

// Рекомендуемый паттерн для обработки ошибок
main()
  .then((address) => {
    console.log("Деплой успешен. Адрес контракта:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Ошибка деплоя:", error);
    process.exit(1);
  });

