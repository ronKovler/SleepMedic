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

    List<SleepRecord> findAllByUser(User user);

    @Query("select s from SleepRecord s where s.user = ?1 and s.date >= ?2 and s.date <= ?3")
    List<SleepRecord> findAllByUserAndDateGreaterThanEqualAndDateLessThanEqual(User user, Date date, Date date2);
// Not sure why this didn't work yet..
//    @Query("SELECT AVG(r.sleepTime), AVG(r.downTime), AVG(r.fallingTime), AVG(r.restlessness), AVG(r.upTime), AVG(r.wakeUpCount) " +
//            "FROM SleepRecord r " +
//            "WHERE r.date >= :date1 AND r.date <= :date2 " +
//            "GROUP BY r.user " +
//            "HAVING r.user = :user1 ")
    @Query(value = "SELECT * FROM sleep_record s WHERE s.user_id = :userID AND s.date >= STR_TO_DATE(:date1, '%Y-%m-%d') AND date <= STR_TO_DATE(:date2, '%Y-%m-%d')", nativeQuery = true)
    Collection<SleepRecord> getBetween(@Param("userID") Long userID, @Param("date1") String date1, @Param("date2")String date2);


//    SleepRecord findByUserAndDate(User user, Date date);

    SleepRecord findByRecordID(Long recordID);

    Optional<SleepRecord> findByUserAndDate(User user, Date date);

    @Query(value = "SELECT s.date FROM sleep_record s WHERE s.user_id = :userID AND s.date >= STR_TO_DATE(:start, '%Y-%m-%d') AND date <= STR_TO_DATE(:end, '%Y-%m-%d')", nativeQuery = true)
    Collection<Date> getCalendarDates(@Param("userID")Long userID, @Param("start") String start, @Param("end") String end);
    Boolean existsByUserAndDate(User user, Date date);

    void deleteByUser(User user);
}