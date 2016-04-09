from tkinter import Tk, Canvas, PhotoImage, mainloop
from math import sin
import queue
import threading

WIDTH, HEIGHT = 720, 720

f = open('bands.txt', 'r')
bands_raw =  f.read()
frames_raw = bands_raw.split("\n")
frames = []
for frame_raw in frames_raw:
	bands = frame_raw.split(" ")[:-2]
	frames.append(bands)

print(len(frames))
print(frames[100])

window = Tk()
canvas = Canvas(window, width=WIDTH, height=HEIGHT, bg="#000000")
canvas.pack()
img = PhotoImage(width=WIDTH, height=HEIGHT)
canvas.create_image((WIDTH/2, HEIGHT/2), image=img, state="normal")

frame = frames[0]

print(len(frame))

bar_width = int(float(HEIGHT) / len(frame))

def plot(x, y, color):
	global img
	img.put(color, (x, HEIGHT-y))

# write code here

print(bar_width)
for i in range(len(frame)):
	for x in range(i * bar_width, i * bar_width + bar_width):
		for y in range(0, int(float(frame[i]) * HEIGHT)):
			plot(x, y, '#ffffff')

# ok now stop

mainloop()

class GUI:
	def __init__(self, master):
		self.master = master
		self.queue = queue.Queue()
		ThreadedTask(self.queue).start()
		self.master.after(100, self.process_queue)
	def process_queue(self):
		try:
			msg = self.queue.get(0)
			print(msg)
		except Queue.Empty:
			self.master.after(100, self.process_queue)

class ThreadedTask(threading.Thread):
	def __init__(self, queue):
		threading.Thread.__init__(self)
		self.queue = queue

	def run(self):
		time.sleep(5)
		self.queue.put('Task finished')
