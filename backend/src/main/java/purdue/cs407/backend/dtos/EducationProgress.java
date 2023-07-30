package purdue.cs407.backend.dtos;

public class EducationProgress {
    private int week;
    private int day;

    public EducationProgress(int week, int day) {
        this.week = week;
        this.day = day;
    }

    public EducationProgress(){}

    public int getWeek() {
        return week;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }
}
