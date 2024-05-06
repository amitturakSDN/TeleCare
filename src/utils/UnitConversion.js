// Blood GLucose
export const mgdLTommol = value => {
  return (value / 18).toFixed(1).toString();
};

// Blood Pressure
export const mmHgTokPA = value => {
  return value / (7.501).toFixed(1).toString();
};
export const mmHgTopsi = value => {
  return value / (51.715).toFixed(1).toString();
};

// Temperature
export const cToF = value => {
  return ((value * 9) / 5 + 32).toFixed(1).toString();
};

//Weight
export const kgTolbs = value => {
  return (value * 2.205).toFixed(1).toString();
};
