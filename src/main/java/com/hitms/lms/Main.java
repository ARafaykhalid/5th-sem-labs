package com.hitms.lms;

import static com.hitms.lms.LibraryService.issueBook;

public class Main {

    public static void main(String[] args) {
        try {
            System.out.println(
                    "Remaining copies: " + issueBook(3, "Clean Code")
            );

            issueBook(0, "Clean Code");

        } catch (BookUnavailableException e) {
            System.out.println("Transaction failed: " + e.getMessage());
        }
    }
}
