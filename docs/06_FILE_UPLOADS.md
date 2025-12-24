# File Uploads Documentation

## Upload Endpoint

### Single File Upload
```http
POST /api/v1/media/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

### Multiple File Upload
```http
POST /api/v1/media/upload/multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

---

## Allowed File Types

| MIME Type | Extension | Category |
|-----------|-----------|----------|
| `image/jpeg` | .jpg, .jpeg | Image |
| `image/png` | .png | Image |
| `image/gif` | .gif | Image |
| `image/webp` | .webp | Image |
| `image/svg+xml` | .svg | Image |
| `application/pdf` | .pdf | Document |
| `text/plain` | .txt | Document |
| `text/csv` | .csv | Document |

---

## File Size Limits

| Limit | Value |
|-------|-------|
| Maximum file size | **10 MB** |
| Maximum files per request | 10 (for multiple upload) |

---

## Request Format

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | The file to upload |
| `entity_type` | string | No | Associate with entity (product, category) |
| `entity_id` | string (UUID) | No | The entity's ID |
| `alt_text` | string | No | Alt text for images |
| `title` | string | No | Title/caption |
| `sort_order` | integer | No | Display order (default: 0) |

### Multiple Upload Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | File[] | Yes | Array of files |
| `entity_type` | string | No | Common entity type |
| `entity_id` | string (UUID) | No | Common entity ID |

---

## Response Format

### Single Upload Success
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "1705315800_image.jpg",
    "original_name": "my-image.jpg",
    "mime_type": "image/jpeg",
    "size": 245678,
    "url": "/uploads/1705315800_image.jpg",
    "alt_text": "",
    "title": "",
    "entity_type": "product",
    "entity_id": "550e8400-e29b-41d4-a716-446655440001",
    "sort_order": 0,
    "width": 1920,
    "height": 1080,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "timestamp": 1705315800
}
```

### Multiple Upload Success
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": [
    {
      "id": "uuid-1",
      "filename": "1705315800_image1.jpg",
      "original_name": "image1.jpg",
      ...
    },
    {
      "id": "uuid-2",
      "filename": "1705315801_image2.jpg",
      "original_name": "image2.jpg",
      ...
    }
  ],
  "timestamp": 1705315800
}
```

---

## Error Responses

### Invalid File Type
```json
{
  "success": false,
  "message": "Invalid file type",
  "error": "File type 'application/zip' is not allowed",
  "timestamp": 1705315800
}
```

### File Too Large
```json
{
  "success": false,
  "message": "File too large",
  "error": "File size exceeds maximum limit of 10MB",
  "timestamp": 1705315800
}
```

### No File Provided
```json
{
  "success": false,
  "message": "No file provided",
  "error": "File is required",
  "timestamp": 1705315800
}
```

---

## Accessing Uploaded Files

Files are served from the `/uploads` path:

```
GET /uploads/1705315800_image.jpg
```

This is a public endpoint (no authentication required).

The full URL in responses includes just the path. Frontend should construct full URL:
```javascript
const fullUrl = `${API_BASE_URL}${media.url}`;
// e.g., "http://localhost:8080/uploads/1705315800_image.jpg"
```

---

## Frontend Implementation

### JavaScript/React Example

```javascript
// Single file upload
async function uploadFile(file, entityType, entityId) {
  const formData = new FormData();
  formData.append('file', file);
  
  if (entityType) formData.append('entity_type', entityType);
  if (entityId) formData.append('entity_id', entityId);
  
  const response = await fetch('/api/v1/media/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type - browser sets it with boundary
    },
    body: formData,
  });
  
  return response.json();
}

// Multiple files upload
async function uploadMultipleFiles(files, entityType, entityId) {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('files', file);
  });
  
  if (entityType) formData.append('entity_type', entityType);
  if (entityId) formData.append('entity_id', entityId);
  
  const response = await fetch('/api/v1/media/upload/multiple', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return response.json();
}
```

### File Validation Before Upload

```javascript
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}`);
  }
  
  if (file.size > MAX_SIZE) {
    throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }
  
  return true;
}
```

### Drag and Drop Example

```jsx
function FileDropZone({ onUpload }) {
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    for (const file of files) {
      try {
        validateFile(file);
        const result = await uploadFile(file);
        onUpload(result.data);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }
  };
  
  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="drop-zone"
    >
      Drop files here
    </div>
  );
}
```

---

## Image Dimensions

For image uploads, the backend automatically extracts dimensions:

```json
{
  "width": 1920,
  "height": 1080
}
```

This can be used for:
- Responsive image sizing
- Aspect ratio calculations
- Layout previews

For non-image files, `width` and `height` will be `null`.
