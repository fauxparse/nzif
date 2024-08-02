import { useQuery } from '@apollo/client';
import { PropsWithChildren, createContext, useCallback, useContext } from 'react';
import { PricingQuery } from './queries';

type PricingContext = {
  totalValue: (count: number) => number;
  packageDiscount: (count: number) => number;
  packagePrice: (count: number) => number;
  countFromPackagePrice: (price: number) => number;
};

const PricingContext = createContext<PricingContext>({
  totalValue: () => 0,
  packageDiscount: () => 0,
  packagePrice: () => 0,
  countFromPackagePrice: () => 0,
});

export const PricingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data } = useQuery(PricingQuery);

  const {
    baseWorkshopPrice = 0,
    discountPerAdditionalWorkshop = 0,
    discountLimit = 0,
  } = data?.festival?.workshopPricing || {};

  const totalValue = useCallback((count: number) => count * baseWorkshopPrice, [baseWorkshopPrice]);

  const packageDiscount = useCallback(
    (count: number) => {
      const discounted = Math.min(count, discountLimit);

      return (
        ((discounted * (discounted - 1)) / 2) * discountPerAdditionalWorkshop +
        (count - discounted) * (discountPerAdditionalWorkshop * (discountLimit - 1))
      );
    },
    [baseWorkshopPrice, discountPerAdditionalWorkshop, discountLimit]
  );

  const packagePrice = useCallback(
    (count: number) => totalValue(count) - packageDiscount(count),
    [totalValue, packageDiscount]
  );

  const countFromPackagePrice = useCallback(
    (price: number) => {
      const maxDiscountedPackagePrice = packagePrice(discountLimit);
      const t = Math.min(price, maxDiscountedPackagePrice);
      const p = baseWorkshopPrice;
      const d = discountPerAdditionalWorkshop;
      const pricePerAdditionalWorkshop = p - d * (discountLimit - 1);
      return (
        (d + 2 * p - Math.sqrt(d * d + 4 * d * p - 8 * d * t + 4 * p * p)) / (2 * d) +
        (price - t) / pricePerAdditionalWorkshop
      );
    },
    [packagePrice, discountLimit, baseWorkshopPrice, discountPerAdditionalWorkshop]
  );

  return (
    <PricingContext.Provider
      value={{ totalValue, packageDiscount, packagePrice, countFromPackagePrice }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => useContext(PricingContext);
