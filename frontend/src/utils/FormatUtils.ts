import { BigNumberish, formatUnits, parseEther } from 'ethers';

export class FormatUtils {
  /**
   * Сокращает Ethereum адрес до формата 0x1234...5678
   * @param address Полный Ethereum адрес
   * @param chars Количество отображаемых символов с каждой стороны (по умолчанию 4)
   * @returns Сокращенный адрес
   */
  static shortenAddress(address: string | undefined, chars = 4): string {
    if (!address) return '';
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
  }

  /**
   * Форматирует баланс ETH в читаемый вид с использованием ethers.js
   * @param balanceWei Баланс в wei (BigInt, string или ethers.BigNumber)
   * @param decimals Количество знаков после запятой (по умолчанию 4)
   * @returns Отформатированная строка баланса
   */
  static formatEthBalance(balanceWei: BigNumberish | undefined, decimals = 4): string {
    if (!balanceWei) return '0';

    const etherStr = formatUnits(balanceWei, 18);
    const [integerPart, fractionalPart] = etherStr.split('.');

    if (!fractionalPart || decimals === 0) {
      return integerPart;
    }

    const trimmedFraction = fractionalPart.substring(0, decimals);
    return `${integerPart}.${trimmedFraction}`;
  }

  /**
   * Конвертирует строку с ETH в wei (BigNumber)
   * @param ethValue Строка с ETH значением (например "0.1")
   * @returns BigNumber с значением в wei
   */
  static parseEthToWei(ethValue: string): bigint {
    return parseEther(ethValue);
  }

  /**
   * Конвертирует комиссию в формате basis points (0-10000) в процентную строку
   * @param fee Значение комиссии в basis points (например 250 для 2.5%)
   * @param decimals Количество знаков после запятой (по умолчанию 2)
   * @returns Строка с процентом
   */
  static parseFeeToPercent(fee: bigint, decimals = 2): string {
    return (Number(fee) / 100).toFixed(decimals);
  }

  /**
   * Конвертирует процентную строку в BigInt (basis points 0-10000)
   * @param percentStr Строка с процентом (например "2.5")
   * @returns BigInt в basis points (250 для 2.5%)
   */
  static parsePercentToBasisPoints(percentStr: string): bigint {
    const percent = Number(percentStr);
    if (isNaN(percent)) throw new Error('Invalid percentage value');
    return BigInt(Math.floor(percent * 100));
  }

  /**
   * Конвертирует значение в wei в ETH с точностью
   * @param weiValue Значение в wei
   * @param decimals Количество знаков после запятой (по умолчанию 6)
   * @returns Число ETH
   */
  static weiToEthNumber(weiValue: bigint, decimals = 6): number {
    const ethStr = formatUnits(weiValue, 18);
    return parseFloat(parseFloat(ethStr).toFixed(decimals));
  }

  /**
   * Форматирует число в читаемый вид с разделителями тысяч
   * @param num Число для форматирования
   * @param decimals Количество знаков после запятой
   * @returns Отформатированная строка
   */
  static formatNumber(num: number | bigint, decimals = 2): string {
    const number = typeof num === 'bigint' ? Number(num) : num;
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  }

  /**
   * Проверяет является ли строка валидным числовым значением
   * @param value Строка для проверки
   * @returns true если значение валидно
   */
  static isNumeric(value: string): boolean {
    return /^-?\d*\.?\d+$/.test(value);
  }

  /**
   * Конвертирует строку в BigInt, проверяя валидность
   * @param value Строка для конвертации
   * @returns BigInt или null если невалидно
   */
  static safeParseBigInt(value: string): bigint | null {
    try {
      return BigInt(value);
    } catch {
      return null;
    }
  }
}
