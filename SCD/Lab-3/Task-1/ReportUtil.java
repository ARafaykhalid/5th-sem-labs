
public class ReportUtil {

    /**
     * Returns the average of an array of numeric scores.
     */
    public static double calculateAverage(int[] scores) {

        int total = 0;

        for (int s : scores) {

            total += s;

        }

        return (double) total / scores.length;

    }

    /**
     * Prints a short summary for an array of scores.
     */
    public static void printReport(int[] scores) {

        System.out.println("Average: " + calculateAverage(scores));

    }

    public static void main(String[] args) {

        int[] studentScores = {78, 92, 55, 88};

        printReport(studentScores);

    }

}
