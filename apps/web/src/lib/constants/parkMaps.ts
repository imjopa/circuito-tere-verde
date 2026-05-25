export interface ParkMap {
  embedUrl: string;
  address: string;
  coordinates: string;
  phone: string;
}

export const PARK_MAPS: Record<string, ParkMap | undefined> = {
  "serra-dos-orgaos": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14893.84!2d-43.0!3d-22.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9f2b35ef2a5b5f%3A0x1a2b3c4d5e6f7a8b!2sParque%20Nacional%20Serra%20dos%20%C3%93rg%C3%A3os!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr",
    address: "Av. Rotariana, s/n — Teresópolis, RJ",
    coordinates: "22°27'S, 43°00'W",
    phone: "(21) 97896-2463",
  },
  "tres-picos": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60000!2d-42.95!3d-22.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sParque%20Estadual%20Tr%C3%AAs%20Picos!5e0!3m2!1spt-BR!2sbr!4v1620000000001!5m2!1spt-BR!2sbr",
    address: "Estrada Friburgo-Teresópolis — Nova Friburgo, RJ",
    coordinates: "22°25'S, 42°58'W",
    phone: "(22) 2543-6200",
  },
  "montanhas-teresopolis": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15000!2d-43.02!3d-22.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMontanhas%20de%20Teres%C3%B3polis!5e0!3m2!1spt-BR!2sbr!4v1620000000002!5m2!1spt-BR!2sbr",
    address: "Estrada do Parque s/n — Teresópolis, RJ",
    coordinates: "22°29'S, 43°01'W",
    phone: "(21) 2742-3831",
  },
};
