Author & Editor: CHARLES SOLOMON WEISS
Email: cweiss@thewatchbox.com

 - Watchbox web-scraper.

HOW TO USE:
    - Make sure that "./data.csv" is in the state that you want it to be 
    (for optimization purposes, I like the only objects in "./data.csv" to be watches that have been scraped in the current day).
    
    - For a complete scrape, make sure the for loop in each file in "./companies" is "for (var i = 0; i < refNums.length; i++)".
    This will ensure that every reference number is looked up in each website.
   
    - Make sure every reference number you want to look for is in "refNums.js", however,
    make sure to pase the reference number into each website and make sure it's POSSIBLE for a a result to come up.
    EX: Watchbox reference number is "16570 BLK IX OYS". That is not a regular rolex reference number.
    Because of this, make sure to add a SPECIAL URL to the "specialSites" variable (in "utilityFunctions.js") under the correct website the link is for.
    A special link for the special reference number above would be,
    "https://www.luxurybazaar.com/search-results?q=16570#/filter:lux_wa_dialcolor:Black",
    because it only includes the number "16570" in the main query but also has a dial color filter (represents the BLK IX OYS).
    You can find these special links by only pasing a section of the Watchbox (or real) reference number into the website, and then
    filter by dial color, size, braclet, etc... Once you are satisfied with the filtering, copy the link and pase it in its correct spot. 
    When the scraper tries to look up the special reference number on the website, the special link will take the space of the regular link.

    - To start the scraper, open a terminal and execute "node index". This will begin the scraping process. You will know the process has ended when you can type 
    a command and execute it in the terminal.  Scraped watches will begin to appear in "./data.csv" (ONLY if the current company has the line, 
    'fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n")'
    UNCOMMENTED after the watch object has been instantiated). On the contrary, if you want to stop the program from putting watches into 
    "./data.csv", but still want to see the watches being created, comment the "fs.appendFileSync" line by putting "//" before the "fs".  
    The line should turn grey. You will not see the watch object (in the console) if the watch object, "w" is not being printed. 
    Easy fix is "console.log(w)" after the watch object has been instantiated.
    
    - If YOU want to stop the program, press "control" and "c" synchronously and repeadedly and the program will crash. 
    If this fails, force quit the app and restart it.

    - If the program crashes OR you want to stop it for any reason, and continue the scrape WHERE YOU LEFT OFF, 
    (assuming all files in "./companies" are printing the URL and the refernce number), copy the latest reference number from the console,
    go to "./refNums.js" and press "command" and "f" synchronously, and then paste the reference number into the search bar. It will
    highlight the reference number. Take the line number of the highlighted reference number, subtract 6, and that is the new 
    index into "refNums" that you want to start with. If the scraper crashed at "./CandC.js" on reference number "79250BM-0001",
    the new index would be 24.  With that number in mind, comment out the preceeding functions to "CandC" in "./Index.js",
    and replace the for loop line that should be,
    "for (var i = 0; i < refNums.length; i++)",
    with,
    "for (var i = 24; i < refNums.length; i++)"
    The only difference is that you are starting with the "CandC" function and at index "24", the index that the scraper crashed at.
    If the scraper keeps crashing but you need data, repeat this process until the scrape is complete.  Once the scrape is complete,
    uncomment all company function in "index.js" and reset their for loop indices.


HOW TO FIX SELECTOR ERRORS:
        - A selector error will follow the structure of the example below,
--------------------------------------------------------------------------------------------------------------------------------
        throw new Error(`Error: failed to find element matching selector "${selector}"`);
        ^

Error: Error: failed to find element matching selector "Wrong selector"
at ElementHandle.$eval (/Users/charlieweiss/Desktop/Folders/GitHub/WatchBoxWebscraper/node_modules/puppeteer/lib/cjs/puppeteer/common/JSHandle.js:880:19)
at processTicksAndRejections (node:internal/process/task_queues:96:5)
at async start (/Users/charlieweiss/Desktop/Folders/GitHub/WatchBoxWebscraper/test2.js:77:3)
--------------------------------------------------------------------------------------------------------------------------------
        press "command" and click the mouse button synchronously, on the highest file in the hieratchy that YOU WROTE.
        in this example, mine is the bottom error, and I would command click the bottom, green path. It will immediatly
        take me to "./test2.js, line 77", the spot where the error and bad selector appear. In my example, 
        the bad seclector is "Wrong Selector".
        How to fix this:
            - replace "headless: true" with "headless: false" in "./index.js", and add, 
            "await page.waitForTimeout(9999999)",
            in the line above the error. This way you can go on inspecting mode, navigate to the correct selector, then copy and paste 
            the new selector in place of the old one.