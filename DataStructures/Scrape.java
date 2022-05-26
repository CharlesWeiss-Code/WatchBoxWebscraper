package DataStructures;

import java.util.*;

public class Scrape {
    // create a new scrape every session. As watches are completeed,
    // they are added to the arraylist
    private Date dateOfScrape;
    private ArrayList<Watch> watches = new ArrayList<Watch>();

    public Scrape() {
        dateOfScrape = new Date();
    }

    public void addWatch(Watch w) {
        watches.add(w);
    }

    public Date getDate() {
        return dateOfScrape;
    }

    public ArrayList<Watch> getWatches() {
        return watches;
    }

}