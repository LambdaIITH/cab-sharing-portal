-- name: delete_booking!
DELETE FROM cab_booking WHERE id=:id;

--name:delete_booking_associated_traveller!
DELETE FROM traveller WHERE id=:id;

--name: delete_particular_traveller!
DELETE FROM traveller WHERE (id=:id and user_email=:email)