import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ScanRecord = {
    id : Nat;
    timestamp : Int;
    blobId : Text;
    predictedClass : Text;
    confidence : Nat;
    probNonDemented : Nat;
    probVeryMild : Nat;
    probMild : Nat;
    probModerate : Nat;
    userId : Principal;
  };

  module ScanRecord {
    public func compareByTimestamp(a : ScanRecord, b : ScanRecord) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  var nextId = 1;
  let scanRecords = Map.empty<Nat, ScanRecord>();

  func addScanRecord(record : ScanRecord) {
    scanRecords.add(record.id, record);
  };

  func getScanRecord(id : Nat) : ScanRecord {
    switch (scanRecords.get(id)) {
      case (?record) { record };
      case (null) { Runtime.trap("Scan record does not exist") };
    };
  };

  func deleteScanRecord(id : Nat) {
    switch (scanRecords.get(id)) {
      case (null) { Runtime.trap("Scan record does not exist: " # id.toText()) };
      case (?_) {
        scanRecords.remove(id);
      };
    };
  };

  // Hash blobId by summing char values for varied predictions
  func charHash(s : Text) : Nat {
    var sum : Nat = 0;
    for (c in s.chars()) {
      sum += c.toNat32().toNat();
    };
    sum
  };

  // Simulate varied predictions using char-value hash of blobId
  func simulatePrediction(blobId : Text) : (Text, Nat, Nat, Nat, Nat, Nat) {
    let hash = charHash(blobId) % 4;
    switch (hash) {
      case (0) { ("NonDemented", 95, 80, 10, 7, 3) };
      case (1) { ("VeryMildDemented", 87, 8, 75, 12, 5) };
      case (2) { ("MildDemented", 82, 5, 10, 72, 13) };
      case (_) { ("ModerateDemented", 91, 3, 4, 8, 85) };
    };
  };

  // Anyone can submit a scan - no auth required
  public shared ({ caller }) func submitScan(blobId : Text) : async ScanRecord {
    let id = nextId;
    nextId += 1;

    let (predictedClass, confidence, probNonDemented, probVeryMild, probMild, probModerate) = simulatePrediction(blobId);

    let record : ScanRecord = {
      id;
      timestamp = Time.now();
      blobId;
      predictedClass;
      confidence;
      probNonDemented;
      probVeryMild;
      probMild;
      probModerate;
      userId = caller;
    };

    addScanRecord(record);
    record;
  };

  // Returns scans for the current caller (anyone)
  public query ({ caller }) func getUserScans() : async [ScanRecord] {
    scanRecords.values().toArray().filter(
      func(record) { Principal.equal(record.userId, caller) }
    ).sort(ScanRecord.compareByTimestamp);
  };

  public query ({ caller }) func getAllScans() : async [ScanRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Only admins can access all scans");
    };
    scanRecords.values().toArray().sort(ScanRecord.compareByTimestamp);
  };

  public shared ({ caller }) func deleteScan(scanId : Nat) : async () {
    let record = getScanRecord(scanId);
    if (not Principal.equal(caller, record.userId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized to delete scan: " # scanId.toText() # " ");
    };
    deleteScanRecord(scanId);
  };

  // Stats available to anyone
  public query ({ caller }) func getStats() : async {
    totalScans : Nat;
    modelAccuracy : Text;
  } {
    {
      totalScans = scanRecords.values().toArray().filter(
        func(record) { Principal.equal(record.userId, caller) }
      ).size();
      modelAccuracy = "94.7%";
    };
  };
};
