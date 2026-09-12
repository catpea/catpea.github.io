# The Music Label — MLML seed 01

**Fast + foresight:** the whole creative company exists as browsable intent before its recordings exist.

This seed contains **3 virtual artists, 30 planned albums, 120 named song briefs, and 4 companion notes** under Indie International / Star Records. Dr. Dreams explores wonder; Madame Volt explores theatrical rebellion; The Wild Atlas explores belonging. Each artist has a biography, a musical identity, and a distinct ten-album progression. The first album preserves the user's four briefs, correcting “starts” to “stars.” All other catalog content is an original proposed fictional seed, not a claim of commercial release, name clearance, or existing recordings.

## Open it

Open `index.html` in a browser. No server, package install, or network connection is needed for the supplied catalog.

The label, store, artists, albums, songs, companion notes, complete outline, and XML source are linked views of MLML. Search covers names and descriptions. Song pages show inherited context and can export/copy that context for a worker. You can edit a song brief or the complete XML, preview the changes, and export the result as MLML.

Edits remain **in the current tab** until exported. This reader does not silently overwrite local files. Export before closing or importing a different catalog. The supplied seed has no external dependencies; media or external links added later can of course access their referenced destinations.

## One source of truth

`label.mlml` is the authoring source. `index.html` contains an embedded snapshot so it also works directly from disk. Do not maintain that embedded copy independently.

After editing or replacing `label.mlml`, refresh the snapshot:

```sh
node build.mjs
```

Optional input and output paths:

```sh
node build.mjs my-label.mlml my-label.html
```

The builder uses Node's standard library. Browser import also opens a different MLML file immediately, without rebuilding. The builder embeds the source; XML parsing happens in the reader.

## The small language

```xml
<group name="Indie International">
  <label name="Star Records">
    <description>Music for becoming more.</description>
    <store name="The store">
      <description>Browse the label's catalog.</description>
    </store>
    <artist name="Dr. Dreams">
      <bio>A virtual songwriter who treats wonder as a serious responsibility.</bio>
      <style>Uplifting indie-electronic space rock; warm voice, bright synths, communal choruses.</style>
      <album name="Quest For The Stars" year="2026">
        <description>Learn freely, stand against cruelty, grow independent, and reach beyond Earth.</description>
        <song name="Born to Learn">Make curiosity feel larger than any classroom; turn learning into an invitation to become more.</song>
      </album>
    </artist>
  </label>
</group>
```

- **Containment is creative context.** A song inherits its album's intention, its artist's biography and style, and the label's purpose. Its own brief supplies the difference.
- **Song text is the brief.** A title is useful but optional. Do not replace a brief with generated lyrics.
- **`id` is stable identity.** The populated seed includes permanent IDs for links. The reader supplies missing IDs during import; exported IDs should not change when titles, order, or placement change. Document order gives album and track order, not the digits in the permanent IDs.
- **`href` means follow a link.** The seed links to companion journal entries with fragment links. It does not import them. **`src` identifies an actual resource.** The current reader supports lyrics and audio references; XML-fragment loading is not implemented.
- **`year` is a catalog-plan year here, not evidence of release.** No release history, audio, sales, subscribers, or audience statistics are fabricated.

The reader supports adding results to a song without altering its brief:

```xml
<song id="example-song" name="Example">
  Keep learning after the last school bell; make curiosity a lifelong invitation.
  <lyrics src="lyrics/example.txt" />
  <audio src="audio/example.mp3" />
</song>
```

The paths above are examples, not shipped files. Inline `<lyrics>…</lyrics>` also works. Lyrics references are linked, not automatically fetched. Audio has controls and does not autoplay. The brief can alternatively live in a child `<description>` when that is convenient for editing mixed content. Place exported audio beside the viewer at the referenced path, or use an authorized remote URL.

The four companion notes use optional `<journal>`, `<post>`, `<description>`, and `<body>` elements. The core group → label → artist → album → song tree does not depend on a journal.

## How workers should use it

This seed is **content plus a working reader**, not an agent runtime or a connected music generator.

A future worker receives the relevant branch, produces the missing artifact, and records its location. A peer checks the artifact against the same brief. A failed check produces a specific repair task. Acceptable results stay accepted unless their brief or an actual requirement changes. Retry limits and worker scheduling belong in the runtime, not in this creative document. Difficult items can be parked while the rest of the catalog advances; they should not become repeated requests for human approval.

Keep task queues, retries, credentials, resource leases, and provider details outside the content tree. Actual external transactions still respect predelegated permissions and budgets. Missing authority need not stop unrelated creative work.

The store is a browsable projection of the albums, not a separate inventory database and not a functioning checkout. No generation, publication, payment, or agent action is claimed by a button in this reader.
