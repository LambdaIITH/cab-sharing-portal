-- name: get_user_bookings
SELECT c.id, c.date, c.start_time, c.end_time, fl.place, tl.place, c.capacity
FROM cab_booking c
INNER JOIN traveller t
ON c.id = t.id
INNER JOIN locations fl
ON fl.id = c.from_loc
INNER JOIN locations tl
ON tl.id = c.to_loc
WHERE t.user_email = :email;


-- name: get_all_bookings
SELECT c.id, c.start_time, c.end_time, fl.place, tl.place, c.capacity
FROM cab_booking c
INNER JOIN locations fl
ON fl.id = c.from_loc
INNER JOIN locations tl
ON tl.id = c.to_loc
WHERE c.start_time > (SELECT CURRENT_TIMESTAMP);

-- name: filter_locations
SELECT c.id, c.start_time, c.end_time, fl.place, tl.place, c.capacity
FROM cab_booking c
INNER JOIN locations fl
ON fl.id = c.from_loc
INNER JOIN locations tl
ON tl.id = c.to_loc
WHERE c.start_time > (SELECT CURRENT_TIMESTAMP)
AND fl.id= :from_loc AND tl.id = :to_loc;

-- name: filter_times
SELECT c.id, c.start_time, c.end_time, fl.place, tl.place, c.capacity
FROM cab_booking c
INNER JOIN locations fl
ON fl.id = c.from_loc
INNER JOIN locations tl
ON tl.id = c.to_loc
WHERE c.start_time > (SELECT CURRENT_TIMESTAMP)
AND fl.id= :from_loc AND tl.id = :to_loc
AND ((c.start_time <= :start_time AND c.end_time >= :start_time)
OR (c.end_time >= :end_time AND c.start_time <= :end_time)
OR (:start_time <= c.start_time AND :end_time >= c.end_time));

-- name: get_booking_users
SELECT user_email, comments
FROM traveller 
WHERE id = :id;

