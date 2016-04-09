#!python3
from tkinter import Tk, Canvas, PhotoImage, mainloop
from math import sin
import queue
import threading
import time

WIDTH, HEIGHT = 100, 100

f = open('bands.txt', 'r')
bands_raw =  f.read()
frames_raw = bands_raw.split("\n")
frames = []
for frame_raw in frames_raw:
	bands = frame_raw.split(" ")[:-2]
	frames.append(bands)

print(len(frames))

window = Tk()
canvas = Canvas(window, width=WIDTH, height=HEIGHT, bg="#000000")
canvas.pack()
img = PhotoImage(width=WIDTH, height=HEIGHT)
canvas.create_image((WIDTH/2, HEIGHT/2), image=img, state="normal")

def plot_frame(frame):
	global HEIGHT, frame_index

	bar_width = int(float(HEIGHT) / len(frame))

	def plot(x, y, color):
		global img
		img.put(color, (x, HEIGHT-y))

	print("new phone who dis " + str(frame_index))
	for i in range(len(frame)):
		for x in range(i * bar_width, i * bar_width + bar_width):
			for y in range(0, int(float(frame[i]) * HEIGHT)):
				plot(x, y, '#ffffff')

frame_index = 0
def load_next_frame():
	global frames, frame_index
	print("loading next frame??")
	frame = frames[frame_index]
	plot_frame(frame)
	frame_index += 1

load_next_frame()
window.update_idletasks()
window.update()
while frame_index < len(frames):
	time.sleep(1 / 42.0)
	load_next_frame()
	window.update_idletasks()
	window.update()
