export type ICharacter = {
  info: IInfo;
  results: IResults[];
}

export type IInfo = {
  count: number;
  next: string;
  pages: number;
  prev: string;
}

export type IResults = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: IOrigin;
  location: IOrigin;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

type IOrigin = {
  name: string;
  url: string;
}