function vehiclesMinted(owner: string) {
  return `
    query MyQuery {
      OnlyCars_VehicleRegistered(where: {owner: {_eq: "${owner}"}}) {
        id
        owner
        vehicleId
        metadata
        attestationId
      }
    }
  `;
}

export default vehiclesMinted;
