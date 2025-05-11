# 🚀 AdvancedNFT Marketplace: Фронтенд + Смарт-контракты

**Современная платформа для минта NFT** с React, TypeScript и Hardhat. Интеграция с **MetaMask**, поддержка **роялти (ERC2981)** и безопасный минт с защитой от повторного входа.

---

## 🌟 Возможности

- **Минт NFT** с кастомными метаданными и роялти
- **Подключение кошельков** через MetaMask (Wagmi + Ethers.js)
- **Газоэффективный** смарт-контракт на стандарте ERC721
- **Поддержка роялти** (EIP-2981) для вторичных продаж
- **Защита от Reentrancy-атак** (OpenZeppelin `ReentrancyGuard`)
- **Фронтенд** на **Vite** (Сверхбыстрая загрузка ⚡)

---

## 🛠 Технологии

### **Фронтенд**

<div style="display: flex; gap: 10px; flex-wrap: wrap;">  
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />  
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />  
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />  
  <img src="https://img.shields.io/badge/Wagmi-000000?style=for-the-badge&logo=ethereum&logoColor=white" alt="Wagmi" />  
  <img src="https://img.shields.io/badge/Ethers.js-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white" alt="Ethers.js" />  
  <img src="https://img.shields.io/badge/MetaMask-E2761B?style=for-the-badge&logo=metamask&logoColor=white" alt="MetaMask" />  
</div>

### **Смарт-контракты**

<div style="display: flex; gap: 10px; flex-wrap: wrap;">  
  <img src="https://img.shields.io/badge/Hardhat-F7DF1E?style=for-the-badge&logo=hardhat&logoColor=black" alt="Hardhat" />  
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />  
  <img src="https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=for-the-badge&logo=openzeppelin&logoColor=white" alt="OpenZeppelin" />  
  <img src="https://img.shields.io/badge/ERC721-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white" alt="ERC721" />  
  <img src="https://img.shields.io/badge/ERC2981-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white" alt="ERC2981" />  
</div>

---

**Ключевые особенности контракта:**  
✔ **ERC721URIStorage** – NFT с метаданными  
✔ **Ownable** – Функции только для владельца  
✔ **ReentrancyGuard** – Защита от атак  
✔ **IERC2981** – Поддержка стандарта роялти

---

## 🚀 Быстрый старт

### **1️⃣ Установка и запуск фронтенда**

```bash
cd frontend
npm install
npm run dev
```

### **2️⃣ Деплой смарт-контрактов**

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat deploy --network <ваша_сеть>
```
