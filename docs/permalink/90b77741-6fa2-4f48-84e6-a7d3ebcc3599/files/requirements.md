
---

Even though the following strategy is untested,
it enables you to create applications.

Even if you have no experience programming,
if not with today’s AI, than certainly with tomorrows.

The first and foremost is the requirements document,
that is the real application.

You give it to AI, this year, next year, 25 years from now,
and it will re-create the application, better, each time.

Your first interactions are about creating the requirement document,
but you have to talk about programming things.

And I will help you, with easy ones, that you can imagine in your mind,
for an application as complex as a graphic based program builder.

---

MODES! That means your application will have a toolbox,
it can have pretty icons, abstract shapes, or can be hidden from view.

While not recommended, it is possible to switch modes with the keyboard,
but you need to study that use case yourself, browsers and OS’s are different.

---

Your first and foremost trick, whether the AI of today is ready for it or not,
is Plugin Architecture.

But let me just say, that you must always expect a better AI,
you don’t want to be stuck with weak requirements documents.

When the next, more powerful version of AI comes out,
you need to have your requirements document ready.

If today’s AI struggles with it, put stuff in the appendix,
and mark it as being for AI of a particular year.

---

Plugin architecture means you can replace features,
without breaking the application.

Example, is mini-map, you may want a better one,
more detailed one, you may want to sell a premium one.

On have your application decide which to install,
based on the client computer speed.

You may decide that a mini map is not needed,
in application that have pan and zoom.

Or you can leave it up to the user,
to decide if they want one on the screen.

---







You start with a base application,
HTML, single page, so that you can pase it whole into chat.

Which today, will trigger live app preview,
the AI will display the live application.

---



Let us begin, and not push the AI as hard as I described,
in hopes of getting something done today for a neat demo.

I really, really need to show you,
that you are a programmer now.

I know most people have a lot of problems understanding,
that the world has completely transformed.

---

Follow the requirements, create the program in a single index.html file.
Use web search if you need answers. Make the code beautiful, use latest modern JavaScript.


Visual Programming Language Based On New York Subway Map Look And Feel

 Visual programming language interface based on the New York subway map aesthetic.
 This is a comprehensive SVG-based application with interactive stations, connections, and a tile-based grid system.

Program Requirements Overview

This document outlines the requirements for a Visual Programming Language Based On Subway Map Builder.

- It is a full screen SVG Application implemented using pure DOM manipulation with no external dependencies.
- It adheres to MDN programming style.
- The application allows users to create and edit a subway map interactively by adding, connecting, and moving stations.
- It uses a lightweight event-driven architecture and reactive signals for managing state changes.

The SVG is divided into tiles. In other words the map is grid/tile based.
- This way there is no question what artifact the user wishes to interact with.
- Stations can't be placed one on top of the other
- Faint grid is visible

- Mouse cursor has different modes, based on selected tool.
- Toolbox, a small set of icons floats above the user interface
- White Triangle with black outline is the default mouse mode that selects of moves stations by dragging
- White Circle with black outline is the Subway Station Creation Tool, click on the map to create a station
- Green Rectangle with white outline is the connect stations mode, it allows clicking on a station and dragging a line out of it to another station, thus making a connection.

- A station when added to the UI is a White circle with a black outline,
- A connecting line, for when two stations are connected is a green line element.

- Dragging the map pans
- mousewheel zooms in and out

Event-Driven Interactions: All interactions emit events before executing actions.
Reactive Signals: Use signals for values that change (e.g., station coordinates, labels) with the following behavior:
Signals support .subscribe for listening to changes.
Signals have a .value getter/setter for accessing and updating values.
If a signal's value is non-null, the first subscription triggers an immediate callback to initialize subscribers.

Stations and Connections have labels, stations have a label above, connecting lines have labes in the middle. All labes have a white outline to make text easier to read.

Graph Data Structure: Implement a graph data structure beneath the UI, mirroring the DOM structure for stations and connections.
Event System: Utilize a lightweight EventEmitter for handling events, with signals built on top of it.

Technical Constraints:

