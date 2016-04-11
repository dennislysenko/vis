# vis
Dead simple visualizations based on 20-band audio frequency data, written in Javascript for ease of prototyping

## setup and editing
Clone. Edit visualizers.js (see first 'simpleBands' visualizer for a reasonably complete and straightforward example). Open vis.html in a browser to test. Do not worry about index.php or composer.json.

## contributing
For now, just add new visualizers to visualizers.js and pull requests will be welcome. In the future, maybe I'll start a separate repo for visualizers or just make a folder and auto-import ones from that folder.

## what about practical applications?
Keep an eye on https://github.com/dennislysenko/FFmpeg/tree/vis-filter for a ffmpeg port of selected filters. Check TODO as well.

## todo (please feel free to contribute here)
- Ability to visualize any song, without having it be hardcoded. (potential inspiration: https://github.com/michaelbromley/soundcloud-visualizer)

## how does it work?
I used FFmpeg to read in 10 seconds of a song with a relatively homogenous beat. Using FFmpeg's showfreqs filter, I generated FFT audio frequency data and put it into 20 empirically determined bins based on the frequencies visualizer from VLC. (Why? Individual bass frequencies are much more distinct than individual treble frequencies, so for example, bin #1 was frequency #1--lowest bass--while bin #20 was something like frequencies #173-256.) This sample data is hardcoded in bands.js. 
The visualization itself is done using HTML <canvas> and a very unadorned animation loop in Javascript.
