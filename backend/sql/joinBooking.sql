-- name: join_booking!
INSERT INTO request (status, booking_id, request_email)
VALUES ("pending", :booking_id, :email);
