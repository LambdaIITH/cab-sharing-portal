-- name: join_booking!
INSERT INTO request (status, booking_id, request_email, comments) 
VALUES (2, :booking_id, :email, :comment)
ON CONFLICT DO NOTHING;

-- name: show_requests
SELECT request_email, comments FROM request
WHERE status = 2
AND booking_id = :id;
-- SELECT request_email, comments FROM request
-- WHERE status = 2
-- AND booking_id = :id;

-- name: modify_booking<!
UPDATE request
SET status = :val
WHERE booking_id = :booking_id AND request_email = :request_email
returning comments;

