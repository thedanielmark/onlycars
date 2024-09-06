function vehicleConnectionsQuery(address: string) {
  return `
{
    vehicles(
        first: 100
        filterBy: { privileged: "${address}" }
    ) {
        nodes {
            id
            tokenId
            owner
            mintedAt
            name
            image
        }
        pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
        }
    }
}
`;
}

export default vehicleConnectionsQuery;
