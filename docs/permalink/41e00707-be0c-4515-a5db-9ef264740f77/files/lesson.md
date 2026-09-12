
We went through, filters having named outputs,
and there existing system outputs that filters can consume.

That one failed,
because it was too primitive.

---

A filter, is a program, so I asked about unix commands,
about mapping open text.txt and send output to a word counter.

Or, cat text.txt | wc, but in filtergraph notation,
and that woo was a failure as the brilliant AI was helping an ape learn.

A filter, has inputs and outputs, they are numbered, similar to unix,
but it is an arbitrary number, not the 0, 1, 2 in unix, that is in, out, and error.

In a filter that combines video files, you specify,
how many numbers you will use – so that was a total failure.

---

So it it is not named outputs,
and not presets inputs, maybe I thought, it is a fill blown vpl.

A visual programming language,
and this was correct.

But, that variable number of input and outputs,
still sticks out.

So let me tell you,
how a visual programming language works.

It operates around the concept of commands represents by boxes,
that have ports you can plug cables into.

Let us model a person, Alice, on her left has ear port, and wallet port,
to the ear we send words, and to the wallet we can send coins.

On her right side she has a mouth port,
that sends words.

Bob works the same way, and we can drag a cable, between alice mouth,
and bob ear, and now Alice words will be sent to bob.

We have inputs: ear and wallet,
and outputs mouth, the coins come from some other object.

The filters of ffmpeg filtergraph also have inputs and outputs,
but they are numbered, not labeled like ear or wallet.

And it is up to a particular filter,
with one or more inputs and outputs.

A black and white flitter just has input numbered zero,
and output numbered zero.

We don’t need names to understand, that color video goes in,
and black and white video goes out.

And now, here is the corruption, during connecting we don’t need to specify,
input 0, and output 0, because that is all there is, so we can skip it.

They employ convention over configuration,
achieving a hard to read, but quick to write shorthand notation.

However, it gets more complicated, the output 0 of say alice,
and input 0 of bob, to twist out previous example.

Need to referenced by a cable, to make a conection,
and they do this by putting an id at the end of alice,

Thus, by convention referencing that 0,
and that same label now needs to be placed before bob.

Referencing his default input numbered 0,
the black and white input in our filter example.

So one commands ends with say [x] in square brackets,
and another command begins with [x] in square brackets.

This is the shorthand notation that cables output of one thing,
and input of another.

But the [x] out cable mechanism,
is another concept.

Visually speaking t is like a cable, or a wire,
that by corruption/convention:

Is inserted into output:0 of the first command,
and and input:0 of your next command.

Black and white connects to resize-video,
perhaps.

But in ffmpeg output:0 represents a stream of data the command sends,
ffmpeg developers nicknamed these numbered outputs as pads.

Presumably like in electronics,
the shiny metal pads you can solder wires into.

So a numbered output pad, sends the data of your command,
such as black and white, to the numbered input pad of another command.

Perhaps such as resize-video, so that your black and white version of the video,
is smaller.

This kind of data, is called a stream, because you don’t’ send the whole video,
as that would take a long time, you send the video frame at a time.

So you are streaming the video, and as a fantastic side effect,
you don’t make some video format black and white, just the images.

Any programmer can turn an image black and wite,
and when all the frames are sent along, the video becomes black and white.

---

The numbered stream pad, often just 0,
is waiting to be told, where to send its stream of frames to.

And when you have another filer, it too itches to know,
when you will finally give it data.

So to send the stream, or to plug in the cable, or to solder the pads together,
you say, and by that convention again where the first thing is output pad 0:

black-and-white[stream1], and that means, you just named your cable,
how about them apples, the cable name is stream1.

And now you can tell the other command, the steam will come in,
on cable named stream1.

The AI explained to me, that the cable is the stream,
because it is a stream of frames, that spews out of pad 0.

So we name this stream stream1,
and then tell another command to use stream1 for input on pad 0.

And if a command accepts two streams,
where you want to combine two videos together.

Then the programmers, in what has become as you can tell by now,
corrupter convention genius and madness.

Allow you to mention multiple streams,
and that by convention means, the first stream sits on pad 0.

And the next stream, will be plugged into pad one,
when a programmer programs that command…

They just want you to do things in the right order,
perhaps video on pad 0 and audio on pad 1.

---

I fell well, thank you,
AI has passed my test.
