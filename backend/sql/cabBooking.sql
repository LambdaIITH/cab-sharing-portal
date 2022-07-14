-- name:cab_booking<!
insert into cab_booking (date, start_time, end_time, comments, capacity, from_loc, to_loc) 
values (:date, :start_time, :end_time, :comments, :capacity, :from_loc, :to_loc)
returning id, start_time, end_time;

-- name:add_traveller!
insert into traveller (id, user_email)
values  (:id, :user_email); 

-- name:match_booking
SELECT t.user_email, t.id
FROM traveller t
INNER JOIN cab_booking c
ON c.id = t.id
WHERE c.from_loc = :from_loc AND c.to_loc = :to_loc
AND ((c.start_time <= :start_time AND c.end_time >= :start_time) OR (c.end_time >= :end_time AND c.start_time <= :end_time))
AND t.id != :id;