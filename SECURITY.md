# Security Considerations

### 1. Signed URL Generation

Signed URLs would be generated in the `/evidence` endpoint, right before returning the response. The `secure_reference` would be an encrypted reference to the file in the object storage.

### 2. Evidence Scoping

Evidence is already scoped to the authenticated user. This is done by filtering the evidence by `user_id` in the `/evidence` and `/reports` endpoints.

### 3. Production Storage

In a production environment, the evidence would be stored in an object storage like AWS S3, Google Cloud Storage, or Azure Blob Storage. The database would only store the metadata of the evidence, including the `secure_reference`.

### 4. Large Media Upload/Download

Large media uploads would be handled using multipart uploads to the object storage. Downloads would be handled by providing a signed URL to the client, which would then download the file directly from the object storage.

### 5. Signed URL Hijacking

To limit the hijacking of a signed URL, we would use short-lived tokens and one-time-use tokens, as already implemented for the `/share/:token` endpoint. Additionally, we could restrict the IP address that can use the signed URL.
