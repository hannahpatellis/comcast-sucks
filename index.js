const casper = require('casper').create();
require('dotenv').config();

casper.start();

casper
  .then(function(){
    console.log("--- Process started ---");
  })
  .thenOpen("https://www.domain.com/page1")
  .then(function(){
    // scrape something
    this.echo(this.getHTML('h1#foobar'));
  })
  .thenClick("#button1")
  .then(function(){
    // scrape something else
    this.echo(this.getHTML('h2#foobar'));
  })
  .thenClick("#button2")
  thenOpen("http://myserver.com", {
    method: "post",
    data: {
        my: 'data',
    }
  }, function() {
      this.echo("data sent back to the server")
  })
  .then(function() {
    console.log("--- Process ended ---");
  });

casper.run(); 