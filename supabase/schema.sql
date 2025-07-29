CREATE TABLE clicks (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  country VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  wallet_address VARCHAR(255) PRIMARY KEY,
  total_clicks BIGINT DEFAULT 0,
  country VARCHAR(255)
);

CREATE INDEX idx_users_total_clicks ON users (total_clicks DESC);

CREATE OR REPLACE FUNCTION get_user_rank(user_wallet TEXT) 
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT rank
    FROM (
      SELECT wallet_address, RANK() OVER (ORDER BY total_clicks DESC) as rank
      FROM users
    ) as user_ranks
    WHERE wallet_address = user_wallet
  );
END;
$$ LANGUAGE plpgsql;