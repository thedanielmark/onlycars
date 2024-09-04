import assert from "assert";
import { 
  TestHelpers,
  OnlyCars_Approval
} from "generated";
const { MockDb, OnlyCars } = TestHelpers;

describe("OnlyCars contract Approval event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for OnlyCars contract Approval event
  const event = OnlyCars.Approval.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("OnlyCars_Approval is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await OnlyCars.Approval.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualOnlyCarsApproval = mockDbUpdated.entities.OnlyCars_Approval.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedOnlyCarsApproval: OnlyCars_Approval = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      approved: event.params.approved,
      tokenId: event.params.tokenId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualOnlyCarsApproval, expectedOnlyCarsApproval, "Actual OnlyCarsApproval should be the same as the expectedOnlyCarsApproval");
  });
});
