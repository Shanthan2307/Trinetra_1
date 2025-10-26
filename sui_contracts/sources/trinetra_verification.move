/// Trinetra AI Verification System on Sui
/// Handles verification requests for AI-analyzed CCTV footage
module trinetra::verification {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};

    /// Verification Request Object
    struct VerificationRequest has key, store {
        id: UID,
        camera_uid: String,
        request_type: String, // "face_recognition", "motion_detection", "object_detection"
        walrus_blob_id: String, // Walrus storage ID for the image/video
        ai_result: String, // AI analysis result
        timestamp: u64,
        requester: address,
        verified: bool,
        verification_hash: String,
    }

    /// Camera Registry
    struct CameraRegistry has key {
        id: UID,
        cameras: Table<String, CameraInfo>,
        owner: address,
    }

    /// Camera Information
    struct CameraInfo has store {
        camera_uid: String,
        location: String,
        stream_url: String,
        registered_at: u64,
        total_verifications: u64,
    }

    /// Verification Result Event
    struct VerificationEvent has copy, drop {
        request_id: address,
        camera_uid: String,
        request_type: String,
        verified: bool,
        timestamp: u64,
    }

    /// Camera Registered Event
    struct CameraRegisteredEvent has copy, drop {
        camera_uid: String,
        location: String,
        owner: address,
        timestamp: u64,
    }

    /// Initialize the camera registry
    public entry fun init_registry(ctx: &mut TxContext) {
        let registry = CameraRegistry {
            id: object::new(ctx),
            cameras: table::new(ctx),
            owner: tx_context::sender(ctx),
        };
        transfer::share_object(registry);
    }

    /// Register a new CCTV camera on-chain
    public entry fun register_camera(
        registry: &mut CameraRegistry,
        camera_uid: String,
        location: String,
        stream_url: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let camera_info = CameraInfo {
            camera_uid: camera_uid,
            location: location,
            stream_url: stream_url,
            registered_at: timestamp,
            total_verifications: 0,
        };

        table::add(&mut registry.cameras, camera_uid, camera_info);

        event::emit(CameraRegisteredEvent {
            camera_uid,
            location,
            owner: sender,
            timestamp,
        });
    }

    /// Create a verification request for AI analysis
    public entry fun create_verification_request(
        camera_uid: String,
        request_type: String,
        walrus_blob_id: String,
        ai_result: String,
        verification_hash: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let timestamp = clock::timestamp_ms(clock);

        let request = VerificationRequest {
            id: object::new(ctx),
            camera_uid,
            request_type,
            walrus_blob_id,
            ai_result,
            timestamp,
            requester: sender,
            verified: false,
            verification_hash,
        };

        let request_id = object::uid_to_address(&request.id);

        event::emit(VerificationEvent {
            request_id,
            camera_uid: request.camera_uid,
            request_type: request.request_type,
            verified: false,
            timestamp,
        });

        transfer::share_object(request);
    }

    /// Verify the AI analysis result
    public entry fun verify_request(
        request: &mut VerificationRequest,
        registry: &mut CameraRegistry,
        ctx: &mut TxContext
    ) {
        // Only the requester or registry owner can verify
        let sender = tx_context::sender(ctx);
        assert!(sender == request.requester || sender == registry.owner, 0);
        
        request.verified = true;

        // Update camera verification count
        if (table::contains(&registry.cameras, request.camera_uid)) {
            let camera = table::borrow_mut(&mut registry.cameras, request.camera_uid);
            camera.total_verifications = camera.total_verifications + 1;
        };

        event::emit(VerificationEvent {
            request_id: object::uid_to_address(&request.id),
            camera_uid: request.camera_uid,
            request_type: request.request_type,
            verified: true,
            timestamp: request.timestamp,
        });
    }

    /// Get verification request details (view function)
    public fun get_verification_status(request: &VerificationRequest): bool {
        request.verified
    }

    /// Get camera total verifications
    public fun get_camera_verifications(
        registry: &CameraRegistry,
        camera_uid: String
    ): u64 {
        if (table::contains(&registry.cameras, camera_uid)) {
            let camera = table::borrow(&registry.cameras, camera_uid);
            camera.total_verifications
        } else {
            0
        }
    }
}
