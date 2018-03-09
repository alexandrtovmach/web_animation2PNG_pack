const CDP = require('chrome-remote-interface');

CDP((client) => {
    const { Page } = client;

    await Page.navigate({url: 'http://www.chartjs.org/samples/latest/charts/doughnut.html'});
    await Page.loadEventFired();
    await Page.startScreencast({format: 'png', everyNthFrame: 1});

    let counter = 0;
    while(counter < 100){
      const {data, metadata, sessionId} = await Page.screencastFrame();
      console.log(metadata);
      await Page.screencastFrameAck({sessionId: sessionId});
    }
}).on('error', (err) => {
    // cannot connect to the remote endpoint
    console.error(err);
});