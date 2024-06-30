import { UF } from './UF';

export type City = {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: UF;
    };
  };
};
