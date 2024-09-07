function stationsOwned(address: any) {
  return `
    query MyQuery {
      OnlyCars_StationRegistered(where: {owner: {_eq: "${address}"}}) {
        attestationId
        id
        isActive
        metadata
        owner
        stationId
      }
    }
`;
}

export default stationsOwned;
