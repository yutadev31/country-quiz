import states from "@/data/states/states.json";

export interface USState {
  id: string;
  name: string;
  capital: string;
  flag: string;
}

export default function getUSStates() {
  return states.map((state) => {
    return {
      id: state.code,
      name: state.name,
      capital: state.capital,
      flag: `https://flagcdn.com/${state.code}.svg`,
    };
  });
}
