-- Firestore Security Rules
-- Copy these rules to your Firebase Console > Firestore Database > Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Books collection - only authenticated users can read/write
    match /books/{bookId} {
      allow read, write: if request.auth != null;
    }
    
    // Members collection - only authenticated users can read/write
    match /members/{memberId} {
      allow read, write: if request.auth != null;
    }
    
    // Admin users collection (if needed)
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
  }
}
