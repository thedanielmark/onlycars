interface DataProviderStatusType {
  IsProviderEnabled: boolean;
  ID: number;
  Title: string;
}

interface DataProvider {
  WebsiteURL: string | null;
  Comments: string | null;
  DataProviderStatusType: DataProviderStatusType;
  IsRestrictedEdit: boolean;
  IsOpenDataLicensed: boolean;
  IsApprovedImport: boolean;
  License: string;
  DateLastImported: string | null;
  ID: number;
  Title: string;
}

interface OperatorInfo {
  WebsiteURL: string | null;
  Comments: string | null;
  PhonePrimaryContact: string | null;
  PhoneSecondaryContact: string | null;
  IsPrivateIndividual: boolean | null;
  AddressInfo: string | null;
  BookingURL: string | null;
  ContactEmail: string | null;
  FaultReportEmail: string | null;
  IsRestrictedEdit: boolean | null;
  ID: number;
  Title: string;
}

interface UsageType {
  IsPayAtLocation: boolean;
  IsMembershipRequired: boolean;
  IsAccessKeyRequired: boolean;
  ID: number;
  Title: string;
}

interface StatusType {
  IsOperational: boolean;
  IsUserSelectable: boolean;
  ID: number;
  Title: string;
}

interface SubmissionStatus {
  IsLive: boolean;
  ID: number;
  Title: string;
}

interface Country {
  ISOCode: string;
  ContinentCode: string;
  ID: number;
  Title: string;
}

interface AddressInfo {
  ID: number;
  Title: string;
  AddressLine1: string;
  AddressLine2: string | null;
  Town: string;
  StateOrProvince: string;
  Postcode: string;
  CountryID: number;
  Country: Country;
  Latitude: number;
  Longitude: number;
  ContactTelephone1: string | null;
  ContactTelephone2: string | null;
  ContactEmail: string | null;
  AccessComments: string | null;
  RelatedURL: string;
  Distance: number | null;
  DistanceUnit: number;
}

interface ConnectionType {
  FormalName: string;
  IsDiscontinued: boolean;
  IsObsolete: boolean;
  ID: number;
  Title: string;
}

interface CurrentType {
  Description: string;
  ID: number;
  Title: string;
}

interface Level {
  Comments: string;
  IsFastChargeCapable: boolean;
  ID: number;
  Title: string;
}

interface StatusTypeConnection {
  IsOperational: boolean;
  IsUserSelectable: boolean;
  ID: number;
  Title: string;
}

interface Connection {
  ID: number;
  ConnectionTypeID: number;
  ConnectionType: ConnectionType;
  Reference: string | null;
  StatusTypeID: number;
  StatusType: StatusTypeConnection;
  LevelID: number;
  Level: Level;
  Amps: number | null;
  Voltage: number | null;
  PowerKW: number;
  CurrentTypeID: number;
  CurrentType: CurrentType;
  Quantity: number;
  Comments: string | null;
}

export interface ICharger {
  DataProvider: DataProvider;
  OperatorInfo: OperatorInfo;
  UsageType: UsageType;
  StatusType: StatusType;
  SubmissionStatus: SubmissionStatus;
  UserComments: string | null;
  PercentageSimilarity: number | null;
  MediaItems: any | null; // Use 'any' if you are not sure of the structure
  IsRecentlyVerified: boolean;
  DateLastVerified: string;
  ID: number;
  UUID: string;
  ParentChargePointID: number | null;
  DataProviderID: number;
  DataProvidersReference: string | null;
  OperatorID: number;
  OperatorsReference: string | null;
  UsageTypeID: number;
  UsageCost: string | null;
  AddressInfo: AddressInfo;
  Connections: Connection[];
  NumberOfPoints: number;
  GeneralComments: string | null;
  DatePlanned: string | null;
  DateLastConfirmed: string | null;
  StatusTypeID: number;
  DateLastStatusUpdate: string;
  MetadataValues: any | null; // Use 'any' if you are not sure of the structure
  DataQualityLevel: number;
  DateCreated: string;
  SubmissionStatusTypeID: number;
  distance: number;
}
