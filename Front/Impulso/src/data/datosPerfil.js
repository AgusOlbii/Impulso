const perfilDemo = {
  nacimiento: "14/06/1999",
  altura: "1,76 m",
  peso: "72 kg",
};

export function datosFisicosDe(user) {
  return {
    nacimiento: user?.nacimiento || perfilDemo.nacimiento,
    altura: user?.altura || perfilDemo.altura,
    peso: user?.peso || perfilDemo.peso,
  };
}
