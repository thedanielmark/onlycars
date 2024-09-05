function vehicleConnectionsQuery(ownerAddress: any) {
  return `
{
    vehicles(
        first: 100
        filterBy: { owner: "0x87e083178D8E8f7001b1c42ACDEA6B96b64dE888" }
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
