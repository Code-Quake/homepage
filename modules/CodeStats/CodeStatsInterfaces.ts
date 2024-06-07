export interface IData {
  user: string;
  total_xp: number;
  new_xp: number;
  languages: {
    [x: string]: {
      new_xps: number;
      xps: number;
    };
  };
  dates: {
    [x: string]: any;
  };
  machines: {
    [x: string]: {
      xps: number;
    };
  };
}
