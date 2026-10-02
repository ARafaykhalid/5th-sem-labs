package com.hitms.lms;

public class LibraryService {

    /**
     * Returns the copy count after issuing one copy of a title.
     *
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
