package DataStructures;

import java.util.*;

public class Scrape {
    // create a new scrape every session. As watches are completeed,
    // they are added to the arraylist
    private Date dateOfScrape;
    private Map<String, Watch> dict = new HashMap<String, Watch>();

    public Scrape() {
        dateOfScrape = new Date();
    }

    public void addWatch(Watch w) {
        dict.put(w.getRefNum(), w);
    }

    public Date getDate() {
        return dateOfScrape;
    }

    public Map<String, Watch> getDict() {
        return dict;
    }

    public Watch getWatch(String refNum) {
        return dict.get(refNum);
    }

}