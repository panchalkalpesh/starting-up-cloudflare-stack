-- Migration number: 0001 	 2024-11-10T00:53:52.084Z
CREATE TABLE flash_cards (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
	url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
