import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VisualSummaryWithBreakdown {
    categories: Array<CategorySummary>;
    title: string;
    imagePath: string;
    totalToReceive: bigint;
    categoryBreakdown: Array<CategoryBreakdown>;
    expenses: bigint;
    message: string;
    categoryBreakdownText: string;
    netBalance: bigint;
    subtitle: string;
    entryTypes: Array<EntryTypeSummary>;
}
export interface CategoryBreakdown {
    categoryName: string;
    tripCount: bigint;
}
export interface TripRecord {
    id: string;
    categoryId: string;
    date: bigint;
    amount: bigint;
}
export interface CategorySummary {
    categoryId: string;
    categoryName: string;
    totalAmount: bigint;
    tripCount: bigint;
}
export interface TripCategory {
    id: string;
    name: string;
    defaultAmount: bigint;
}
export interface OtrosEntry {
    id: string;
    entryType: string;
    date: bigint;
    description: string;
    amount: bigint;
}
export interface MonthlySummary {
    month: bigint;
    totalToReceive: bigint;
    userId: string;
    expenses: bigint;
    timestamp: bigint;
    netBalance: bigint;
}
export interface FileReference {
    hash: string;
    path: string;
}
export interface MonthlyBreakdown {
    totalTrips: bigint;
    categorySummaries: Array<CategorySummary>;
    entryTypeSummaries: Array<EntryTypeSummary>;
    totalExpenses: bigint;
    totalExtras: bigint;
    netBalance: bigint;
}
export interface UserProfile {
    salary: bigint;
    name: string;
    language: string;
    currency: string;
    companyName: string;
    monthlyGoal: bigint;
}
export interface EntryTypeSummary {
    entryType: string;
    count: bigint;
    totalAmount: bigint;
}
export interface backendInterface {
    addOtrosEntry(userId: string, description: string, amount: bigint, date: bigint, entryType: string): Promise<string>;
    addPositivePhrase(phrase: string): Promise<void>;
    addTripCategory(userId: string, name: string, defaultAmount: bigint): Promise<string>;
    addTripRecord(userId: string, categoryId: string, amount: bigint, date: bigint): Promise<string>;
    createUserProfile(userId: string, name: string, companyName: string, salary: bigint, language: string, monthlyGoal: bigint): Promise<void>;
    deleteOtrosEntry(entryId: string): Promise<void>;
    deleteTripCategory(categoryId: string): Promise<void>;
    deleteTripRecord(recordId: string): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    exportVisualSummary(userId: string, month: bigint): Promise<VisualSummaryWithBreakdown>;
    generateVisualSummary(userId: string, month: bigint): Promise<VisualSummaryWithBreakdown>;
    getAllPositivePhrases(): Promise<Array<string>>;
    getFileReference(path: string): Promise<FileReference>;
    getMonthlyBreakdown(userId: string, month: bigint): Promise<MonthlyBreakdown>;
    getMonthlySummary(userId: string, month: bigint): Promise<MonthlySummary | null>;
    getOtrosEntries(userId: string): Promise<Array<OtrosEntry>>;
    getRandomPositivePhrase(): Promise<string>;
    getTripCategories(userId: string): Promise<Array<TripCategory>>;
    getTripRecords(userId: string): Promise<Array<TripRecord>>;
    getUserProfile(userId: string): Promise<UserProfile | null>;
    listFileReferences(): Promise<Array<FileReference>>;
    registerFileReference(path: string, hash: string): Promise<void>;
    saveMonthlySummary(userId: string, month: bigint, totalToReceive: bigint, expenses: bigint, netBalance: bigint): Promise<void>;
    updateOtrosEntry(entryId: string, description: string, amount: bigint, date: bigint, entryType: string): Promise<void>;
    updateTripCategory(categoryId: string, name: string, defaultAmount: bigint): Promise<void>;
    updateTripRecord(recordId: string, categoryId: string, amount: bigint, date: bigint): Promise<void>;
    updateUserProfile(userId: string, name: string, companyName: string, salary: bigint, language: string, monthlyGoal: bigint): Promise<void>;
}
