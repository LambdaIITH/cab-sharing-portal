-- name: join_booking!
INSERT INTO request (status, booking_id, request_email, comments) 
VALUES (2, :booking_id, :email, :comment)
ON CONFLICT DO NOTHING;

-- name: show_requests
SELECT r.request_email, r.comments, u.user_email, u.phone_number
FROM request r
INNER JOIN users u ON u.user_email = r.request_email
WHERE r.status = 2 AND r.booking_id = :id;

-- name: modify_booking<!
UPDATE request
SET status = :val
WHERE booking_id = :booking_id AND request_email = :request_email
returning comments;

