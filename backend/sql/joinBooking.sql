-- name: join_booking!
INSERT INTO request (status, booking_id, request_email)
VALUES (2, :booking_id, :email);

-- name: show_requests
SELECT request_email FROM request
WHERE status = 2
AND booking_id = :id;