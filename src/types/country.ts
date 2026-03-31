export interface Country {
  code: string;
  name: string;
  capital: string | null;
  continent: string[];
  tld: string | null;
}

export interface CountryForGame {
  name: string;
  capital: string | null;
  tld: string | null;
  flag: string;
}
