const aed = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

export const formatAED = (n: number) => aed.format(n);
