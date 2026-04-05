import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CategoryBreakdown {
  'categoryName' : string,
  'tripCount' : bigint,
}
export interface CategorySummary {
  'categoryId' : string,
  'categoryName' : string,
  'totalAmount' : bigint,
  'tripCount' : bigint,
}
export interface EntryTypeSummary {
  'entryType' : string,
  'count' : bigint,
  'totalAmount' : bigint,
}
export interface FileReference { 'hash' : string, 'path' : string }
export interface MonthlyBreakdown {
  'totalTrips' : bigint,
  'categorySummaries' : Array<CategorySummary>,
  'entryTypeSummaries' : Array<EntryTypeSummary>,
  'totalExpenses' : bigint,
  'totalExtras' : bigint,
  'netBalance' : bigint,
}
export interface MonthlySummary {
  'month' : bigint,
  'totalToReceive' : bigint,
  'userId' : string,
  'expenses' : bigint,
  'timestamp' : bigint,
  'netBalance' : bigint,
}
export interface OtrosEntry {
  'id' : string,
  'entryType' : string,
  'date' : bigint,
  'description' : string,
  'amount' : bigint,
}
export interface TripCategory {
  'id' : string,
  'name' : string,
  'defaultAmount' : bigint,
}
export interface TripRecord {
  'id' : string,
  'categoryId' : string,
  'date' : bigint,
  'amount' : bigint,
}
export interface UserProfile {
  'salary' : bigint,
  'name' : string,
  'language' : string,
  'currency' : string,
  'companyName' : string,
  'monthlyGoal' : bigint,
}
export interface VisualSummaryWithBreakdown {
  'categories' : Array<CategorySummary>,
  'title' : string,
  'imagePath' : string,
  'totalToReceive' : bigint,
  'categoryBreakdown' : Array<CategoryBreakdown>,
  'expenses' : bigint,
  'message' : string,
  'categoryBreakdownText' : string,
  'netBalance' : bigint,
  'subtitle' : string,
  'entryTypes' : Array<EntryTypeSummary>,
}
export interface _SERVICE {
  'addOtrosEntry' : ActorMethod<
    [string, string, bigint, bigint, string],
    string
  >,
  'addPositivePhrase' : ActorMethod<[string], undefined>,
  'addTripCategory' : ActorMethod<[string, string, bigint], string>,
  'addTripRecord' : ActorMethod<[string, string, bigint, bigint], string>,
  'createUserProfile' : ActorMethod<
    [string, string, string, bigint, string, bigint],
    undefined
  >,
  'deleteOtrosEntry' : ActorMethod<[string], undefined>,
  'deleteTripCategory' : ActorMethod<[string], undefined>,
  'deleteTripRecord' : ActorMethod<[string], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'exportVisualSummary' : ActorMethod<
    [string, bigint],
    VisualSummaryWithBreakdown
  >,
  'generateVisualSummary' : ActorMethod<
    [string, bigint],
    VisualSummaryWithBreakdown
  >,
  'getAllPositivePhrases' : ActorMethod<[], Array<string>>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getMonthlyBreakdown' : ActorMethod<[string, bigint], MonthlyBreakdown>,
  'getMonthlySummary' : ActorMethod<[string, bigint], [] | [MonthlySummary]>,
  'getOtrosEntries' : ActorMethod<[string], Array<OtrosEntry>>,
  'getRandomPositivePhrase' : ActorMethod<[], string>,
  'getTripCategories' : ActorMethod<[string], Array<TripCategory>>,
  'getTripRecords' : ActorMethod<[string], Array<TripRecord>>,
  'getUserProfile' : ActorMethod<[string], [] | [UserProfile]>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'saveMonthlySummary' : ActorMethod<
    [string, bigint, bigint, bigint, bigint],
    undefined
  >,
  'updateOtrosEntry' : ActorMethod<
    [string, string, bigint, bigint, string],
    undefined
  >,
  'updateTripCategory' : ActorMethod<[string, string, bigint], undefined>,
  'updateTripRecord' : ActorMethod<[string, string, bigint, bigint], undefined>,
  'updateUserProfile' : ActorMethod<
    [string, string, string, bigint, string, bigint],
    undefined
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
