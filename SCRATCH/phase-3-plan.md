# Phase 3 Work Plan — Core Editor Shell

## Goal
Build the editor interface with upload, image display, local tools (crop/straighten), and download.

## Work order (logical dependencies)

### 1. Sharp server route for image processing
- [ ] POST /api/image/process
- [ ] Strip EXIF, normalize PNG, generate thumbnail
- [ ] Return processed image buffer + metadata

### 2. Supabase Storage setup
- [ ] Create storage bucket (rls-protected)
- [ ] Enable RLS policies for user isolation
- [ ] Test upload/download via API

### 3. Upload component
- [ ] Drag-drop zone
- [ ] File picker fallback
- [ ] Validation: image type, size limits
- [ ] Send to Sharp server route
- [ ] Store in Supabase Storage
- [ ] Show upload progress

### 4. Editor route skeleton (/app/editor)
- [ ] Canvas for image display
- [ ] Left toolbar (tool selector)
- [ ] Right action panel (tool options)
- [ ] Upload area (drag-drop + file picker)
- [ ] Image display after upload

### 5. Smart Crop / Straighten tool (local-only)
- [ ] Canvas-based UI
- [ ] Crop bounds selector
- [ ] Rotation slider
- [ ] Preview
- [ ] Apply button

### 6. Download button
- [ ] Triggers canvas export
- [ ] Converts to PNG/JPEG
- [ ] Downloads to user's computer
- [ ] Add AI-edited EXIF tag

### 7. Integration
- [ ] Editor state management (current image, tool state, history)
- [ ] Tool application pipeline
- [ ] Error handling for uploads/processing

### 8. Testing & verification
- [ ] Upload photo → displays on canvas ✓
- [ ] Crop tool works (select region, apply, download) ✓
- [ ] Download button exports with correct format ✓
- [ ] Supabase Storage RLS working ✓

### 9. Commit & push
- [ ] All changes committed
- [ ] CI green
- [ ] Checkpoint: Phase 3 complete
