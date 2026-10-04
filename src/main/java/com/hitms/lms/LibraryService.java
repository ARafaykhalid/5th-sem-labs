package com.hitms.lms;

public class LibraryService {

    /**
     * Returns the copy count after issuing one copy of a title.
     * 
     * @param availableCopies the number of copies available for the title.
     * @param title the title of the book to issue.
     * @return the number of copies available after issuing one copy.
     * @throws BookUnavailableException if availableCopies is 0.
     */
    public static int issueBook(int availableCopies, String title)
            throws BookUnavailableException {

        if (availableCopies <= 0) {
            throw new BookUnavailableException(
                    "'" + title + "' has no copies available."
            );
        }

        return availableCopies - 1;
    }

}
