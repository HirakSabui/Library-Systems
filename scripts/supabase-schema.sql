-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'checked-out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_joined_at ON members(joined_at DESC);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication setup)
CREATE POLICY "Enable read access for all users" ON books FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON books FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON books FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON members FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON members FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON members FOR DELETE USING (true);

-- Insert sample data
INSERT INTO books (title, author, category, status) VALUES
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', 'available'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'checked-out'),
('1984', 'George Orwell', 'Dystopian', 'available'),
('Pride and Prejudice', 'Jane Austen', 'Romance', 'available'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'available');

INSERT INTO members (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Bob Johnson', 'bob@example.com');
