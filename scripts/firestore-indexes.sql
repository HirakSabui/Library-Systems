-- Firestore Composite Indexes
-- These indexes should be created in Firebase Console > Firestore Database > Indexes

-- Books collection indexes
-- 1. For filtering by category and ordering by addedAt
CREATE INDEX books_category_addedAt ON books (category, addedAt DESC);

-- 2. For filtering by status and ordering by addedAt  
CREATE INDEX books_status_addedAt ON books (status, addedAt DESC);

-- 3. For filtering by both category and status
CREATE INDEX books_category_status_addedAt ON books (category, status, addedAt DESC);

-- Members collection indexes
-- 1. For ordering members by joinedAt
CREATE INDEX members_joinedAt ON members (joinedAt DESC);

-- 2. For filtering active members
CREATE INDEX members_isActive_joinedAt ON members (isActive, joinedAt DESC);

-- Note: Single-field indexes are created automatically by Firestore
-- These composite indexes need to be created manually in the Firebase Console
