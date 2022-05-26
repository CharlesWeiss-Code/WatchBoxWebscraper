package DataStructures;

import java.util.*;

public class AllScrapes {

    private Date startOfScraping;

    private ArrayList<Scrape> allScrapes = new ArrayList<Scrape();

    public AllScrapes() {
        startOfScraping = new Date();
    }

    public void addScrape(Scrape s) {
        allScrapes.add(s);
    }

    public ArrayList<Scrape> getAllScrapes() {
        return allScrapes;
    }

    public Date getStartOfScraping() {
        return startOfScraping;
    }

}
