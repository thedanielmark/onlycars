function stationsByIPFSHashQuery(IPFSHash: any) {
  return `
    query MyQuery {
      OnlyCars_StationRegistered(where: {metadata: {_eq: "${IPFSHash}"}}) {
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

export default stationsByIPFSHashQuery;
