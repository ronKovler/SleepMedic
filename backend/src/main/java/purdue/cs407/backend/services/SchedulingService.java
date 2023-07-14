package purdue.cs407.backend.services;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.ScheduledFuture;

@Service
public class SchedulingService {
    private final TaskScheduler taskScheduler;
    Map<String, ScheduledFuture<?>> jobsMap = new HashMap<>();

    public SchedulingService(TaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

    /**
     * Schedule a task to run repetitively in the future until cancelled.
     * @param jobId - JobID String to name job with.
     * @param tasklet - Runnable object TaskExecutor instance
     * @param cronExpression - String cron expression to use for scheduling.
     * @param timeZone - String users timezone, should be result of getZoneName() from notificationController()
     */
    public void scheduleATask(String jobId, Runnable tasklet, String cronExpression, String timeZone) {
        System.out.println("Scheduling task with job id: " + jobId + " and cron expression: " + cronExpression);
        // TODO change TimeZone.getTimeZone("UTC") to users timezone or adjust users time to UTC.
        ScheduledFuture<?> scheduledTask = taskScheduler.schedule(tasklet, new CronTrigger(cronExpression, TimeZone.getTimeZone(timeZone)));
        jobsMap.put(jobId, scheduledTask);
    }

    /** Cancel a currently scheduled task.
     * @param jobId - String jobID of job to cancel.
     */
    public void removeScheduledTask(String jobId) {
        ScheduledFuture<?> scheduledTask = jobsMap.get(jobId);
        if(scheduledTask != null) {
            scheduledTask.cancel(true);
            jobsMap.put(jobId, null);
        }
    }
}
