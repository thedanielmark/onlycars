function testEnvio() {
  return `
{
  OnlyCars_VehicleRegistered(where: {owner: {_eq: "0xb860d1f279575747c7A7b18f8a2b396EdF648023"}}) {
    id
    owner
    vehicleId
  }
}
  `;
}

export default testEnvio;
