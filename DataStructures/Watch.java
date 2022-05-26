package DataStructures;

import java.util.*;

public class Watch {
    private Date dateOfScrape;
    private String lowBox;
    private String lowPaper;
    private String highBox;
    private String highPaper;
    private float lowPrice;
    private float highPrice;
    private String lowLink;
    private String highLink;
    // IMAGE??????

    private ArrayList<Watch> previousScrapes = new ArrayList<Watch>(); // watches of the same reference number from
                                                                       // prevois
    // The scrape session that this watch was instantiated from.
    private Scrape scrape;

    public Watch(String lowBox, String lowPaper, String highBox, String highPaper, float lowPrice, float highPrice,
            String lowLink, String highLink) {

        this.lowBox = lowBox;
        this.lowPaper = lowPaper;
        this.highBox = highBox;
        this.highPaper = highPaper;
        this.lowPrice = lowPrice;
        this.highPrice = highPrice;
        this.highLink = highLink;
        this.dateOfScrape = new Date();
    }

    public void setScrape(Scrape s) {
        scrape = s;

    }

    public Scrape getScrape() {
        return scrape;

    }

    public ArrayList<Watch> getPreviousScrapes() {
        return previousScrapes;

    }

    public float getLowPrice() {
        return lowPrice;
    }

    public float getHighPrice() {
        return highPrice;
    }

    public String getLowLink() {
        return lowLink;

    }

    public String getHighLink() {
        return highLink;

    }

    public String getLowPaper() {
        return lowPaper;

    }

    public String getHighPaper() {
        return highPaper;

    }

    public Date getDateOfScrape() {
        return dateOfScrape;

    }

    public String getLowBox() {
        return lowBox;

    }

    public String getHighBox() {
        return highBox;

    }
}