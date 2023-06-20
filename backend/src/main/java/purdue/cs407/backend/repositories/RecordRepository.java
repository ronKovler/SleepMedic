package purdue.cs407.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import purdue.cs407.backend.models.SleepRecord;
import purdue.cs407.backend.models.User;

import java.sql.Date;
import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<SleepRecord, Integer> {

    List<SleepRecord> findAllByUser(User user);

    List<SleepRecord> findAllByUserAndDateBetween(User user, Date date, Date date2);

    SleepRecord findByUserAndDate(User user, Date date);

    SleepRecord findByRecordID(int recordID);
}