package com.hitms.lab01;

/**
 * Prints a Hello World message.
 */
public final class HelloWorld {

    /**
     * Application entry point.
     *
     * @param args command-line arguments
     */
    public static void main(final String[] args) {
        System.out.println(
                "Hello, Software Construction! "
                        + "My name is Abdul Rafay Khalid.");
    }

    /**
     * Prevents instantiation of this utility class.
     */
    private HelloWorld() {
        // Utility class.
    }
}
