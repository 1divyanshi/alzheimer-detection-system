import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScanRecord {
    id: bigint;
    predictedClass: string;
    probNonDemented: bigint;
    userId: Principal;
    probVeryMild: bigint;
    probMild: bigint;
    timestamp: bigint;
    blobId: string;
    confidence: bigint;
    probModerate: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteScan(scanId: bigint): Promise<void>;
    getAllScans(): Promise<Array<ScanRecord>>;
    getCallerUserRole(): Promise<UserRole>;
    getStats(): Promise<{
        modelAccuracy: string;
        totalScans: bigint;
    }>;
    getUserScans(): Promise<Array<ScanRecord>>;
    isCallerAdmin(): Promise<boolean>;
    submitScan(blobId: string): Promise<ScanRecord>;
}
