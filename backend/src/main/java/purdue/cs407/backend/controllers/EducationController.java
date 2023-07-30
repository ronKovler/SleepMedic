package purdue.cs407.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.EducationProgress;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.repositories.UserRepository;

@RestController
@RequestMapping("/edu/")
@CrossOrigin(origins = "*")
public class EducationController {

    private final UserRepository userRepository;

    public EducationController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Helper method to view current user from session.
     * @return - User of current session.
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }
    @RequestMapping(value = "update_progress", method = RequestMethod.PATCH,
            consumes =  MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> updateProgress(@RequestBody EducationProgress request) {
        User user = getCurrentUser();
        byte day = (byte) request.getDay();
        byte week = (byte) request.getWeek();
        week = (byte) ((week << 4) & (0b11110000));
        day = (byte) (day & 0b00001111);
        byte progress = (byte) (week | day);
        user.setEducationProgress(progress);
        user = userRepository.save(user);

        return ResponseEntity.ok(1);
    }

    @RequestMapping(value = "get_progress", method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EducationProgress> getProgress() {
        User user = getCurrentUser();

        int week = (user.getEducationProgress() >> 4) & 0b00001111;
        int day = user.getEducationProgress() & 0b00001111;

        return ResponseEntity.ok(new EducationProgress(week, day));
    }
}
