import { createContext, useContext, useState } from "react";

const BagContext = createContext(null);

export const GIFT_WRAP = 6;

export function bagSubtotal(lines, giftWrap, giftWrapAmount = GIFT_WRAP) {
  const goods = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  return goods + (giftWrap ? giftWrapAmount : 0);
}

export function BagProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [giftWrap, setGiftWrap] = useState(false);

  function addItem(item) {
    const key = `${item.slug}|${item.color}|${item.size}`;
    setLines((current) => {
      const existing = current.find((line) => line.key === key);
      if (!existing) return [...current, { ...item, key }];
      return current.map((line) =>
        line.key === key ? { ...line, quantity: line.quantity + item.quantity } : line,
      );
    });
  }

  function setQuantity(key, quantity) {
    const next = Math.max(1, quantity);
    setLines((current) => current.map((line) => (line.key === key ? { ...line, quantity: next } : line)));
  }

  function removeLine(key) {
    setLines((current) => current.filter((line) => line.key !== key));
  }

  function clear() {
    setLines([]);
    setGiftWrap(false);
  }

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <BagContext.Provider value={{ lines, count, giftWrap, setGiftWrap, addItem, setQuantity, removeLine, clear }}>
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const bag = useContext(BagContext);
  if (!bag) throw new Error("useBag must be used inside BagProvider");
  return bag;
}
