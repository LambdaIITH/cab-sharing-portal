-- name:cab_booking<!
insert into cab_booking (start_time, end_time, capacity, from_loc, to_loc)
values (:start_time, :end_time, :capacity, :from_loc, :to_loc)
returning id;

-- name:add_traveller!
insert into traveller (id, user_email , comments)
values  (:id, :user_email, :comments); 

-- name:match_booking
SELECT t.user_email, t.id
FROM traveller t
INNER JOIN cab_booking c
ON c.id = t.id
WHERE c.from_loc = :from_loc AND c.to_loc = :to_loc
AND ((c.start_time <= :start_time AND c.end_time >= :start_time) OR (c.end_time >= :end_time AND c.start_time <= :end_time))
AND t.id != :id;
