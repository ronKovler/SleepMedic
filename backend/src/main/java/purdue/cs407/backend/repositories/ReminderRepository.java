package purdue.cs407.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import purdue.cs407.backend.entities.Reminder;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    //List<Reminder> findAll();

    /**
     * Find a reminder by its ID
     * @param reminderID - Long reminderID to search for.
     * @return Optional<Reminder> with Reminder on success, null on failure.
     */
    Optional<Reminder> findByReminderID(Long reminderID);

}
