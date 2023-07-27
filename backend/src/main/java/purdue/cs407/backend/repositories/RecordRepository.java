package purdue.cs407.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import purdue.cs407.backend.entities.SleepRecord;
import purdue.cs407.backend.entities.User;

import java.sql.Date;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecordRepository extends JpaRepository<SleepRecord, Long> {

    Collection<SleepRecord> findAllByUserOrderByDateAsc(User user);

    @Query("select s from SleepRecord s where s.user = ?1 and s.date >= ?2 and s.date <= ?3")
    List<SleepRecord> findAllByUserAndDateGreaterThanEqualAndDateLessThanEqual(User user, Date date, Date date2);
// Not sure why this didn't work yet..
//    @Query("SELECT AVG(r.sleepTime), AVG(r.downTime), AVG(r.fallingTime), AVG(r.restlessness), AVG(r.upTime), AVG(r.wakeUpCount) " +
//            "FROM SleepRecord r " +
//            "WHERE r.date >= :date1 AND r.date <= :date2 " +
//            "GROUP BY r.user " +
//            "HAVING r.user = :user1 ")

    /**
     * Get all sleep records between certain dates by a given user
     * @param userID - Long userID of user who created records
     * @param date1 - String start date
     * @param date2 - String end date
     * @return Collection<SleepRecord> (can be empty).
     */
    @Query(value = "SELECT * FROM sleep_record s WHERE s.user_id = :userID AND s.date >= STR_TO_DATE(:date1, '%Y-%m-%d') AND date <= STR_TO_DATE(:date2, '%Y-%m-%d') ORDER BY s.date", nativeQuery = true)
    Collection<SleepRecord> getBetween(@Param("userID") Long userID, @Param("date1") String date1, @Param("date2")String date2);

    SleepRecord findByRecordID(Long recordID);

    /**
     * Find a record by a given Date and User
     * @param user - User user who created the record.
     * @param date - Date date record is for.
     * @return - Optional<SleepRecord> with SleepRecord on success, null otherwise.
     */
    Optional<SleepRecord> findByUserAndDate(User user, Date date);

    /**
     * Get all the existing record dates from the current month by a given user.
     * @param userID - Long userID who created records.
     * @param start - String start date of month.
     * @param end - String end date of month.
     * @return - Collection<Date> (can be empty).
     */
    @Query(value = "SELECT s.date FROM sleep_record s WHERE s.user_id = :userID AND s.date >= STR_TO_DATE(:start, '%Y-%m-%d') AND date <= STR_TO_DATE(:end, '%Y-%m-%d')", nativeQuery = true)
    Collection<Date> getCalendarDates(@Param("userID")Long userID, @Param("start") String start, @Param("end") String end);

    /**
     * Get last 7 records by a user
     * @param user - User we wish to get records from
     * @return Collection of records (can be empty)
     */
    @Query(value = "SELECT s FROM SleepRecord s WHERE s.user = :user ORDER BY s.date DESC LIMIT 7")
    Collection<SleepRecord> getLastSeven(@Param("user") User user);

    /**
     * Get last 14 records by a user
     * @param user - User we wish to get records from
     * @return Collection of records (can be empty)
     */
    @Query(value = "SELECT s FROM SleepRecord s WHERE s.user = :user ORDER BY s.date DESC LIMIT 14")
    Collection<SleepRecord> getLastTwoWeeks(@Param("user") User user);

    /**
     * Check if a SleepRecord exists by a user with the given date.
     * @param user - User user who is checking.
     * @param date - Date date the user is checking against.
     * @return - Boolean true if another record exists, false otherwise.
     */
    Boolean existsByUserAndDate(User user, Date date);

    /**
     * Check if a SleepRecord exists aside from the given one with the same date.
     * Used primarily by update record if they are changing the date.
     * @param user - User user who is checking.
     * @param date - Date date of record to check.
     * @param recordID - Long recordID of current record that (might) have this date.
     * @return - True if another record exists, false otherwise.
     */
    Boolean existsByUserAndDateAndRecordIDNot(User user, Date date, Long recordID);

    /**
     * Delete all records by a user.
     * @param user - User user to delete records.
     */
    void deleteByUser(User user);
}