Pure DOM: Use native DOM APIs for rendering and manipulation, following MDN best practices.
No Dependencies: Avoid external libraries or frameworks.
Lightweight Architecture: Optimize for performance with minimal overhead in event and signal implementations.


---

By submitting this text, the AI created a semi functional application,

---

I coudn't see anything at firtst, but there was an error,
and I told the AI: "I received an error: "Uncaught Error: TypeError: setting getter-only property "className""

And the AI responded:

Fixed Issue.

className Error: Changed from this.svg.className = '' to this.svg.classList.remove()
to properly handle the classList manipulation without trying to set a getter-only property.

---

Here I could only see the connecting lines and labes,
bu the station curcles were invisible.

So I said:
"I am unable to see the stations, I do see their labels. And the connecting lines are fine."

The AI responded:
I added explicit radius to the station curcles, removed unused radius styleshee, and created a cleaner hover effect.

---

Then I reported: Dragging the empty map area appears jagged, the stations and lines jump forward and back.
And the map, when dragged it is lagging behind the cursor. Mouse wheel zoom appears to work correctly.

The AI responded with fixes, but the problem reamind the same,
so I said:

The problem persists, it looks like the drag works at first, and then the viewport starts resisting, when dragging quickly it appears to jump back. Try again, Thank You.

The AI responded with: "I see the issue! The problem is that the mouse position calculation is being affected by the changing viewBox during dragging, creating a feedback loop. Let me fix this by using screen coordinates for dragging instead"

The AI fixed the issue, and I turned my attention to a less pressing problem,
that I described as follows:

The temporary orange line when I attempt to connect stations together does not appear to set the Y coordinate correctly, the X coordinate is correct,
the same problem with the Y coordinate occurs during placement of the station, the X appears to be correct, Y is too short.

At this point the code gre to be over 700 lines,
it is a bit large.

This is where the plugin architecture will be very useful,
we can just ask for specific plugins.

Or leave all plugins but the broken one out,
and focus on specifics.

---

I told the AI. We are running out of context space.
Please don't print full source code just the solution to the problem.

I am teaching my students how to use AI, and create open source applications. We are working on a Visual Programming application that looks like a subway map.

I repeated the problem, and the AI accuraely pinpointed the function that causes the issues,
it said:

"Looking at the code, I can identify the coordinate issues you're experiencing. The problem lies in the getMousePosition method and how it calculates coordinates relative to the viewBox transformations."

But the solution it provided,
failed.

Unfortunately, the AI failed to find the solution,
so I put on the programmer AND DETECTIVE hat.

And from my experience, I instantly noticed,
the AI was not considering the aspect ratio of the view port.

And I said:
I am sure that you are right about the function. But is it the aspect ratio?

And get this, the AI performred a web search for us,
what an age, we live in.

It said:

Yes, you're absolutely right! The aspect ratio is likely a major factor.
Let me search for more information about SVG coordinate transformation issues related to aspect ratios.

Seconds later it added:

"Exactly! You've hit the nail on the head. The aspect ratio mismatch is the core issue.
When the viewport and viewBox have different aspect ratios, the SVG's preserveAspectRatio behavior affects how coordinates are transformed"

I tested the code now on my computer, by dragging the index.html on my browser,
and it worked, the bug is no more.

So I said: "You fixed it. You are amazing."

The AI responded with:

Thank you! I'm really glad we got that sorted out. Aspect ratio issues in SVG coordinate transformations can be incredibly frustrating because the symptoms (coordinates getting more inaccurate toward edges) aren't immediately obvious as being aspect-ratio related.
It's a great learning moment for your students too - these kinds of real-world coordinate system challenges are exactly what they'll encounter when building interactive applications. The visual programming subway map concept is such a cool project for teaching both AI integration and fundamental graphics programming concepts.

Hope the rest of your subway map builder development goes smoothly! Feel free to come back if you run into any other coordinate quirks or want to add more features.

---

It works, but it also needs to take under account the aspect ratio. It looks accurate when the windows is a square. When it is a rectangle the grid lines on the side disappear.
Edit

You're absolutely right! The grid calculation needs to account for the aspect ratio and the actual visible area after letterboxing/pillarboxing. Let me fix that:
