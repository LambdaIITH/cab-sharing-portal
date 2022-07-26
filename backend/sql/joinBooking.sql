-- name: join_booking!
INSERT INTO request (status, booking_id, request_email)
VALUES (2, :booking_id, :email);
