Imagine this as the only complicated piece of code that you need to understand,
eveything else is just stand-alone funcions that AI taked good care of.

```js
 return flow([

    // ─── INITIALIZATION ────────────────────────────────────────
    [inlineHtml, parseHtml, populateElement, 'ready'],
    [storedXml,  parseXml,  populateElement, 'ready'],
    ['ready', announcePresence, 'announced'],

    // ─── CHANNEL (single producer) ─────────────────────────────
    [channelMessages, 'msg'],

    // ─── HANDSHAKE (branch from 'msg') ─────────────────────────
    ['msg', isStateRequest, sendStateResponse, 'responded'],
    ['msg', isStateResponseForUs, collectState, 'collected'],

    // Adopt once we have responses (debounced for N peers)
    ['collected', handshake, adoptBestState, markReady, 'live'],

    // Fallback: become live even if nobody replies
    [afterDelay(300), adoptBestState, markReady, 'live'],

    // ─── LOCAL CHANGES ─────────────────────────────────────────
    [dataMutation, whenReady, bumpRevision, 'local'],
    ['local', broadcastChange, 'broadcasted'],
    ['local', save, saveToStorage, 'saved'],

    // ─── REMOTE CHANGES ────────────────────────────────────────
    ['msg', isChangeMessage, whenReady, compareWithLocal, 'compared'],
    ['compared', remoteWins, applyRemoteChange, 'applied'],
    ['compared', isConflict, notifyConflict, 'conflicted'],
    ['applied', save, saveToStorage, 'saved'],

  ], { shared });
}
```

Note: afterDelay(300) configures the afterDelay funcion, but if you just say afterDelay, then the resonable default value kicks in

Note: the strings in arrays are names of cables:

```js
[ 'some_existing_input_cable', aFuncionThatProcessesDataComingFromTheCable({optionallyConfigurable:true}, 'the_resulting_output_cable_that_can_be_used_elsewhere') ]
```
