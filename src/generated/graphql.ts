export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<UserNode>;
  users?: Maybe<Array<UserNode>>;
  user?: Maybe<UserNode>;
  profiles?: Maybe<Array<ProfileNode>>;
  profile?: Maybe<ProfileNode>;
  units?: Maybe<Array<UnitNode>>;
  unit?: Maybe<UnitNode>;
  rooms?: Maybe<Array<RoomNode>>;
  room?: Maybe<RoomNode>;
  activityTimes?: Maybe<Array<ActivityTimeNode>>;
  activityTime?: Maybe<ActivityTimeNode>;
  assessments?: Maybe<Array<AssessmentNode>>;
  assessment?: Maybe<AssessmentNode>;
  assessmentQuestions?: Maybe<Array<AssessmentQuestionNode>>;
  assessmentQuestion?: Maybe<AssessmentQuestionNode>;
  assessmentResponses?: Maybe<Array<AssessmentResponseNode>>;
  assessmentResponse?: Maybe<AssessmentResponseNode>;
  tags?: Maybe<Array<TagNode>>;
  tag?: Maybe<TagNode>;
  smallGroups?: Maybe<Array<SmallGroupNode>>;
  smallGroup?: Maybe<SmallGroupNode>;
  groups?: Maybe<Array<GroupNode>>;
  group?: Maybe<GroupNode>;
  permissions?: Maybe<Array<PermissionNode>>;
  permission?: Maybe<PermissionNode>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryProfilesArgs = {
  group?: Maybe<Scalars['ID']>;
};


export type QueryProfileArgs = {
  id: Scalars['ID'];
};


export type QueryUnitArgs = {
  id: Scalars['ID'];
};


export type QueryRoomArgs = {
  id: Scalars['ID'];
};


export type QueryActivityTimeArgs = {
  id: Scalars['ID'];
};


export type QueryAssessmentArgs = {
  id: Scalars['ID'];
};


export type QueryAssessmentQuestionArgs = {
  id: Scalars['ID'];
};


export type QueryAssessmentResponseArgs = {
  id: Scalars['ID'];
};


export type QueryTagArgs = {
  id: Scalars['ID'];
};


export type QuerySmallGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGroupArgs = {
  id: Scalars['ID'];
};


export type QueryPermissionArgs = {
  id: Scalars['ID'];
};

export type UserNode = Node & {
  __typename?: 'UserNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  groups?: Maybe<Array<GroupNode>>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  profile?: Maybe<ProfileNode>;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type GroupNode = Node & {
  __typename?: 'GroupNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  permissions?: Maybe<Array<PermissionNode>>;
  /** The groups this user belongs to. A user will get all permissions granted to each of their groups. */
  userSet: UserNodeConnection;
};


export type GroupNodeUserSetArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type PermissionNode = Node & {
  __typename?: 'PermissionNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  codename: Scalars['String'];
  groupSet: GroupNodeConnection;
  /** Specific permissions for this user. */
  userSet: UserNodeConnection;
};


export type PermissionNodeGroupSetArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type PermissionNodeUserSetArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type GroupNodeConnection = {
  __typename?: 'GroupNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<GroupNodeEdge>>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

/** A Relay edge containing a `GroupNode` and its cursor. */
export type GroupNodeEdge = {
  __typename?: 'GroupNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<GroupNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type UserNodeConnection = {
  __typename?: 'UserNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<UserNodeEdge>>;
};

/** A Relay edge containing a `UserNode` and its cursor. */
export type UserNodeEdge = {
  __typename?: 'UserNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<UserNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type ProfileNode = Node & {
  __typename?: 'ProfileNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  user: UserNode;
  unit?: Maybe<UnitNode>;
  tags?: Maybe<Array<TagNode>>;
  picture?: Maybe<Scalars['String']>;
  profiletagSet: ProfileTagNodeConnection;
  groups: SmallGroupNodeConnection;
  activities?: Maybe<Array<Maybe<ActivityTimeNode>>>;
  assessments?: Maybe<Array<Maybe<AssessmentNode>>>;
};


export type ProfileNodeProfiletagSetArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type ProfileNodeGroupsArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type UnitNode = Node & {
  __typename?: 'UnitNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  title: Scalars['String'];
  address: Scalars['String'];
  postalCode: Scalars['String'];
  city: Scalars['String'];
  floorPlan?: Maybe<Scalars['String']>;
  unitMembers: ProfileNodeConnection;
  groups: SmallGroupNodeConnection;
  rooms?: Maybe<Array<RoomNode>>;
};


export type UnitNodeUnitMembersArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type UnitNodeGroupsArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type ProfileNodeConnection = {
  __typename?: 'ProfileNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProfileNodeEdge>>;
};

/** A Relay edge containing a `ProfileNode` and its cursor. */
export type ProfileNodeEdge = {
  __typename?: 'ProfileNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<ProfileNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type SmallGroupNodeConnection = {
  __typename?: 'SmallGroupNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SmallGroupNodeEdge>>;
};

/** A Relay edge containing a `SmallGroupNode` and its cursor. */
export type SmallGroupNodeEdge = {
  __typename?: 'SmallGroupNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<SmallGroupNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type SmallGroupNode = Node & {
  __typename?: 'SmallGroupNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  unit?: Maybe<UnitNode>;
  profiles?: Maybe<Array<ProfileNode>>;
};

export type RoomNode = Node & {
  __typename?: 'RoomNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  title: Scalars['String'];
  unit?: Maybe<UnitNode>;
  image?: Maybe<Scalars['String']>;
  /** Suitable group size for this room */
  capacity: Scalars['Int'];
  activities?: Maybe<Array<ActivityTimeNode>>;
};

export type ActivityTimeNode = Node & {
  __typename?: 'ActivityTimeNode';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  startTime?: Maybe<Scalars['DateTime']>;
  endTime?: Maybe<Scalars['DateTime']>;
  title: Scalars['String'];
  participants?: Maybe<Array<ProfileNode>>;
  smallGroups?: Maybe<Array<SmallGroupNode>>;
  room?: Maybe<RoomNode>;
  tags: TagNodeConnection;
  assessments: AssessmentNodeConnection;
};


export type ActivityTimeNodeTagsArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type ActivityTimeNodeAssessmentsArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type TagNodeConnection = {
  __typename?: 'TagNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TagNodeEdge>>;
};

/** A Relay edge containing a `TagNode` and its cursor. */
export type TagNodeEdge = {
  __typename?: 'TagNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<TagNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type TagNode = Node & {
  __typename?: 'TagNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  title: Scalars['String'];
  category: Scalars['String'];
  profiletagSet: ProfileTagNodeConnection;
  profileSet: ProfileNodeConnection;
  activitytimeSet: ActivityTimeNodeConnection;
};


export type TagNodeProfiletagSetArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type TagNodeProfileSetArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type TagNodeActivitytimeSetArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type ProfileTagNodeConnection = {
  __typename?: 'ProfileTagNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProfileTagNodeEdge>>;
};

/** A Relay edge containing a `ProfileTagNode` and its cursor. */
export type ProfileTagNodeEdge = {
  __typename?: 'ProfileTagNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<ProfileTagNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type ProfileTagNode = Node & {
  __typename?: 'ProfileTagNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  tag: TagNode;
  profile: ProfileNode;
  createdAt: Scalars['Date'];
  removedAt?: Maybe<Scalars['Date']>;
};


export type ActivityTimeNodeConnection = {
  __typename?: 'ActivityTimeNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ActivityTimeNodeEdge>>;
};

/** A Relay edge containing a `ActivityTimeNode` and its cursor. */
export type ActivityTimeNodeEdge = {
  __typename?: 'ActivityTimeNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<ActivityTimeNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type AssessmentNodeConnection = {
  __typename?: 'AssessmentNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AssessmentNodeEdge>>;
};

/** A Relay edge containing a `AssessmentNode` and its cursor. */
export type AssessmentNodeEdge = {
  __typename?: 'AssessmentNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<AssessmentNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type AssessmentNode = Node & {
  __typename?: 'AssessmentNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  ofChild?: Maybe<ProfileNode>;
  ofActivity?: Maybe<ActivityTimeNode>;
  rating?: Maybe<Scalars['Int']>;
  responses?: Maybe<Array<AssessmentResponseNode>>;
};

export type AssessmentResponseNode = Node & {
  __typename?: 'AssessmentResponseNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  assessment: AssessmentNode;
  question?: Maybe<AssessmentQuestionNode>;
  answer: Scalars['String'];
  of: Scalars['String'];
};

export type AssessmentQuestionNode = Node & {
  __typename?: 'AssessmentQuestionNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  of: Scalars['String'];
  text: Scalars['String'];
  responses: AssessmentResponseNodeConnection;
};


export type AssessmentQuestionNodeResponsesArgs = {
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type AssessmentResponseNodeConnection = {
  __typename?: 'AssessmentResponseNodeConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AssessmentResponseNodeEdge>>;
};

/** A Relay edge containing a `AssessmentResponseNode` and its cursor. */
export type AssessmentResponseNodeEdge = {
  __typename?: 'AssessmentResponseNodeEdge';
  /** The item at the end of the edge */
  node?: Maybe<AssessmentResponseNode>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  upsertUser?: Maybe<UserUpsertPayload>;
  deleteUser?: Maybe<UserDeletePayload>;
  upsertUnit?: Maybe<UnitUpsertPayload>;
  deleteUnit?: Maybe<UnitDeletePayload>;
  upsertRoom?: Maybe<RoomUpsertPayload>;
  deleteRoom?: Maybe<RoomDeletePayload>;
  upsertActivityTime?: Maybe<ActivityTimeUpsertPayload>;
  deleteActivityTime?: Maybe<ActivityTimeDeletePayload>;
  upsertTag?: Maybe<TagUpsertPayload>;
  deleteTag?: Maybe<TagDeletePayload>;
  upsertProfileTag?: Maybe<ProfileTagUpsertPayload>;
  deleteProfileTag?: Maybe<ProfileTagDeletePayload>;
  upsertAssessment?: Maybe<AssessmentUpsertPayload>;
  deleteAssessment?: Maybe<AssessmentDeletePayload>;
  upsertAssessmentQuestion?: Maybe<AssessmentQuestionUpsertPayload>;
  deleteAssessmentQuestion?: Maybe<AssessmentQuestionDeletePayload>;
  upsertAssessmentResponse?: Maybe<AssessmentResponseUpsertPayload>;
  deleteAssessmentResponse?: Maybe<AssessmentResponseDeletePayload>;
  upsertProfile?: Maybe<ProfileUpsertPayload>;
  deleteProfile?: Maybe<ProfileDeletePayload>;
  upsertSmallGroup?: Maybe<SmallGroupUpsertPayload>;
  deleteSmallGroup?: Maybe<SmallGroupDeletePayload>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  verifyToken?: Maybe<Verify>;
  refreshToken?: Maybe<Refresh>;
  logoutMutation?: Maybe<LogOutMutation>;
};


export type MutationUpsertUserArgs = {
  input: UserUpsertInput;
};


export type MutationDeleteUserArgs = {
  input: UserDeleteInput;
};


export type MutationUpsertUnitArgs = {
  input: UnitUpsertInput;
};


export type MutationDeleteUnitArgs = {
  input: UnitDeleteInput;
};


export type MutationUpsertRoomArgs = {
  input: RoomUpsertInput;
};


export type MutationDeleteRoomArgs = {
  input: RoomDeleteInput;
};


export type MutationUpsertActivityTimeArgs = {
  input: ActivityTimeUpsertInput;
};


export type MutationDeleteActivityTimeArgs = {
  input: ActivityTimeDeleteInput;
};


export type MutationUpsertTagArgs = {
  input: TagUpsertInput;
};


export type MutationDeleteTagArgs = {
  input: TagDeleteInput;
};


export type MutationUpsertProfileTagArgs = {
  input: ProfileTagUpsertInput;
};


export type MutationDeleteProfileTagArgs = {
  input: ProfileTagDeleteInput;
};


export type MutationUpsertAssessmentArgs = {
  input: AssessmentUpsertInput;
};


export type MutationDeleteAssessmentArgs = {
  input: AssessmentDeleteInput;
};


export type MutationUpsertAssessmentQuestionArgs = {
  input: AssessmentQuestionUpsertInput;
};


export type MutationDeleteAssessmentQuestionArgs = {
  input: AssessmentQuestionDeleteInput;
};


export type MutationUpsertAssessmentResponseArgs = {
  input: AssessmentResponseUpsertInput;
};


export type MutationDeleteAssessmentResponseArgs = {
  input: AssessmentResponseDeleteInput;
};


export type MutationUpsertProfileArgs = {
  input: ProfileUpsertInput;
};


export type MutationDeleteProfileArgs = {
  input: ProfileDeleteInput;
};


export type MutationUpsertSmallGroupArgs = {
  input: SmallGroupUpsertInput;
};


export type MutationDeleteSmallGroupArgs = {
  input: SmallGroupDeleteInput;
};


export type MutationTokenAuthArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVerifyTokenArgs = {
  token?: Maybe<Scalars['String']>;
};


export type MutationRefreshTokenArgs = {
  token?: Maybe<Scalars['String']>;
};

export type UserUpsertPayload = {
  __typename?: 'UserUpsertPayload';
  user?: Maybe<UserNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UserUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['ID']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UserDeletePayload = {
  __typename?: 'UserDeletePayload';
  user?: Maybe<UserNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UserDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UnitUpsertPayload = {
  __typename?: 'UnitUpsertPayload';
  unit?: Maybe<UnitNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UnitUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  floorPlan?: Maybe<Scalars['Upload']>;
  clientMutationId?: Maybe<Scalars['String']>;
};


export type UnitDeletePayload = {
  __typename?: 'UnitDeletePayload';
  unit?: Maybe<UnitNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UnitDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type RoomUpsertPayload = {
  __typename?: 'RoomUpsertPayload';
  room?: Maybe<RoomNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type RoomUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  unit?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Upload']>;
  capacity?: Maybe<Scalars['Int']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type RoomDeletePayload = {
  __typename?: 'RoomDeletePayload';
  room?: Maybe<RoomNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type RoomDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ActivityTimeUpsertPayload = {
  __typename?: 'ActivityTimeUpsertPayload';
  activityTime?: Maybe<ActivityTimeNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ActivityTimeUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['DateTime']>;
  endTime?: Maybe<Scalars['DateTime']>;
  room?: Maybe<Scalars['ID']>;
  participants?: Maybe<Array<Maybe<Scalars['ID']>>>;
  smallGroups?: Maybe<Array<Maybe<Scalars['ID']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ActivityTimeDeletePayload = {
  __typename?: 'ActivityTimeDeletePayload';
  activityTime?: Maybe<ActivityTimeNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ActivityTimeDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type TagUpsertPayload = {
  __typename?: 'TagUpsertPayload';
  tag?: Maybe<TagNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type TagUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type TagDeletePayload = {
  __typename?: 'TagDeletePayload';
  tag?: Maybe<TagNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type TagDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ProfileTagUpsertPayload = {
  __typename?: 'ProfileTagUpsertPayload';
  profileTag?: Maybe<ProfileTagNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ProfileTagUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  profile?: Maybe<Scalars['ID']>;
  tag?: Maybe<Scalars['ID']>;
  removedAt?: Maybe<Scalars['Date']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ProfileTagDeletePayload = {
  __typename?: 'ProfileTagDeletePayload';
  profileTag?: Maybe<ProfileTagNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ProfileTagDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentUpsertPayload = {
  __typename?: 'AssessmentUpsertPayload';
  assessment?: Maybe<AssessmentNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  ofChild?: Maybe<Scalars['ID']>;
  ofActivity?: Maybe<Scalars['ID']>;
  rating?: Maybe<Scalars['Int']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentDeletePayload = {
  __typename?: 'AssessmentDeletePayload';
  assessment?: Maybe<AssessmentNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentQuestionUpsertPayload = {
  __typename?: 'AssessmentQuestionUpsertPayload';
  assessmentQuestion?: Maybe<AssessmentQuestionNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentQuestionUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  text?: Maybe<Scalars['String']>;
  of?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentQuestionDeletePayload = {
  __typename?: 'AssessmentQuestionDeletePayload';
  assessmentQuestion?: Maybe<AssessmentQuestionNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentQuestionDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentResponseUpsertPayload = {
  __typename?: 'AssessmentResponseUpsertPayload';
  assessmentResponse?: Maybe<AssessmentResponseNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentResponseUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  assessment?: Maybe<Scalars['ID']>;
  question?: Maybe<Scalars['ID']>;
  answer?: Maybe<Scalars['String']>;
  of?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentResponseDeletePayload = {
  __typename?: 'AssessmentResponseDeletePayload';
  assessmentResponse?: Maybe<AssessmentResponseNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type AssessmentResponseDeleteInput = {
  id?: Maybe<Scalars['ID']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ProfileUpsertPayload = {
  __typename?: 'ProfileUpsertPayload';
  profile?: Maybe<ProfileNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ProfileUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  user?: Maybe<Scalars['ID']>;
  picture?: Maybe<Scalars['Upload']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ProfileDeletePayload = {
  __typename?: 'ProfileDeletePayload';
  profile?: Maybe<ProfileNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type ProfileDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SmallGroupUpsertPayload = {
  __typename?: 'SmallGroupUpsertPayload';
  smallGroup?: Maybe<SmallGroupNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SmallGroupUpsertInput = {
  id?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  unit?: Maybe<Scalars['ID']>;
  profiles?: Maybe<Array<Maybe<Scalars['ID']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SmallGroupDeletePayload = {
  __typename?: 'SmallGroupDeletePayload';
  smallGroup?: Maybe<SmallGroupNode>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SmallGroupDeleteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Obtain JSON Web Token mutation */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  token: Scalars['String'];
};


export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar'];
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  token: Scalars['String'];
};

export type LogOutMutation = {
  __typename?: 'LogOutMutation';
  loggedOut?: Maybe<Scalars['Boolean']>;
};


      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Node": [
      "UserNode",
      "GroupNode",
      "PermissionNode",
      "ProfileNode",
      "UnitNode",
      "SmallGroupNode",
      "RoomNode",
      "ActivityTimeNode",
      "TagNode",
      "ProfileTagNode",
      "AssessmentNode",
      "AssessmentResponseNode",
      "AssessmentQuestionNode"
    ]
  }
};
      export default result;
    