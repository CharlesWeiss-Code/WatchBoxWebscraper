package DataStructures;

import java.util.*;

public class Watch {
    private Time timeOfScrape;
    private String lowBox;
    private String lowPaper;
    private String highBox;
    private String highPaper;
    private float lowPrice;
    private float highPrice;
    private String lowLink;
    private String highLink;

    private ArrayList<Watch> previousScrapes = new ArrayList<Watch>(); // watches of the same reference number from
                                                                       // prevois
    // scrapes
    private Scrape scrape;

    public Watch(String lowBox, String lowPaper, String highBox, String highPaper, float lowPrice, float highPrice,
            String lowLink, String highLink, Time timeOfScrape) {

        this.lowBox = lowBox;
        this.lowPaper = lowPaper;
        this.highBox = highBox;
        this.highPaper = highPaper;
        this.lowPrice = lowPrice;
        this.highPrice = highPrice;
        this.highLink = highLink;
        this.timeOfScrape = timeOfScrape;
    }

    public void setScrape(Scrape s) {
        scrape = s;

    }
}