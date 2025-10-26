# 🔗 Trinetra Sui Smart Contracts

## 📦 Overview

This folder contains the Sui Move smart contracts for Trinetra's blockchain verification system.

---

## 📁 Structure

```
sui_contracts/
├── Move.toml                          # Package configuration
├── sources/
│   └── trinetra_verification.move    # Main verification contract
└── README.md                          # This file
```

---

## 📜 Smart Contract: `trinetra_verification.move`

### Module: `trinetra::verification`

Handles on-chain verification of AI-analyzed CCTV footage.

### Key Objects

#### `VerificationRequest`
```move
struct VerificationRequest has key, store {
    id: UID,
    camera_uid: String,
    request_type: String,
    walrus_blob_id: String,
    ai_result: String,
    timestamp: u64,
    requester: address,
    verified: bool,
    verification_hash: String,
}
```

#### `CameraRegistry`
```move
struct CameraRegistry has key {
    id: UID,
    cameras: Table<String, CameraInfo>,
    owner: address,
}
```

#### `CameraInfo`
```move
struct CameraInfo has store {
    camera_uid: String,
    location: String,
    stream_url: String,
    registered_at: u64,
    total_verifications: u64,
}
```

---

## 🔧 Functions

### `init_registry()`
Initialize the camera registry on Sui blockchain.

**Usage:**
```bash
sui client call --package $PACKAGE_ID \
  --module verification \
  --function init_registry
```

### `register_camera()`
Register a new CCTV camera on-chain.

**Parameters:**
- `registry: &mut CameraRegistry`
- `camera_uid: String`
- `location: String`
- `stream_url: String`
- `clock: &Clock`

**Emits:** `CameraRegisteredEvent`

### `create_verification_request()`
Create a verification request for AI analysis.

**Parameters:**
- `camera_uid: String`
- `request_type: String`
- `walrus_blob_id: String`
- `ai_result: String`
- `verification_hash: String`
- `clock: &Clock`

**Emits:** `VerificationEvent`

### `verify_request()`
Confirm a verification on-chain.

**Parameters:**
- `request: &mut VerificationRequest`
- `registry: &mut CameraRegistry`

**Emits:** `VerificationEvent`

---

## 🎯 Events

### `VerificationEvent`
Emitted when verification is created or confirmed.
```move
struct VerificationEvent has copy, drop {
    request_id: address,
    camera_uid: String,
    request_type: String,
    verified: bool,
    timestamp: u64,
}
```

### `CameraRegisteredEvent`
Emitted when camera is registered.
```move
struct CameraRegisteredEvent has copy, drop {
    camera_uid: String,
    location: String,
    owner: address,
    timestamp: u64,
}
```

---

## 🚀 Deployment (Future)

### Prerequisites
```bash
# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Check installation
sui --version
```

### Build Contract
```bash
cd sui_contracts
sui move build
```

### Deploy to Testnet
```bash
sui client publish --gas-budget 100000000
```

### Initialize Registry
```bash
sui client call \
  --package $PACKAGE_ID \
  --module verification \
  --function init_registry \
  --gas-budget 10000000
```

---

## 🧪 Testing

### Unit Tests (Future)
```bash
sui move test
```

### Integration Tests
Use the Trinetra backend API which provides mock implementation:
```bash
curl -X POST http://localhost:5000/api/sui/register_camera \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "TEST-CAM",
    "location": "37.7749,-122.4194",
    "stream_url": "https://test.com/stream.m3u8"
  }'
```

---

## 📊 Current Status

### ✅ Implemented
- Smart contract structure
- Camera registration
- Verification request creation
- On-chain verification confirmation
- Event emission
- View functions

### 🔄 In Progress (Mock Mode)
- Backend Python implementation simulates contract calls
- All functions available via API
- Transaction hashes generated
- Full feature parity with real blockchain

### 📋 Planned
- Deploy to Sui testnet
- Real blockchain integration
- Gas optimization
- Additional verification types
- Multi-sig support

---

## 🔐 Security Considerations

### Access Control
- Only registry owner or requester can verify
- Camera registration controlled by owner
- Shared objects for multi-user access

### Data Integrity
- Verification hashes prevent tampering
- Immutable on-chain records
- Event logs for audit trail

### Gas Efficiency
- Minimal storage usage
- Efficient table lookups
- Optimized object structure

---

## 📖 Resources

### Sui Documentation
- [Sui Move Book](https://move-book.com/)
- [Sui Developer Docs](https://docs.sui.io/)
- [Move Language Reference](https://github.com/move-language/move)

### Trinetra Integration
- Backend: `backend/sui_integration.py`
- Frontend: `frontend/src/BlockchainPanel.js`
- API Docs: `SUI_BLOCKCHAIN_INTEGRATION.md`

---

## 🎯 Use Cases

1. **Security Verification**
   - Record suspicious activity analysis
   - Create immutable evidence trail

2. **Compliance Auditing**
   - Track all AI decisions
   - Provide transparent verification

3. **Access Control**
   - Verify face recognition results
   - Maintain identity access logs

4. **Incident Response**
   - Document AI analysis of incidents
   - Cryptographic proof of findings

---

## 🔄 Workflow

```
┌─────────────────────────────────────────────────┐
│  1. Initialize Registry (once)                  │
│     → CameraRegistry object created             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  2. Register Camera                             │
│     → CameraInfo stored in registry             │
│     → CameraRegisteredEvent emitted             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  3. AI Analyzes Camera Feed                     │
│     → Gemini processes image                    │
│     → Returns analysis result                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  4. Create Verification Request                 │
│     → VerificationRequest object created        │
│     → Result + hash stored on-chain             │
│     → VerificationEvent emitted                 │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  5. Verify Request (optional)                   │
│     → Update verification status                │
│     → Increment camera counter                  │
│     → VerificationEvent emitted                 │
└─────────────────────────────────────────────────┘
```

---

## 💡 Example Scenarios

### Scenario 1: Register Camera
```
User Action: Add new camera via UI
↓
Backend: POST /api/sui/register_camera
↓
Smart Contract: register_camera()
↓
Result: Camera on-chain, event emitted
```

### Scenario 2: AI Query
```
User Action: "Who is in this feed?"
↓
AI: Analyzes feed, returns "Person detected"
↓
Backend: POST /api/sui/create_verification
↓
Smart Contract: create_verification_request()
↓
Result: Verification on-chain, TX hash returned
```

### Scenario 3: Confirm Verification
```
User Action: Click [VERIFY NOW] in dashboard
↓
Backend: POST /api/sui/verify_request
↓
Smart Contract: verify_request()
↓
Result: Status updated, counter incremented
```

---

## 🎉 Summary

This smart contract provides:
- ✅ On-chain camera registry
- ✅ Immutable verification records
- ✅ Cryptographic integrity (hashes)
- ✅ Event-based transparency
- ✅ Efficient storage (tables)
- ✅ Access control
- ✅ Integration ready

**Ready for Sui testnet deployment!** 🚀
