export function formatCountLabel(count: number, singular: string, plural: string) {
  const noun = count === 1 ? singular : plural;
  return `${count} ${noun}`;
}

export function formatEventDateParts(date: string) {
  const evDate = new Date(date + "T00:00:00");
  return {
    day: evDate.getDate().toString().padStart(2, "0"),
    month: evDate.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase(),
    weekday: evDate.toLocaleDateString("pt-BR", { weekday: "long" }),
  };
}

export function formatEventPrice(priceCents: number) {
  return (priceCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
