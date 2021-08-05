const source = new EventSource('http://localhost:8125/events');

source.addEventListener(
    'message',
    function (e) {
        if (e.origin !== 'http://localhost:8125') {
            alert('Origin was not http://localhost:8125');
            return;
        }
        console.log(e);
        chrome.runtime.reload();
    },
    false
);

source.addEventListener(
    'open',
    function (e) {
        console.log('> Connection was opened');
    },
    false
);

source.addEventListener(
    'error',
    function (e) {
        if (e.eventPhase === 2) {
            //EventSource.CLOSED
            console.log('> Connection was closed');
        }
    },
    false
);
