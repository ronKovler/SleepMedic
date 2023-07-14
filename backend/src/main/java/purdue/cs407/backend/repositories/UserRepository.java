package purdue.cs407.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import purdue.cs407.backend.entities.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmailEquals(String email);

    /**
     * Find a user based off their email address.
     * @param email - String email to search for.
     * @return - Optional<User> with user on success, null on failure.
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user exists with the given email
     * @param email - String email to check repository.
     * @return - Boolean True if found, false otherwise.
     */
    Boolean existsByEmail(String email);

    User findByEmailEqualsAndPasswordEquals(String email, String password);
    User findByUserID(Long userID);
    User findByUserIDEquals(Long userID);
    User getByUserID(Long userID);

    void deleteByUserID(Long userID);

}