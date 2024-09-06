function vehiclesOwnedQuery(tokenId: number) {
  return `
{
    vehicle(tokenId: ${tokenId}) {
        id
        name
    		definition {
    		  id
          make
        	model
          year
    		}
    }
}
`;
}

export default vehiclesOwnedQuery;
