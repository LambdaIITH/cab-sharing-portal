-- name: create_request!
INSERT INTO request (status, booking_id, request_email, comments) 
  VALUES ('pending', :booking_id, :email, :comments)
  ON CONFLICT DO NOTHING;

-- name: show_requests
SELECT r.request_email, r.comments, u.name, u.phone_number
  FROM request r
    INNER JOIN users u ON u.user_email = r.request_email
  WHERE r.status = 'pending' AND r.booking_id = :cab_id;

-- name: update_request<!
UPDATE request
  SET status = :val
  WHERE booking_id = :booking_id AND request_email = :request_email AND status = 'pending'
  RETURNING comments;
