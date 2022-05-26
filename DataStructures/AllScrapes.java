package DataStructures;

import java.util.*;

public class AllScrapes {

    private Date startOfScraping;

    private ArrayList<Scrape> allScrapes = new ArrayList<Scrape>();
    private Map<String, ArrayList<Watch>> dict = new HashMap<String, ArrayList<Watch>>();

    // above keeps track of all prevous scraped watches by reference number.

    public AllScrapes() {
        startOfScraping = new Date();
    }

    public void addScrape(Scrape s) {
        allScrapes.add(s);
        addToDict(s);
    }

    public void addToDict(Scrape s) {
        for (Map.Entry<String, Watch> entry : s.getDict().entrySet()) {
            dict.get(entry.getKey()).add(entry.getValue());
        }
    }

    public ArrayList<Scrape> getScrapesByTime(Date d) {
        ArrayList<Scrape> result = new ArrayList<Scrape>();
        for (Scrape s : allScrapes) {
            if (s.getDate() == d) {
                result.add(s);
            }
        }
        return result;
    }

    public ArrayList<Scrape> getAllScrapes() {
        return allScrapes;
    }

    public ArrayList<Watch> getWatchesByTime(String refNum, Date d) {
        ArrayList<Scrape> byTime = getScrapesByTime(d);
        ArrayList<Watch> result = new ArrayList<Watch>();
        for (Scrape s : byTime) {
            result.add(s.getWatch(refNum));
        }
        return result;
    }

    public Date getStartOfScraping() {
        return startOfScraping;
    }

    public Map<String, ArrayList<Watch>> getDict() {
        return dict;
    }
}