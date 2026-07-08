import play from 'play-dl';

async function testSoundCloud() {
    console.log("Fetching free client ID...");
    try {
        const clientID = await play.getFreeClientID();
        console.log("Got Client ID:", clientID);
        
        play.setToken({
            soundcloud: {
                client_id: clientID
            }
        });
        
        console.log("Searching for alan walker...");
        const results = await play.search('alan walker alone', { limit: 1, source: { soundcloud: 'tracks' } });
        console.log("Results found:", results.length);
        if (results.length > 0) {
            console.log(results[0].name, results[0].url);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

testSoundCloud();
