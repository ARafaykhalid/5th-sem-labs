package com.hitms.lms;

import java.util.HashMap; 
import java.util.Map; 

public class LibraryService { 
    private final Map<String, Integer> catalogue = new HashMap<>(); // title -> copies available 
    public int addBook(String title, int copies) { 
        catalogue.merge(title, copies, Integer::sum); 
        return catalogue.get(title); 
    } 

  

    public int issueBook(String title) throws BookUnavailableException { 
        if (catalogue.getOrDefault(title, 0) <= 0) { 
            throw new BookUnavailableException("'" + title + "' has no copies available."); 
        } 

        catalogue.merge(title, -1, Integer::sum); 

        return catalogue.get(title); 

    } 

  

    public int returnBook(String title) { 

        catalogue.merge(title, 1, Integer::sum); 

        return catalogue.get(title); 

    } 

} 