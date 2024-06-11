export type Placename = {
  id: string;
  name: string;
  traditionalName: string | null;
};

export type SearchableOption = {
  id: string;
  name: string;
  traditionalNames: string[];
  country: string;
  search: string;
};
