package com.hitms.lms;

public class FineCalculator {

    private static final int GRACE_PERIOD_DAYS = 5;
    private static final double FINE_PER_DAY = 0.5;
    private static final double MAX_FINE = 20.0;

    public double calculateFine(int daysOverdue) {
        int chargeableDays = chargeableDays(daysOverdue);
        double fine = chargeableDays * FINE_PER_DAY;
        return capFine(fine);
    }

    private int chargeableDays(int daysOverdue) {
        return Math.max(0, daysOverdue - GRACE_PERIOD_DAYS);
    }

    private double capFine(double fine) {
        return Math.min(fine, MAX_FINE);
    }
}
