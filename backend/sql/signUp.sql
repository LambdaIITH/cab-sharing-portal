-- name: insert_user!
INSERT INTO users (user_email, name, phone_number) VALUES (:email, :name, :phone_number)
  ON CONFLICT (user_email) DO UPDATE SET phone_number = :phone_number;

-- name: get_name!
SELECT name FROM users WHERE user_email = :email;
