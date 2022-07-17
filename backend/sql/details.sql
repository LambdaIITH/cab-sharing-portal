-- name: get_user_bookings
SELECT c.date, c.start_time, c.end_time, fl.place, tl.place, c.capacity, c.comments
FROM cab_booking c
INNER JOIN traveller t
ON c.id = t.id
INNER JOIN locations fl
ON fl.id = c.from_loc
INNER JOIN locations tl
ON tl.id = c.to_loc
WHERE t.user_email = :email;

-- name: get_all_user_bookings
SELECT c.date, c.start_time, c.end_time, fl.place, tl.place, c.capacity, c.comments
FROM cab_booking c
INNER JOIN traveller t
ON c.id = t.id
INNER JOIN locations fl
ON fl.id = c.from_loc
INNER JOIN locations tl
ON tl.id = c.to_loc
WHERE fl.place = :from_loc AND tl.place = :to_loc;
