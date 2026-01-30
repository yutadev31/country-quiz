export interface Country {
  code: string;
  name: string;
  capital: string | null;
  regions: string[];
  tld: string | null;
}
